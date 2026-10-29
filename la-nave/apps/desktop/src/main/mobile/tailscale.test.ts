import { describe, expect, it, vi } from 'vitest';
import { Tailscale, parseStatus } from './tailscale';
import type { TailscaleDeps } from './tailscale';

const deps = (over: Partial<TailscaleDeps> = {}): TailscaleDeps => ({
  platform: 'linux',
  env: { PATH: '/usr/bin:/opt/ts' },
  exists: (p) => p === '/opt/ts/tailscale',
  exec: async () => ({ stdout: '', stderr: '' }),
  ...over
});

describe('parseStatus (tolerante)', () => {
  it('lee el nombre del equipo sin el punto final y el estado', () => {
    expect(parseStatus('{"BackendState":"Running","Self":{"DNSName":"Mi-PC.tail1234.ts.net."}}')).toEqual({ installed: true, running: true, dnsName: 'mi-pc.tail1234.ts.net' });
    expect(parseStatus('{"BackendState":"Stopped","Self":{"DNSName":"x.ts.net."}}').running).toBe(false);
  });

  it('SEGURIDAD: un nombre raro (con espacios, barras o comillas) se descarta; basura o JSON roto no lanza', () => {
    for (const bad of ['mal nombre.ts.net.', 'a/b.ts.net.', '"><script>.ts.net.', '']) {
      expect(parseStatus(JSON.stringify({ BackendState: 'Running', Self: { DNSName: bad } })).dnsName, bad).toBeNull();
    }
    expect(parseStatus('esto no es json')).toEqual({ installed: true, running: false, dnsName: null });
    expect(parseStatus('{"Self":null}')).toMatchObject({ running: false, dnsName: null });
  });
});

describe('Tailscale', () => {
  it('sin el programa instalado lo dice y no ejecuta nada', async () => {
    const exec = vi.fn();
    const ts = new Tailscale(deps({ exists: () => false, exec }));
    expect(await ts.status()).toEqual({ installed: false, running: false, dnsName: null });
    expect((await ts.publish(47831)).ok).toBe(false);
    expect(exec).not.toHaveBeenCalled();
  });

  it('lo encuentra en el PATH y en las rutas de instalación habituales de Windows y macOS', () => {
    expect(new Tailscale(deps()).findBinary()).toBe('/opt/ts/tailscale');
    const win = new Tailscale(deps({ platform: 'win32', env: { PATH: '', ProgramFiles: 'C:\\Program Files' }, exists: (p) => p.endsWith('Tailscale\\tailscale.exe') || p.endsWith('Tailscale/tailscale.exe') }));
    expect(win.findBinary()).toContain('tailscale.exe');
    expect(new Tailscale(deps({ platform: 'darwin', env: {}, exists: (p) => p.includes('Tailscale.app') })).findBinary()).toContain('Tailscale.app');
  });

  it('SEGURIDAD: publica con `serve` (nunca `funnel`), sin shell y solo con un puerto entero válido', async () => {
    const exec = vi.fn(async () => ({ stdout: 'Available within your tailnet', stderr: '' }));
    const ts = new Tailscale(deps({ exec }));
    expect(ts.serveArgs(47831)).toEqual(['serve', '--bg', 'http://127.0.0.1:47831']);
    expect(ts.serveArgs(47831).join(' ')).not.toContain('funnel');
    expect(await ts.publish(47831)).toEqual({ ok: true, output: 'Available within your tailnet' });
    expect(exec).toHaveBeenCalledWith('/opt/ts/tailscale', ['serve', '--bg', 'http://127.0.0.1:47831']);
    for (const bad of [0, -1, 70000, 1.5, Number.NaN, '47831; rm -rf /' as unknown as number]) expect(() => ts.serveArgs(bad), String(bad)).toThrow();
  });

  it('si el comando falla devuelve su salida para mostrarla en vez de lanzar', async () => {
    const ts = new Tailscale(deps({ exec: async () => Promise.reject(Object.assign(new Error('x'), { stderr: 'Serve is not enabled on your tailnet.', stdout: '' })) }));
    expect(await ts.publish(47831)).toEqual({ ok: false, output: 'Serve is not enabled on your tailnet.' });
    const status = await ts.status();
    expect(status).toEqual({ installed: true, running: false, dnsName: null });
  });
});
