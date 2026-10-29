import { describe, expect, it } from 'vitest';
import es from './locales/es.json';

function leaves(value: unknown, path = ''): Array<[string, unknown]> {
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
  }
  return [[path, value]];
}

describe('es.json', () => {
  it('todas las claves son texto no vacío', () => {
    for (const [key, value] of leaves(es)) {
      expect(typeof value, key).toBe('string');
      expect((value as string).trim().length, key).toBeGreaterThan(0);
    }
  });
});
