import { describe, expect, it, vi } from 'vitest';
import type { EventMap } from '@nave/shared';
import { EventBus } from './eventBus';

describe('EventBus', () => {
  it('entrega el payload tipado a los suscriptores en orden', () => {
    const bus = new EventBus<EventMap>();
    const seen: string[] = [];
    bus.on('settings.changed', (p) => seen.push(`a:${p.key}`));
    bus.on('settings.changed', (p) => seen.push(`b:${p.key}`));
    bus.emit('settings.changed', { key: 'tema' });
    expect(seen).toEqual(['a:tema', 'b:tema']);
  });

  it('desuscribe y once solo dispara una vez', () => {
    const bus = new EventBus<EventMap>();
    const fn = vi.fn();
    const off = bus.on('app.started', fn);
    const once = vi.fn();
    bus.once('app.started', once);
    bus.emit('app.started', { version: '1' });
    off();
    bus.emit('app.started', { version: '2' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(once).toHaveBeenCalledTimes(1);
    expect(bus.listenerCount('app.started')).toBe(0);
  });

  it('un manejador que falla no corta a los demás y se informa', () => {
    const onError = vi.fn();
    const bus = new EventBus<EventMap>(onError);
    const ok = vi.fn();
    bus.on('app.started', () => {
      throw new Error('fallo');
    });
    bus.on('app.started', ok);
    expect(() => bus.emit('app.started', { version: '1' })).not.toThrow();
    expect(ok).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith('app.started', expect.any(Error));
  });
});
