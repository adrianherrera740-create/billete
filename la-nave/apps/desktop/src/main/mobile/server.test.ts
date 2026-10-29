import { mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from 'node:fs';
import { request } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createLogger, createMemorySink } from '@nave/core';
import { CHANNELS } from '@nave/shared';
import type { ChannelName } from '@nave/shared';
import { handlersFor } from '../handlers';
import type { Handlers, Services } from '../handlers';
import { startCore } from '../nave';
import { Devices, Pairing, RateLimiter, sha256 } from './auth';
import { MobileServer } from './server';

const servers: MobileServer[] = [];
afterEach(async () => {
  await Promise.all(servers.splice(0).map((s) => s.stop()));
});

async function setup(options: { extraHosts?: string[]; deviceLimit?: number; withStatic?: boolean } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'nave-mobile-'));
  const core = startCore(dir, '0.0.1');
  const services = { projects: core.projects, tasks: core.tasks, brain: core.brain, settings: core.settings, overview: core.overview, search: core.search, backups: core.backups, mobile: {}, terminals: {}, claude: {} } as unknown as Services;
  const real = handlersFor(services);
  const calls: string[] = [];
  const handlers = new Proxy(real, {
    get: (target, prop: string) => (...args: unknown[]) => {
      calls.push(prop);
      return (target as unknown as Record<string, (...a: unknown[]) => unknown>)[prop]?.(...args);
    }
  }) as Handlers;
  const staticDir = join(dir, 'web');
  if (options.withStatic !== false) {
    mkdirSync(join(staticDir, 'assets'), { recursive: true });
    writeFileSync(join(staticDir, 'index.html'), '<!doctype html><title>La Nave móvil</title>');
    writeFileSync(join(staticDir, 'assets', 'app-abc123.js'), 'console.log(1)');
    writeFileSync(join(staticDir, 'manifest.webmanifest'), '{}');
    writeFileSync(join(dir, 'secreto.txt'), 'NO DEBE SALIR');
    symlinkSync(join(dir, 'secreto.txt'), join(staticDir, 'enlace.txt'));
  }
  const sink = createMemorySink();
  const pairing = new Pairing();
  const devices = new Devices(core.db);
  const server = new MobileServer({
    handlers,
    devices,
    pairing,
    staticDir: options.withStatic === false ? null : staticDir,
    extraHosts: () => options.extraHosts ?? [],
    log: createLogger('app', sink),
    onError: vi.fn(),
    pairLimiter: new RateLimiter(10, 60_000),
    deviceLimiter: new RateLimiter(options.deviceLimit ?? 1000, 60_000)
  });
  servers.push(server);
  const port = await server.start(0);
  const pair = async (): Promise<string> => {
    const { code } = pairing.start();
    const res = await call(port, 'POST', '/api/pair', {}, JSON.stringify({ code, name: 'Test' }));
    return (JSON.parse(res.body) as { data: { token: string } }).data.token;
  };
  return { core, server, port, pairing, devices, handlers, calls, sink, pair, db: core.db, staticDir };
}

interface Res {
  status: number;
  body: string;
  headers: Record<string, string | string[] | undefined>;
}

function call(port: number, method: string, path: string, headers: Record<string, string>, body?: string | Buffer, host = `127.0.0.1:${port}`): Promise<Res> {
  return new Promise((resolve, reject) => {
    const req = request({ host: '127.0.0.1', port, path, method, headers: { Host: host, ...headers } }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode ?? 0, body: Buffer.concat(chunks).toString('utf8'), headers: res.headers }));
    });
    req.on('error', (error: NodeJS.ErrnoException) => (error.code === 'ECONNRESET' || error.code === 'EPIPE' ? resolve({ status: 413, body: '', headers: {} }) : reject(error)));
    req.end(body);
  });
}

const rpc = (port: number, token: string, channel: string, input?: unknown, extra: Record<string, string> = {}) =>
  call(port, 'POST', `/api/rpc/${channel}`, { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...extra }, input === undefined ? '' : JSON.stringify(input));

describe('servidor móvil: red y cabeceras', () => {
  it('escucha solo en 127.0.0.1', async () => {
    const { server } = await setup();
    const inner = (server as unknown as { server: { address(): { address: string } } }).server;
    expect(inner.address().address).toBe('127.0.0.1');
  });

  it('SEGURIDAD: rechaza un Host que no es el suyo (DNS rebinding) y acepta el de la red privada configurado', async () => {
    const { port } = await setup({ extraHosts: ['mi-pc.tail1234.ts.net'] });
    expect((await call(port, 'GET', '/', {}, undefined, 'malo.example')).status).toBe(403);
    expect((await call(port, 'GET', '/', {}, undefined, 'localhost:1')).status).toBe(403);
    expect((await call(port, 'GET', '/', {}, undefined, 'mi-pc.tail1234.ts.net')).status).toBe(200);
    expect((await call(port, 'GET', '/', {}, undefined, `127.0.0.1:${port}`)).status).toBe(200);
  });

  it('todas las respuestas llevan cabeceras de seguridad y la API no se cachea', async () => {
    const { port, pair } = await setup();
    const html = await call(port, 'GET', '/', {});
    expect(html.headers['content-security-policy']).toContain("default-src 'self'");
    expect(html.headers['x-content-type-options']).toBe('nosniff');
    expect(html.headers['x-frame-options']).toBe('DENY');
    expect(html.headers['cache-control']).toBe('no-store');
    const token = await pair();
    const api = await rpc(port, token, 'project:list', { includeArchived: false });
    expect(api.headers['cache-control']).toBe('no-store');
    expect(api.headers['content-security-policy']).toBeDefined();
  });
});

