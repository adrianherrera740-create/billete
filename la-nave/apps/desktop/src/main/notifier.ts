import type { ClaudeState } from '@nave/shared';

export interface NotifierDeps {
  enabled(): boolean;
  anyWindowFocused(): boolean;
  /** Nombres para mostrar; null si el panel ya no existe. */
  describe(panelId: string): { panel: string; project: string } | null;
  show(notification: { title: string; body: string; panelId: string }): void;
  now(): number;
  /** Mínimo entre dos avisos del mismo panel. */
  minGapMs?: number;
}

/**
 * Notificaciones nativas SOLO si la persona no está mirando La Nave (ninguna ventana con foco) y las tiene activadas.
 * Avisa cuando Claude espera una respuesta o cuando termina un trabajo; nunca incluye el contenido de la conversación.
 */
export function createNotifier(deps: NotifierDeps): { onState(panelId: string, state: ClaudeState): void } {
  const previous = new Map<string, ClaudeState>();
  const lastShown = new Map<string, number>();
  const gap = deps.minGapMs ?? 5000;
  return {
    onState(panelId, state) {
      const before = previous.get(panelId);
      previous.set(panelId, state);
      const body = state === 'waiting' ? 'Claude espera tu respuesta.' : state === 'idle' && before === 'working' ? 'Claude ha terminado.' : null;
      if (body === null || !deps.enabled() || deps.anyWindowFocused()) return;
      const last = lastShown.get(panelId);
      if (last !== undefined && deps.now() - last < gap) return;
      const names = deps.describe(panelId);
      if (!names) return;
      lastShown.set(panelId, deps.now());
      deps.show({ title: `${names.panel} · ${names.project}`, body, panelId });
    }
  };
}
