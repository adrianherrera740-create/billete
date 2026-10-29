import { describe, expect, it } from 'vitest';
import { createNotifier } from './notifier';

function setup(options: { enabled?: boolean; focused?: boolean } = {}) {
  const shown: Array<{ title: string; body: string; panelId: string }> = [];
  let time = 0;
  const state = { enabled: options.enabled ?? true, focused: options.focused ?? false, exists: true };
  const notifier = createNotifier({
    enabled: () => state.enabled,
    anyWindowFocused: () => state.focused,
    describe: () => (state.exists ? { panel: 'Claude 1', project: 'Tienda' } : null),
    show: (n) => shown.push(n),
    now: () => time,
    minGapMs: 5000
  });
  return { notifier, shown, state, advance: (ms: number) => (time += ms) };
}

describe('notificaciones (solo con la ventana sin foco)', () => {
  it('avisa cuando Claude espera respuesta o termina un trabajo, con nombres y sin contenido', () => {
    const { notifier, shown, advance } = setup();
    notifier.onState('p1', 'working');
    notifier.onState('p1', 'idle');
    advance(10_000);
    notifier.onState('p1', 'waiting');
    expect(shown).toEqual([
      { title: 'Claude 1 · Tienda', body: 'Claude ha terminado.', panelId: 'p1' },
      { title: 'Claude 1 · Tienda', body: 'Claude espera tu respuesta.', panelId: 'p1' }
    ]);
  });

  it('NO avisa si la ventana tiene el foco, si están desactivadas ni al arrancar una sesión (idle sin working)', () => {
    const focused = setup({ focused: true });
    focused.notifier.onState('p', 'working');
    focused.notifier.onState('p', 'waiting');
    expect(focused.shown).toEqual([]);
    const off = setup({ enabled: false });
    off.notifier.onState('p', 'waiting');
    expect(off.shown).toEqual([]);
    const fresh = setup();
    fresh.notifier.onState('p', 'idle');
    expect(fresh.shown).toEqual([]);
  });

  it('no repite avisos del mismo panel en menos del tiempo mínimo, pero sí de otro panel', () => {
    const { notifier, shown, advance } = setup();
    notifier.onState('p1', 'waiting');
    advance(1000);
    notifier.onState('p1', 'working');
    notifier.onState('p1', 'waiting');
    notifier.onState('p2', 'waiting');
    expect(shown.map((s) => s.panelId)).toEqual(['p1', 'p2']);
    advance(6000);
    notifier.onState('p1', 'working');
    notifier.onState('p1', 'waiting');
    expect(shown).toHaveLength(3);
  });

  it('si el panel ya no existe no muestra nada', () => {
    const { notifier, shown, state } = setup();
    state.exists = false;
    notifier.onState('p1', 'waiting');
    expect(shown).toEqual([]);
  });
});
