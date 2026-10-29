export interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowState {
  x?: number;
  y?: number;
  width: number;
  height: number;
  maximized: boolean;
}

export const MIN_WIDTH = 960;
export const MIN_HEIGHT = 600;
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/**
 * Posición y tamaño al abrir: lo guardado si es válido y la ventana sigue siendo alcanzable en alguna pantalla
 * (si se desconectó un monitor, se centra en lugar de abrirse fuera de la vista).
 */
export function restoreBounds(saved: unknown, areas: Area[], defaults: { width: number; height: number }): WindowState {
  const s = (typeof saved === 'object' && saved !== null ? saved : {}) as Record<string, unknown>;
  const width = isNum(s['width']) ? Math.min(10_000, Math.max(MIN_WIDTH, Math.round(s['width']))) : defaults.width;
  const height = isNum(s['height']) ? Math.min(10_000, Math.max(MIN_HEIGHT, Math.round(s['height']))) : defaults.height;
  const state: WindowState = { width, height, maximized: s['maximized'] === true };
  if (isNum(s['x']) && isNum(s['y'])) {
    const x = Math.round(s['x']);
    const y = Math.round(s['y']);
    const visible = areas.some((a) => Math.min(x + width, a.x + a.width) - Math.max(x, a.x) >= 100 && Math.min(y + height, a.y + a.height) - Math.max(y, a.y) >= 60);
    if (visible) {
      state.x = x;
      state.y = y;
    }
  }
  return state;
}

interface TrackableWindow {
  getNormalBounds(): { x: number; y: number; width: number; height: number };
  isMaximized(): boolean;
  on(event: string, listener: () => void): unknown;
}

/** Guarda el estado de la ventana (con retardo para no escribir en cada píxel) y al cerrar. */
export function trackWindowState(win: TrackableWindow, save: (state: WindowState) => void, delayMs = 400): void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const snapshot = (): void => {
    const b = win.getNormalBounds();
    save({ x: b.x, y: b.y, width: b.width, height: b.height, maximized: win.isMaximized() });
  };
  const schedule = (): void => {
    clearTimeout(timer);
    timer = setTimeout(snapshot, delayMs);
  };
  for (const event of ['resize', 'move', 'maximize', 'unmaximize']) win.on(event, schedule);
  win.on('close', () => {
    clearTimeout(timer);
    snapshot();
  });
}
