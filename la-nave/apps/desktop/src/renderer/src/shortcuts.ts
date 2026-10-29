export type ShortcutId = 'search' | 'palette' | 'terminal' | 'agent' | 'brain';

export interface KeyLike {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

/**
 * Atajos fijos: Ctrl+K búsqueda global, Ctrl+Shift+P paleta, Ctrl+Shift+T terminal, Ctrl+Shift+A agente,
 * Ctrl+Shift+B Brain. NO existe Ctrl+N (decisión del diseño). En macOS se acepta Cmd en lugar de Ctrl.
 */
export function matchShortcut(e: KeyLike): ShortcutId | null {
  if (!(e.ctrlKey || e.metaKey) || e.altKey) return null;
  const key = e.key.toLowerCase();
  if (!e.shiftKey) return key === 'k' ? 'search' : null;
  if (key === 'p') return 'palette';
  if (key === 't') return 'terminal';
  if (key === 'a') return 'agent';
  if (key === 'b') return 'brain';
  return null;
}
