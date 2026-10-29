import { createServer } from 'node:net';
import { mkdtempSync } from 'node:fs';
import { request } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handlersFor } from '../handlers';
import type { Services } from '../handlers';
import { startCore } from '../nave';
import { MobileService } from './service';
import { Tailscale } from './tailscale';
import type { TailscaleDeps } from './tailscale';

const services: MobileService[] = [];
afterEach(async () => {
  await Promise.all(services.splice(0).map((s) => s.stop()));
});

function setup(ts: Partial<TailscaleDeps> = {}, port?: number) {
  const dir = mkdtempSync(join(tmpdir(), 'nave-msvc-'));
  const core = startCore(dir, '0.0.1');
  if (port !== undefined) core.settings.setRaw('mobile.port', port);
  const tailscale = new Tailscale({
    platform: 'linux',
    env: { PATH: '/bin' },
    exists: (p) => p === '/bin/tailscale',
    exec: async (_f, args) => (args[0] === 'status' ? { stdout: '{"BackendState":"Running","Self":{"DNSName":"mi-pc.tail1.ts.net."}}', stderr: '' } : { stdout: 'ok', stderr: '' }),
    ...ts
  });
  const ref: { handlers?: ReturnType<typeof handlersFor> } = {};
  const mobile = new MobileService({
    db: core.db,
    bus: core.bus,
    settings: core.settings,
    log: core.log.app,
    tailscale,
    staticDir: null,
    handlers: () => ref.handlers as NonNullable<typeof ref.handlers>,
    onError: vi.fn()
  });
  ref.handlers = handlersFor({ projects: core.projects, tasks: core.tasks, brain: core.brain, settings: core.settings, overview: core.overview, search: core.search, backups: core.backups, mobile, terminals: {}, claude: {} } as unknown as Services);
  services.push(mobile);
  return { core, mobile };
}

const get = (port: number, path: string, host: string): Promise<number> =>
  new Promise((resolve, reject) => {
    const req = request({ host: '127.0.0.1', port, path, headers: { Host: host } }, (res) => {
      res.resume();
      resolve(res.statusCode ?? 0);
    });
    req.on('error', reject);
    req.end();
  });

describe('MobileService', () => {
  it('está DESACTIVADO por defecto y no abre ningún puerto', async () => {
    const { mobile } = setup();
    expect(await mobile.status()).toMatchObject({ enabled: false, running: false, port: null, localUrl: null, publicUrl: null });
    await expect(mobile.startPairing()).rejects.toThrow(/Activa primero/);
    await expect(mobile.publish()).rejects.toThrow(/Activa primero/);
  });

  it('al activarlo arranca en 127.0.0.1 con el puerto habitual y se puede volver a apagar', async () => {
    const { mobile, core } = setup();
    const on = await mobile.setEnabled(true);
    expect(on).toMatchObject({ enabled: true, running: true, port: 47831, localUrl: 'http://127.0.0.1:47831' });
    expect(core.settings.raw('mobile.enabled')).toBe(true);
    expect(await get(47831, '/', '127.0.0.1:47831')).toBe(404); // sin web instalada, pero responde
    const off = await mobile.setEnabled(false);
    expect(off).toMatchObject({ enabled: false, running: false, port: null });
    await expect(get(47831, '/', '127.0.0.1:47831')).rejects.toThrow();
  });

  it('si el puerto habitual está ocupado usa otro libre y lo recuerda; hay que volver a publicar', async () => {
    const blocker = createServer();
    await new Promise<void>((resolve) => blocker.listen(47831, '127.0.0.1', resolve));
    try {
      const { mobile, core } = setup();
      core.settings.setRaw('mobile.published', true);
      const status = await mobile.setEnabled(true);
      expect(status.running).toBe(true);
      expect(status.port).not.toBe(47831);
      expect(core.settings.raw('mobile.port')).toBe(status.port);
      expect(core.settings.raw('mobile.published')).toBe(false);
    } finally {
      await new Promise<void>((resolve) => blocker.close(() => resolve()));
    }
  });

  it('arranque automático: solo si estaba activado', async () => {
    const off = setup();
    await off.mobile.autostart();
    expect((await off.mobile.status()).running).toBe(false);
    const on = setup(undefined, 47832);
    on.core.settings.setRaw('mobile.enabled', true);
    await on.mobile.autostart();
    expect(await on.mobile.status()).toMatchObject({ running: true, port: 47832 });
  });

  it('el QR usa la dirección local hasta publicar con Tailscale, y después la del móvil; el código va en el fragmento', async () => {
    const { mobile } = setup(undefined, 47833);
    await mobile.setEnabled(true);
    const local = await mobile.startPairing();
    expect(local.via).toBe('local');
    expect(local.url).toMatch(/^http:\/\/127\.0\.0\.1:47833\/#[0-9a-f]{32}$/);
    expect(await mobile.publish()).toEqual({ ok: true, output: 'ok' });
    const remote = await mobile.startPairing();
    expect(remote.via).toBe('tailscale');
    expect(remote.url).toMatch(/^https:\/\/mi-pc\.tail1\.ts\.net\/#[0-9a-f]{32}$/);
    expect(new Date(remote.expiresAt).getTime()).toBeGreaterThan(Date.now());
    // el nombre de la red privada ya es un Host válido para el servidor
    expect(await get(47833, '/', 'mi-pc.tail1.ts.net')).toBe(404);
    expect(await get(47833, '/', 'malo.example')).toBe(403);
  });

  it('si publicar falla NO se marca como publicado y se enseña la salida', async () => {
    const { mobile, core } = setup({ exec: async (_f, args) => (args[0] === 'status' ? { stdout: '{"BackendState":"Running","Self":{"DNSName":"x.ts.net."}}', stderr: '' } : Promise.reject(Object.assign(new Error('x'), { stderr: 'Serve no está activado', stdout: '' }))) }, 47834);
    await mobile.setEnabled(true);
    expect(await mobile.publish()).toEqual({ ok: false, output: 'Serve no está activado' });
    expect(core.settings.raw('mobile.published')).not.toBe(true);
    expect((await mobile.status()).publicUrl).toBeNull();
  });

  it('listar y revocar móviles; revocar uno que no existe da un error claro', async () => {
    const { mobile } = setup(undefined, 47835);
    const { device } = mobile.devices.add('Pixel');
    expect(mobile.listDevices().map((d) => d.name)).toEqual(['Pixel']);
    expect(mobile.revoke(device.id)).toBeNull();
    expect(() => mobile.revoke(device.id)).toThrow(/ya no está emparejado/);
  });

  it('al desactivar, el código de emparejamiento pendiente deja de valer', async () => {
    const { mobile } = setup(undefined, 47836);
    await mobile.setEnabled(true);
    await mobile.startPairing();
    expect(mobile.pairing.active).toBe(true);
    await mobile.setEnabled(false);
    expect(mobile.pairing.active).toBe(false);
  });
});