describe('servidor móvil: emparejamiento', () => {
  it('con el código correcto entrega un token; el código no se puede reutilizar', async () => {
    const { port, pairing, db, sink } = await setup();
    const { code } = pairing.start();
    const ok = await call(port, 'POST', '/api/pair', {}, JSON.stringify({ code, name: 'Pixel' }));
    expect(ok.status).toBe(200);
    const { token, name } = (JSON.parse(ok.body) as { data: { token: string; name: string } }).data;
    expect(name).toBe('Pixel');
    expect((await call(port, 'POST', '/api/pair', {}, JSON.stringify({ code }))).status).toBe(401);
    // SEGURIDAD: en la BD solo el hash; en los logs, ni el token ni el código
    expect(JSON.stringify(db.prepare('SELECT * FROM mobile_devices').all())).not.toContain(token);
    expect((db.prepare('SELECT token_hash FROM mobile_devices').get() as { token_hash: string }).token_hash).toBe(sha256(token));
    expect(sink.lines.join('\n')).not.toContain(token);
    expect(sink.lines.join('\n')).not.toContain(code);
  });

  it('un código falso, vacío o sin cuerpo da 401 sin pistas; tras 5 fallos el correcto ya no vale', async () => {
    const { port, pairing } = await setup();
    const { code } = pairing.start();
    for (let i = 0; i < 5; i++) expect((await call(port, 'POST', '/api/pair', {}, JSON.stringify({ code: 'a'.repeat(32) }))).status).toBe(401);
    expect((await call(port, 'POST', '/api/pair', {}, JSON.stringify({ code }))).status).toBe(401);
    expect((await call(port, 'POST', '/api/pair', {}, '{}')).status).toBe(401);
    expect((await call(port, 'POST', '/api/pair', {}, 'no json')).status).toBe(400);
  });

  it('limita los intentos de emparejamiento por minuto', async () => {
    const { port } = await setup();
    const statuses: number[] = [];
    for (let i = 0; i < 14; i++) statuses.push((await call(port, 'POST', '/api/pair', {}, '{}')).status);
    expect(statuses.slice(0, 10).every((s) => s === 401)).toBe(true);
    expect(statuses.slice(10).every((s) => s === 429)).toBe(true);
  });
});

