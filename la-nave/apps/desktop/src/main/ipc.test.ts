import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { EventBus } from '@nave/core';
import { migrate, openDatabase } from '@nave/db';
import { CHANNELS } from '@nave/shared';
import type { ChannelName, EventMap, Result } from '@nave/shared';
import { handlersFor, registerIpc } from './ipc';
import type { IpcLike } from './ipc';
import type { Brain } from './brain';
import { Projects } from './projects';
import { Tasks } from './tasks';
import type { ClaudeService } from './claude';
import { TerminalManager } from './terminals';

const stubClaude = {} as unknown as ClaudeService;

// electron no se carga en vitest: el módulo importa ipcMain, así que lo simulamos.
vi.mock('electron', () => ({ ipcMain: { handle: () => undefined } }));

const stubTerminals = (projects: Projects): TerminalManager =>
  new TerminalManager({
    getPanel: (id) => projects.panel(id),
    getProject: (id) => projects.get(id),
    shells: () => [],
    spawn: () => {
      throw new Error('sin pty en este test');
    },
    emit: () => undefined,
    bus: new EventBus<EventMap>(),
    log: { debug: () => undefined, info: () => undefined, warn: () => undefined, error: () => undefined }
  });

function setup(): { call: (channel: ChannelName, input: unknown) => Result<unknown>; errors: unknown[]; channels: string[] } {
  const db = openDatabase(join(mkdtempSync(join(tmpdir(), 'nave-ipc-')), 'nave.db'));
  migrate(db);
  const registered = new Map<string, (event: unknown, input: unknown) => unknown>();
  const fake: IpcLike = { handle: (c, l) => void registered.set(c, l) };
  const errors: unknown[] = [];
  const projects = new Projects(db, new EventBus<EventMap>());
  registerIpc(handlersFor(projects, stubTerminals(projects), stubClaude, new Tasks(db, new EventBus<EventMap>()), {} as Brain), (e) => errors.push(e), fake);
  return {
    call: (channel, input) => registered.get(channel)?.({}, input) as Result<unknown>,
    errors,
    channels: [...registered.keys()]
  };
}

describe('registro único de IPC', () => {
  it('registra exactamente los canales de @nave/shared', () => {
    expect(setup().channels.sort()).toEqual(Object.keys(CHANNELS).sort());
  });

  it('flujo completo por IPC: crear proyecto, panel y leer la pizarra', () => {
    const { call } = setup();
    const created = call('project:create', { name: 'Mi proyecto' });
    expect(created.ok).toBe(true);
    const id = (created as { ok: true; data: { id: string } }).data.id;
    expect(call('panel:create', { projectId: id, kind: 'sticky', x: 0, y: 0, w: 300, h: 200 }).ok).toBe(true);
    const board = call('board:get', { projectId: id }) as { ok: true; data: { panels: unknown[] } };
    expect(board.data.panels).toHaveLength(1);
  });

  it('entradas inválidas: error VALIDATION en español y sin tocar la BD', () => {
    const { call } = setup();
    for (const bad of [{ name: '' }, { name: 'x', color: 'rojo' }, { name: 'x', otro: 1 }, null, 'texto', []]) {
      const res = call('project:create', bad);
      expect(res).toMatchObject({ ok: false, error: { code: 'VALIDATION' } });
    }
    expect(call('project:list', { includeArchived: false })).toEqual({ ok: true, data: [] });
  });

  it('rechaza peticiones que no vienen de nuestra página', () => {
    const db = openDatabase(join(mkdtempSync(join(tmpdir(), 'nave-ipc3-')), 'nave.db'));
    migrate(db);
    const registered = new Map<string, (event: unknown, input: unknown) => unknown>();
    const projects = new Projects(db, new EventBus<EventMap>());
    registerIpc(handlersFor(projects, stubTerminals(projects), stubClaude, new Tasks(db, new EventBus<EventMap>()), {} as Brain), () => undefined, { handle: (c, l) => void registered.set(c, l) }, (e) => (e as { ok?: boolean }).ok === true);
    const input = { includeArchived: false };
    expect(registered.get('project:list')?.({ ok: false }, input)).toMatchObject({ ok: false, error: { code: 'FORBIDDEN' } });
    expect(registered.get('project:list')?.({ ok: true }, input)).toEqual({ ok: true, data: [] });
  });

  it('un id inexistente devuelve NOT_FOUND y un fallo interno no filtra detalles', () => {
    const { call, errors } = setup();
    expect(call('board:get', { projectId: 'x' })).toMatchObject({ ok: false, error: { code: 'NOT_FOUND' } });
    // Provocamos un fallo interno real: color válido pero BD cerrada no es sencillo; usamos un manejador que lanza.
    const registered = new Map<string, (event: unknown, input: unknown) => unknown>();
    const projects2 = new Projects(openDatabase(join(mkdtempSync(join(tmpdir(), 'nave-ipc2-')), 'a.db')), new EventBus<EventMap>());
    registerIpc(
      { ...handlersFor(projects2, stubTerminals(projects2), stubClaude, {} as Tasks, {} as Brain), 'project:list': () => { throw new Error('ruta secreta C:\\Users\\yo\\x'); } },
      (e) => errors.push(e),
      { handle: (c, l) => void registered.set(c, l) }
    );
    const res = registered.get('project:list')?.({}, { includeArchived: false }) as Result<unknown>;
    expect(res).toMatchObject({ ok: false, error: { code: 'INTERNAL' } });
    expect(JSON.stringify(res)).not.toContain('secreta');
    expect(errors).toHaveLength(1);
  });
});
