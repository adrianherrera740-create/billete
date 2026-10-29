import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { codeFromHash, createMobileApi, deviceName, pair, tokenStore } from './api';

const store = new Map<string, string>();
beforeEach(() => {
  store.clear();
  vi.stubGlobal('localStorage', { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v), removeItem: (k: string) => void store.delete(k) });
});
afterEach(() => vi.unstubAllGlobals());

const json = (status: number, body: unknown): Response => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('createMobileApi', () => {
  it('envía el canal por POST con el token y devuelve el Result del servidor', async () => {
    tokenStore.set('tok-123');
    const fetcher = vi.fn(async () => json(200, { ok: true, data: [] }));
    const api = createMobileApi({ onUnauthorized: vi.fn(), offlineMessage: 'sin red' }, fetcher as unknown as typeof fetch);
    expect(await api.invoke('project:list', { includeArchived: false })).toEqual({ ok: true, data: [] });
    const [url, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/rpc/project:list');
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>)['Authorization']).toBe('Bearer tok-123');
    expect(init.body).toBe('{"includeArchived":false}');
    expect(api.platform).toBe('mobile');
  });

  it('un 401 borra el token y avisa de que ya no está emparejado', async () => {
    tokenStore.set('tok-123');
    const onUnauthorized = vi.fn();
    const api = createMobileApi({ onUnauthorized, offlineMessage: 'sin red' }, (async () => json(401, { ok: false, error: { code: 'FORBIDDEN', message: 'revocado' } })) as unknown as typeof fetch);
    expect(await api.invoke('overview:summary', undefined)).toMatchObject({ ok: false });
    expect(tokenStore.get()).toBeNull();
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('sin conexión o con una respuesta que no es JSON devuelve un error legible en vez de lanzar', async () => {
    const down = createMobileApi({ onUnauthorized: vi.fn(), offlineMessage: 'sin red' }, (async () => Promise.reject(new TypeError('fetch failed'))) as unknown as typeof fetch);
    expect(await down.invoke('project:list', { includeArchived: false })).toEqual({ ok: false, error: { code: 'INTERNAL', message: 'sin red' } });
    const html = createMobileApi({ onUnauthorized: vi.fn(), offlineMessage: 'sin red' }, (async () => new Response('<html>', { status: 502 })) as unknown as typeof fetch);
    expect(await html.invoke('project:list', { includeArchived: false })).toMatchObject({ ok: false, error: { message: 'sin red' } });
  });
});

describe('emparejamiento', () => {
  it('guarda el token si el servidor lo entrega y muestra su mensaje si no', async () => {
    expect(await pair('a'.repeat(32), 'iPhone', 'fallo', (async () => json(200, { ok: true, data: { token: 'nuevo-token' } })) as unknown as typeof fetch)).toEqual({ ok: true });
    expect(tokenStore.get()).toBe('nuevo-token');
    tokenStore.clear();
    expect(await pair('a'.repeat(32), 'iPhone', 'fallo', (async () => json(401, { ok: false, error: { message: 'caducado' } })) as unknown as typeof fetch)).toEqual({ ok: false, message: 'caducado' });
    expect(tokenStore.get()).toBeNull();
    expect(await pair('x', 'x', 'sin red', (async () => Promise.reject(new Error('x'))) as unknown as typeof fetch)).toEqual({ ok: false, message: 'sin red' });
  });

  it('el código solo se acepta con la forma exacta (32 hex) y viene del fragmento', () => {
    expect(codeFromHash('#' + 'ab12'.repeat(8))).toBe('ab12'.repeat(8));
    for (const bad of ['', '#', '#abc', '#' + 'g'.repeat(32), '#' + 'a'.repeat(33), '?code=' + 'a'.repeat(32), '#<script>']) expect(codeFromHash(bad), bad).toBeNull();
  });

  it('nombre del móvil a partir del navegador', () => {
    expect(deviceName('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')).toBe('iPhone');
    expect(deviceName('Mozilla/5.0 (Linux; Android 14; Pixel 8)')).toBe('Android');
    expect(deviceName('Mozilla/5.0 (X11; Linux x86_64)')).toBe('Móvil');
  });

  it('si el almacenamiento falla, no se rompe nada', () => {
    vi.stubGlobal('localStorage', { getItem: () => { throw new Error('bloqueado'); }, setItem: () => { throw new Error('bloqueado'); }, removeItem: () => { throw new Error('bloqueado'); } });
    expect(tokenStore.get()).toBeNull();
    expect(() => tokenStore.set('x')).not.toThrow();
    expect(() => tokenStore.clear()).not.toThrow();
  });
});