describe('servidor móvil: la lista cerrada de canales (ADR-002)', () => {
  it('sin token o con token falso: 401', async () => {
    const { port, calls } = await setup();
    expect((await call(port, 'POST', '/api/rpc/project:list', {}, '{"includeArchived":false}')).status).toBe(401);
    expect((await rpc(port, 'x'.repeat(43), 'project:list', { includeArchived: false })).status).toBe(401);
    expect(calls).toEqual([]);
  });

  it('SEGURIDAD: recorre TODOS los canales: los prohibidos dan 403 y no llegan a ejecutarse; los permitidos, sí', async () => {
    const { port, pair, calls } = await setup();
    const token = await pair();
    for (const name of Object.keys(CHANNELS) as ChannelName[]) {
      calls.length = 0;
      const res = await rpc(port, token, name, {});
      if (CHANNELS[name].remote === 'forbidden') {
        expect(res.status, name).toBe(403);
        expect(calls, name).toEqual([]);
      } else {
        expect(res.status, name).toBe(200);
      }
    }
  });

  it('los canales de gestión del PC (terminales, Claude, Brain, ajustes, copias, búsqueda global) están prohibidos', async () => {
    const { port, pair } = await setup();
    const token = await pair();
    for (const name of ['terminal:start', 'terminal:input', 'claude:paste', 'claude:resume', 'brain:create', 'brain:search', 'settings:update', 'backup:restore', 'backup:create', 'search:global', 'project:create', 'project:archive', 'panel:create', 'panel:delete', 'task:delete', 'note:delete']) {
      expect((await rpc(port, token, name, {})).status, name).toBe(403);
    }
  });

  it('canal inexistente o con nombre de prototipo: 404', async () => {
    const { port, pair } = await setup();
    const token = await pair();
    for (const name of ['nada:nada', 'constructor', 'a:__proto__', 'task:list/../x', 'toString:x']) {
      expect((await rpc(port, token, name, {})).status, name).toBe(404);
    }
  });

  it('los parsers siguen mandando: entradas inválidas dan un error VALIDATION y no tocan nada', async () => {
    const { port, pair, core } = await setup();
    const token = await pair();
    const project = core.projects.create({ name: 'P' });
    for (const bad of [{ projectId: project.id, title: '' }, { projectId: project.id, title: 'x', extra: 1 }, { title: 'x' }, null, 'texto']) {
      const res = await rpc(port, token, 'task:create', bad);
      expect(JSON.parse(res.body)).toMatchObject({ ok: false, error: { code: 'VALIDATION' } });
    }
    expect(core.tasks.listTasks(project.id)).toEqual([]);
  });

  it('flujo real: resumen, listar proyectos, crear y actualizar tareas y notas desde el móvil', async () => {
    const { port, pair, core } = await setup();
    const token = await pair();
    const project = core.projects.create({ name: 'Tienda' });
    const created = JSON.parse((await rpc(port, token, 'task:create', { projectId: project.id, title: 'Desde el móvil' })).body) as { ok: true; data: { id: string } };
    expect(created.ok).toBe(true);
    await rpc(port, token, 'task:update', { id: created.data.id, status: 'done' });
    expect(core.tasks.task(created.data.id)).toMatchObject({ title: 'Desde el móvil', status: 'done' });
    const note = JSON.parse((await rpc(port, token, 'note:create', { projectId: null, body: 'idea suelta' })).body) as { ok: true };
    expect(note.ok).toBe(true);
    expect(core.tasks.listNotes(null)).toHaveLength(1);
    const summary = JSON.parse((await rpc(port, token, 'overview:summary')).body) as { data: Array<{ project: { name: string } }> };
    expect(summary.data[0]?.project.name).toBe('Tienda');
  });

  it('revocar un móvil corta su acceso en la siguiente petición', async () => {
    const { port, pair, devices } = await setup();
    const token = await pair();
    expect((await rpc(port, token, 'project:list', { includeArchived: false })).status).toBe(200);
    devices.revoke(devices.list()[0]?.id ?? '');
    expect((await rpc(port, token, 'project:list', { includeArchived: false })).status).toBe(401);
  });

  it('SEGURIDAD: Origin ajeno (CSRF) = 403; el propio se acepta', async () => {
    const { port, pair } = await setup();
    const token = await pair();
    expect((await rpc(port, token, 'project:list', { includeArchived: false }, { Origin: 'https://malo.example' })).status).toBe(403);
    expect((await rpc(port, token, 'project:list', { includeArchived: false }, { Origin: `http://127.0.0.1:${port}` })).status).toBe(200);
    expect((await call(port, 'POST', '/api/pair', { Origin: 'https://malo.example' }, '{}')).status).toBe(403);
  });

  it('límites: cuerpo enorme = 413, JSON roto = 400, GET a la API = 405, ráfaga = 429', async () => {
    const { port, pair } = await setup({ deviceLimit: 5 });
    const token = await pair();
    expect((await rpc(port, token, 'note:create', { projectId: null, body: 'x'.repeat(70_000) })).status).toBe(413);
    expect((await call(port, 'POST', '/api/rpc/task:list', { Authorization: `Bearer ${token}` }, '{roto')).status).toBe(400);
    expect((await call(port, 'GET', '/api/rpc/task:list', { Authorization: `Bearer ${token}` })).status).toBe(405);
    const statuses: number[] = [];
    for (let i = 0; i < 8; i++) statuses.push((await rpc(port, token, 'project:list', { includeArchived: false })).status);
    expect(statuses).toContain(429);
  });
});

describe('servidor móvil: archivos estáticos', () => {
  it('sirve la web, el manifest y los recursos con su tipo; una pantalla sin extensión abre index.html', async () => {
    const { port } = await setup();
    const home = await call(port, 'GET', '/', {});
    expect(home.status).toBe(200);
    expect(home.headers['content-type']).toContain('text/html');
    expect(home.body).toContain('La Nave móvil');
    expect((await call(port, 'GET', '/tareas', {})).body).toContain('La Nave móvil');
    const asset = await call(port, 'GET', '/assets/app-abc123.js', {});
    expect(asset.headers['content-type']).toContain('javascript');
    expect(asset.headers['cache-control']).toContain('immutable');
    expect((await call(port, 'GET', '/manifest.webmanifest', {})).headers['content-type']).toContain('manifest+json');
    expect((await call(port, 'GET', '/falta.js', {})).status).toBe(404);
  });

  it('SEGURIDAD: no sale de su carpeta (.., codificado, barras invertidas) ni sigue enlaces simbólicos', async () => {
    const { port } = await setup();
    for (const path of ['/../secreto.txt', '/%2e%2e/secreto.txt', '/..%2fsecreto.txt', '/assets/../../secreto.txt', '/..\\secreto.txt', '/%00', '/enlace.txt', '/%5c..%5csecreto.txt']) {
      const res = await call(port, 'GET', path, {});
      expect(res.body, path).not.toContain('NO DEBE SALIR');
      expect([400, 404], path).toContain(res.status);
    }
  });

  it('solo GET y HEAD; sin carpeta de la web responde 404 pero la API sigue', async () => {
    const { port } = await setup();
    expect((await call(port, 'POST', '/', {}, '')).status).toBe(405);
    expect((await call(port, 'HEAD', '/', {})).status).toBe(200);
    const bare = await setup({ withStatic: false });
    expect((await call(bare.port, 'GET', '/', {})).status).toBe(404);
  });
});
