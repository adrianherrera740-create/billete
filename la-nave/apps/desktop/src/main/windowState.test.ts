import { describe, expect, it, vi } from 'vitest';
import { restoreBounds, trackWindowState } from './windowState';

const screens = [{ x: 0, y: 0, width: 1920, height: 1080 }, { x: 1920, y: 0, width: 1280, height: 1024 }];
const defaults = { width: 1280, height: 800 };

describe('restoreBounds', () => {
  it('sin nada guardado usa los valores por defecto y deja que el sistema centre la ventana', () => {
    expect(restoreBounds(undefined, screens, defaults)).toEqual({ width: 1280, height: 800, maximized: false });
  });

  it('recupera posición, tamaño y maximizada', () => {
    expect(restoreBounds({ x: 100, y: 50, width: 1000, height: 700, maximized: true }, screens, defaults)).toEqual({ x: 100, y: 50, width: 1000, height: 700, maximized: true });
  });

  it('si el monitor donde estaba ya no existe, no la abre fuera de la vista', () => {
    const only = [screens[0] as (typeof screens)[number]];
    const state = restoreBounds({ x: 2500, y: 100, width: 1000, height: 700, maximized: false }, only, defaults);
    expect(state.x).toBeUndefined();
    expect(state.y).toBeUndefined();
    expect(state.width).toBe(1000);
  });

  it('acepta una ventana en el segundo monitor y descarta la que solo asoma un borde', () => {
    expect(restoreBounds({ x: 2000, y: 0, width: 1000, height: 700 }, screens, defaults).x).toBe(2000);
    expect(restoreBounds({ x: 1900 + 1920 + 1280 - 50, y: 0, width: 1000, height: 700 }, screens, defaults).x).toBeUndefined();
  });

  it('SEGURIDAD: basura guardada (texto, NaN, tamaños absurdos) no rompe nada y se acota', () => {
    expect(restoreBounds({ x: 'a', y: NaN, width: '1000', height: Infinity }, screens, defaults)).toEqual({ width: 1280, height: 800, maximized: false });
    expect(restoreBounds({ width: 5, height: 99_999_999 }, screens, defaults)).toMatchObject({ width: 960, height: 10_000 });
    expect(restoreBounds('no es un objeto', screens, defaults)).toMatchObject({ width: 1280 });
    expect(restoreBounds(null, screens, defaults)).toMatchObject({ width: 1280 });
  });
});

describe('trackWindowState', () => {
  it('guarda con retardo tras mover o redimensionar, y siempre al cerrar', () => {
    vi.useFakeTimers();
    const handlers = new Map<string, () => void>();
    const win = {
      getNormalBounds: () => ({ x: 10, y: 20, width: 1000, height: 700 }),
      isMaximized: () => false,
      on: (event: string, listener: () => void) => void handlers.set(event, listener)
    };
    const saved: unknown[] = [];
    trackWindowState(win, (s) => saved.push(s), 400);
    handlers.get('resize')?.();
    handlers.get('move')?.();
    handlers.get('resize')?.();
    expect(saved).toHaveLength(0);
    vi.advanceTimersByTime(399);
    expect(saved).toHaveLength(0);
    vi.advanceTimersByTime(2);
    expect(saved).toEqual([{ x: 10, y: 20, width: 1000, height: 700, maximized: false }]);
    handlers.get('close')?.();
    expect(saved).toHaveLength(2);
    vi.useRealTimers();
  });
});
