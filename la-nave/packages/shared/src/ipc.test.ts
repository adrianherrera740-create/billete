import { describe, expect, it } from 'vitest';
import { CHANNELS, REMOTE_ALLOWED, REMOTE_FORBIDDEN, createApi } from './ipc';
import type { ChannelName } from './ipc';

// Revisar a mano: añadir un canal a esta lista es decidir que el móvil puede usarlo.
const REMOTE_ALLOWED_REVIEWED: ChannelName[] = ['project:list', 'board:get'];

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
      if (/:(create|update|archive|delete|set-camera)$/.test(name)) expect(CHANNELS[name].remote, name).toBe('forbidden');
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
