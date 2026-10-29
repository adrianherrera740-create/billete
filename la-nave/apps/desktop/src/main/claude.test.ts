import { mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { request } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { EventBus, createLogger, createMemorySink } from '@nave/core';
import { migrate, openDatabase } from '@nave/db';
import type { ClaudeEvent, EventMap } from '@nave/shared';
import { ClaudeService, FORBIDDEN_ARGS, HOOK_EVENTS, parseTranscript } from './claude';
import { Projects } from './projects';

const services: ClaudeService[] = [];
afterEach(async () => {
  await Promise.all(services.splice(0).map((s) => s.stop()));
});

async function setup(env: Record<string, string | undefined> = { NAVE_CLAUDE_BIN: '/bin/sh' }, platform: NodeJS.Platform = 'linux') {
  const dir = mkdtempSync(join(tmpdir(), 'nave-claude-'));
  const db = openDatabase(join(dir, 'nave.db'));
  migrate(db);
  const bus = new EventBus<EventMap>();
  const projects = new Projects(db, bus);
  const project = projects.create({ name: 'P' });
  const panel = projects.createPanel({ projectId: project.id, kind: 'claude', x: 0, y: 0, w: 600, h: 400 });
  const sticky = projects.createPanel({ projectId: project.id, kind: 'sticky', x: 0, y: 0, w: 200, h: 100 });
  const pushed: ClaudeEvent[] = [];
  const busEvents: string[] = [];
  bus.on('claude.session_state_changed', (e) => busEvents.push(e.state));
  const sink = createMemorySink();
  const home = join(dir, 'home');
  mkdirSync(join(home, '.claude', 'projects', 'proj'), { recursive: true });
  const service = new ClaudeService({
    db,
    bus,
    log: createLogger('app', sink),
    dataDir: dir,
    home,
    env,
    platform,
    exists: (p) => p === '/bin/sh' || p.startsWith(home) || p === 'C:\\bin\\claude.cmd' || p === '/opt/bin/claude',
    emit: (e) => pushed.push(e),
    getPanel: (id) => projects.panel(id)
  });
  services.push(service);
  await service.start();
  return { service, panel, sticky, pushed, busEvents, sink, home, dir, db };
}

function post(port: number, path: string, headers: Record<string, string>, body: string | Buffer, host = `127.0.0.1:${port}`, method = 'POST'): Promise<number> {
  return new Promise((resolve, reject) => {
    const req = request({ host: '127.0.0.1', port, path, method, headers: { Host: host, ...headers } }, (res) => {
      res.resume();
      resolve(res.statusCode ?? 0);
    });
    req.on('error', (error: NodeJS.ErrnoException) => (error.code === 'ECONNRESET' || error.code === 'EPIPE' ? resolve(413) : reject(error)));
    req.end(body);
  });
}

const hook = (event: string, extra: Record<string, unknown> = {}): string => JSON.stringify({ hook_event_name: event, session_id: 'sess-1234-abcd', ...extra });

describe('servidor de hooks (seguridad)', () => {
  it('escucha solo en 127.0.0.1', async () => {
    const { service } = await setup();
    const status = await post(service.hooks.port, '/hook/x', {}, '{}');
    expect(status).toBeGreaterThan(0);
    // el puerto no responde en otra interfaz: comprobamos la dirección real del servidor
    const server = (service.hooks as unknown as { server: { address(): { address: string } } }).server;
    expect(server.address().address).toBe('127.0.0.1');
  });

  it('exige el token: sin él o con uno falso, 401; el panel desconocido, 404', async () => {
    const { service, panel, sticky } = await setup();
    const { port, token } = service.hooks;
    const url = `/hook/${panel.id}`;
    expect(await post(port, url, {}, hook('Stop'))).toBe(401);
    expect(await post(port, url, { Authorization: 'Bearer falso' }, hook('Stop'))).toBe(401);
    expect(await post(port, url, { Authorization: `Bearer ${token.slice(0, -1)}0` }, hook('Stop'))).toBe(401);
    expect(await post(port, '/hook/no-existe', { Authorization: `Bearer ${token}` }, hook('Stop'))).toBe(404);
    expect(await post(port, `/hook/${sticky.id}`, { Authorization: `Bearer ${token}` }, hook('Stop'))).toBe(404);
  });

  it('rechaza peticiones de navegador (Origin) y de Host ajeno (DNS rebinding)', async () => {
    const { service, panel } = await setup();
    const { port, token } = service.hooks;
    const auth = { Authorization: `Bearer ${token}` };
    expect(await post(port, `/hook/${panel.id}`, { ...auth, Origin: 'https://malo.example' }, hook('Stop'))).toBe(403);
    expect(await post(port, `/hook/${panel.id}`, auth, hook('Stop'), 'malo.example')).toBe(403);
    expect(await post(port, `/hook/${panel.id}`, auth, hook('Stop'), 'localhost:' + port)).toBe(403);
  });

  it('solo POST en /hook/<id>; JSON roto, evento desconocido o cuerpo enorme se rechazan', async () => {
    const { service, panel } = await setup();
    const { port, token } = service.hooks;
    const auth = { Authorization: `Bearer ${token}` };
    expect(await post(port, `/hook/${panel.id}`, auth, '', undefined, 'GET')).toBe(404);
    expect(await post(port, '/otra-cosa', auth, hook('Stop'))).toBe(404);
    expect(await post(port, `/hook/${panel.id}`, auth, '{no es json')).toBe(400);
    expect(await post(port, `/hook/${panel.id}`, auth, hook('PreToolUse'))).toBe(400);
    expect(await post(port, `/hook/${panel.id}`, auth, JSON.stringify({ hook_event_name: 5 }))).toBe(400);
    expect(await post(port, `/hook/${panel.id}`, auth, Buffer.alloc(400 * 1024, 'a'))).toBe(413);
  });
});

describe('estado de la sesión por hooks', () => {
  it('traduce eventos a estados, los guarda y avisa solo cuando cambian', async () => {
    const { service, panel, pushed, busEvents } = await setup();
    const auth = { Authorization: `Bearer ${service.hooks.token}` };
    const url = `/hook/${panel.id}`;
    expect(await post(service.hooks.port, url, auth, hook('SessionStart'))).toBe(204);
    expect(await post(service.hooks.port, url, auth, hook('UserPromptSubmit', { prompt: 'secreto' }))).toBe(204);
    expect(await post(service.hooks.port, url, auth, hook('UserPromptSubmit'))).toBe(204); // repetido: sin aviso
    expect(await post(service.hooks.port, url, auth, hook('Notification'))).toBe(204);
    expect(await post(service.hooks.port, url, auth, hook('Stop'))).toBe(204);
    expect(await post(service.hooks.port, url, auth, hook('SessionEnd'))).toBe(204);
    expect(busEvents).toEqual(['idle', 'working', 'waiting', 'idle', 'ended']);
    expect(pushed.map((e) => e.state)).toEqual(['idle', 'working', 'waiting', 'idle', 'ended']);
    expect(service.status(panel.id, false)).toMatchObject({ state: 'ended', sessionId: 'sess-1234-abcd', available: true, running: false });
  });

  it('no registra el contenido de los hooks (prompts) en los logs', async () => {
    const { service, panel, sink } = await setup();
    await post(service.hooks.port, `/hook/${panel.id}`, { Authorization: `Bearer ${service.hooks.token}` }, hook('UserPromptSubmit', { prompt: 'mi-prompt-privado-777' }));
    expect(sink.lines.join('\n')).toContain('UserPromptSubmit');
    expect(sink.lines.join('\n')).not.toContain('privado-777');
  });

  it('markEnded deja la sesión terminada aunque no llegue SessionEnd', async () => {
    const { service, panel, busEvents } = await setup();
    service.launch(panel, false);
    service.markEnded(panel.id);
    service.markEnded(panel.id);
    expect(busEvents).toEqual(['unknown', 'ended']);
  });
});

describe('arranque del claude real', () => {
  it('nunca usa opciones que salten permisos, y el token no va en args ni en el archivo de ajustes', async () => {
    const { service, panel, dir } = await setup();
    const result = service.launch(panel, false);
    if (!('launch' in result)) throw new Error('debería poder lanzarse');
    const { launch } = result;
    expect(launch.args.join(' ')).not.toContain(service.hooks.token);
    for (const forbidden of FORBIDDEN_ARGS) expect(launch.args).not.toContain(forbidden);
    expect(launch.args[0]).toBe('--settings');
    expect(launch.args).toContain('--session-id');
    expect(launch.extraEnv['NAVE_HOOK_TOKEN']).toBe(service.hooks.token);
    const settings = readFileSync(launch.args[1] ?? '', 'utf8');
    expect(settings).not.toContain(service.hooks.token);
    expect(settings).toContain('$NAVE_HOOK_TOKEN');
    expect(settings).toContain(`127.0.0.1:${service.hooks.port}/hook/${panel.id}`);
    expect(Object.keys((JSON.parse(settings) as { hooks: object }).hooks)).toEqual([...HOOK_EVENTS]);
    expect(launch.args[1]).toContain(dir);
  });

  it('reanudar usa el mismo id de sesión; sin sesión previa avisa', async () => {
    const { service, panel } = await setup();
    expect(service.launch(panel, true)).toEqual({ unavailable: expect.stringContaining('No hay una sesión anterior') });
    const first = service.launch(panel, false);
    const again = service.launch(panel, true);
    if (!('launch' in first) || !('launch' in again)) throw new Error('debería poder lanzarse');
    const id = first.launch.args[first.launch.args.indexOf('--session-id') + 1];
    expect(again.launch.args).toContain('--resume');
    expect(again.launch.args[again.launch.args.indexOf('--resume') + 1]).toBe(id);
  });

  it('sin claude instalado lo explica en vez de fallar', async () => {
    const { service, panel } = await setup({ PATH: '/nada' });
    expect(service.launch(panel, false)).toEqual({ unavailable: expect.stringContaining('No se ha encontrado Claude Code') });
    expect(service.status(panel.id, false)).toMatchObject({ available: false, notice: expect.stringContaining('Claude Code') });
  });

  it('lo busca en el PATH y, en Windows, un .cmd se ejecuta con cmd /c', async () => {
    const linux = await setup({ PATH: '/usr/x:/opt/bin' });
    expect(linux.service.findBinary()).toBe('/opt/bin/claude');
    const win = await setup({ NAVE_CLAUDE_BIN: 'C:\\bin\\claude.cmd', ComSpec: 'C:\\Windows\\System32\\cmd.exe' }, 'win32');
    const result = win.service.launch(win.panel, false);
    if (!('launch' in result)) throw new Error('debería poder lanzarse');
    expect(result.launch.file).toBe('C:\\Windows\\System32\\cmd.exe');
    expect(result.launch.args.slice(0, 2)).toEqual(['/c', 'C:\\bin\\claude.cmd']);
  });
});

describe('historial de solo lectura', () => {
  const line = (o: unknown): string => JSON.stringify(o);

  it('parseTranscript es tolerante y redacta secretos', () => {
    const secret = 'sk-ant-' + 'a1'.repeat(15);
    const text = [
      'esto no es json',
      line({ type: 'queue-operation' }),
      line({ type: 'user', message: { role: 'user', content: 'hola' } }),
      line({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'thinking', thinking: 'x' }, { type: 'text', text: `clave ${secret}` }, { type: 'tool_use', name: 'Bash' }] } }),
      line({ type: 'user', message: { role: 'user', content: [{ type: 'tool_result', content: 'x' }] } }),
      line(null),
      line({ type: 'user', message: { content: 'x'.repeat(5000) } })
    ].join('\n');
    const entries = parseTranscript(text);
    expect(entries.map((e) => e.role)).toEqual(['user', 'assistant', 'user']);
    expect(entries[1]?.text).not.toContain(secret);
    expect(entries[2]?.text.length).toBe(2001);
  });

  it('limita a los últimos mensajes', () => {
    const text = Array.from({ length: 80 }, (_, i) => line({ type: 'user', message: { content: `m${i}` } })).join('\n');
    const entries = parseTranscript(text, 50);
    expect(entries).toHaveLength(50);
    expect(entries[0]?.text).toBe('m30');
  });

  it('lee el historial de la sesión desde ~/.claude/projects', async () => {
    const { service, panel, home } = await setup();
    const result = service.launch(panel, false);
    if (!('launch' in result)) throw new Error('debería poder lanzarse');
    const id = result.launch.args[result.launch.args.indexOf('--session-id') + 1] ?? '';
    writeFileSync(join(home, '.claude', 'projects', 'proj', `${id}.jsonl`), line({ type: 'user', message: { content: 'pregunta' } }) + '\n');
    expect(service.history(panel.id)).toEqual([{ role: 'user', text: 'pregunta' }]);
  });

  it('SEGURIDAD: no abre rutas fuera de ~/.claude/projects ni sigue enlaces simbólicos', async () => {
    const { service, panel, home, dir } = await setup();
    // 1) transcript_path que apunta fuera (lo manda un hook)
    const outside = join(dir, 'fuera.jsonl');
    writeFileSync(outside, line({ type: 'user', message: { content: 'secreto' } }));
    await post(service.hooks.port, `/hook/${panel.id}`, { Authorization: `Bearer ${service.hooks.token}` }, hook('SessionStart', { transcript_path: outside }));
    expect(() => service.history(panel.id)).toThrow(/fuera de la carpeta de Claude/);
    // 2) enlace simbólico dentro de la carpeta que apunta fuera
    const link = join(home, '.claude', 'projects', 'proj', 'enlace.jsonl');
    symlinkSync(outside, link);
    await post(service.hooks.port, `/hook/${panel.id}`, { Authorization: `Bearer ${service.hooks.token}` }, hook('Stop', { transcript_path: link }));
    expect(service.history(panel.id)).toEqual([]);
  });
});
