import { describe, expect, it } from 'vitest';
import { CHANNELS, REMOTE_ALLOWED, REMOTE_FORBIDDEN, createApi } from './ipc';
import type { ChannelName } from './ipc';

// Revisar a mano: añadir un canal a esta lista es decidir que el móvil puede usarlo.
const REMOTE_ALLOWED_REVIEWED: ChannelName[] = ['project:list', 'board:get', 'task:list', 'note:list'];

describe('clasificación de canales para acceso remoto (seguridad)', () => {
  it('cada canal está clasificado como permitido o prohibido en remoto', () => {
    for (const [name, def] of Object.entries(CHANNELS)) {
      expect(['allowed', 'forbidden'], name).toContain(def.remote);
    }
    expect(REMOTE_ALLOWED.length + REMOTE_FORBIDDEN.length).toBe(Object.keys(CHANNELS).length);
  });

  it('la lista permitida coincide con la revisada a mano', () => {
    expect([...REMOTE_ALLOWED].sort()).toEqual([...REMOTE_ALLOWED_REVIEWED].sort());
  });

  it('todo lo que modifica datos está prohibido en remoto', () => {
    for (const name of Object.keys(CHANNELS) as ChannelName[]) {
      if (/:(create|update|archive|delete|set-camera|start|input|resize|kill|resume|paste)$/.test(name)) expect(CHANNELS[name].remote, name).toBe('forbidden');
    }
  });
});

describe('parsers de canales', () => {
  it('project:create valida nombre, color y ruta', () => {
    const p = CHANNELS['project:create'].input;
    expect(p({ name: ' Mi proyecto ', color: '#112233', rootPath: null })).toEqual({ name: 'Mi proyecto', color: '#112233', rootPath: null });
    expect(() => p({ name: '' })).toThrow();
    expect(() => p({ name: 'x', color: 'azul' })).toThrow();
    expect(() => p({ name: 'x', rootPath: '../fuera' })).toThrow();
    expect(() => p({ name: 'x', extra: 1 })).toThrow(/desconocido/);
  });

  it('panel:create limita la geometría', () => {
    const p = CHANNELS['panel:create'].input;
    const ok = { projectId: 'p', kind: 'sticky', x: 0, y: 0, w: 300, h: 200 };
    expect(p(ok)).toEqual(ok);
    expect(() => p({ ...ok, w: 10 })).toThrow();
    expect(() => p({ ...ok, kind: 'hack' })).toThrow();
    expect(() => p({ ...ok, x: 1e12 })).toThrow();
  });

  it('board:set-camera no admite zoom por encima del 100 %', () => {
    const p = CHANNELS['board:set-camera'].input;
    expect(() => p({ projectId: 'p', x: 0, y: 0, zoom: 1.5 })).toThrow();
    expect(p({ projectId: 'p', x: 0, y: 0, zoom: 1 }).zoom).toBe(1);
  });
});

describe('terminales (seguridad)', () => {
  it('ningún canal de terminal ni de Claude está permitido en remoto', () => {
    for (const name of Object.keys(CHANNELS) as ChannelName[]) {
      if (name.startsWith('terminal:') || name.startsWith('claude:')) expect(CHANNELS[name].remote, name).toBe('forbidden');
    }
  });

  it('terminal:start solo acepta id de panel y tamaño: nada de shell ni carpeta', () => {
    const p = CHANNELS['terminal:start'].input;
    expect(p({ panelId: 'x', cols: 80, rows: 24 })).toEqual({ panelId: 'x', cols: 80, rows: 24 });
    expect(() => p({ panelId: 'x', cols: 80, rows: 24, shell: 'cmd.exe' })).toThrow(/desconocido/);
    expect(() => p({ panelId: 'x', cols: 80, rows: 24, cwd: 'C:\\' })).toThrow(/desconocido/);
    expect(() => p({ panelId: 'x', cols: 5, rows: 24 })).toThrow();
  });

  it('terminal:input limita el tamaño de lo que se escribe', () => {
    const p = CHANNELS['terminal:input'].input;
    expect(() => p({ panelId: 'x', data: 'a'.repeat(70_000) })).toThrow();
    expect(() => p({ panelId: 'x', data: '' })).toThrow();
  });
});

describe('tareas y notas', () => {
  it('una tarea siempre lleva proyecto; una nota puede ir sin proyecto (null)', () => {
    expect(() => CHANNELS['task:create'].input({ title: 'x' })).toThrow(/falta este campo/);
    expect(() => CHANNELS['task:create'].input({ projectId: null, title: 'x' })).toThrow();
    expect(CHANNELS['note:create'].input({ projectId: null, body: 'hola' })).toEqual({ projectId: null, body: 'hola' });
    expect(CHANNELS['note:list'].input({ projectId: null })).toEqual({ projectId: null });
  });

  it('límites de tamaño y estados válidos', () => {
    expect(() => CHANNELS['task:create'].input({ projectId: 'p', title: 'x'.repeat(201) })).toThrow();
    expect(() => CHANNELS['task:update'].input({ id: 'a', status: 'hecha' })).toThrow(/uno de/);
    expect(CHANNELS['task:update'].input({ id: 'a', status: 'done' })).toEqual({ id: 'a', status: 'done' });
    expect(() => CHANNELS['note:update'].input({ id: 'a', body: 'x'.repeat(20_001) })).toThrow();
  });

  it('claude:paste no admite texto vacío ni gigante, ni campos extra como "enter"', () => {
    const p = CHANNELS['claude:paste'].input;
    expect(() => p({ panelId: 'a', text: '' })).toThrow();
    expect(() => p({ panelId: 'a', text: 'x'.repeat(20_001) })).toThrow();
    expect(() => p({ panelId: 'a', text: 'hola', enter: true })).toThrow(/desconocido/);
  });
});

describe('createApi', () => {
  it('usa el transporte que se le da (IPC o red) sin cambiar la API', async () => {
    const calls: Array<[string, unknown]> = [];
    const api = createApi('win32', async (channel, input) => {
      calls.push([channel, input]);
      return { ok: true, data: [] };
    });
    const res = await api.invoke('project:list', { includeArchived: false });
    expect(res).toEqual({ ok: true, data: [] });
    expect(calls).toEqual([['project:list', { includeArchived: false }]]);
    expect(api.platform).toBe('win32');
  });
});
