import { describe, expect, it } from 'vitest';
import { matchShortcut } from './shortcuts';
import type { KeyLike } from './shortcuts';

const key = (k: string, mods: Partial<KeyLike> = {}): KeyLike => ({ key: k, ctrlKey: false, metaKey: false, shiftKey: false, altKey: false, ...mods });

describe('atajos fijos', () => {
  it('Ctrl+K = búsqueda global; Ctrl+Shift+P/T/A/B = paleta, terminal, agente, Brain', () => {
    expect(matchShortcut(key('k', { ctrlKey: true }))).toBe('search');
    expect(matchShortcut(key('P', { ctrlKey: true, shiftKey: true }))).toBe('palette');
    expect(matchShortcut(key('T', { ctrlKey: true, shiftKey: true }))).toBe('terminal');
    expect(matchShortcut(key('A', { ctrlKey: true, shiftKey: true }))).toBe('agent');
    expect(matchShortcut(key('B', { ctrlKey: true, shiftKey: true }))).toBe('brain');
  });

  it('NO existe Ctrl+N (ni con Shift) y las teclas sueltas o con Alt no hacen nada', () => {
    expect(matchShortcut(key('n', { ctrlKey: true }))).toBeNull();
    expect(matchShortcut(key('N', { ctrlKey: true, shiftKey: true }))).toBeNull();
    expect(matchShortcut(key('k'))).toBeNull();
    expect(matchShortcut(key('K', { shiftKey: true }))).toBeNull();
    expect(matchShortcut(key('k', { ctrlKey: true, altKey: true }))).toBeNull();
    expect(matchShortcut(key('p', { ctrlKey: true }))).toBeNull();
  });

  it('en macOS vale Cmd en lugar de Ctrl', () => {
    expect(matchShortcut(key('k', { metaKey: true }))).toBe('search');
  });
});
