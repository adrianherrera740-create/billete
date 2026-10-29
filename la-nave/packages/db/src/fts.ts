/** Desplazamiento fijo del rowid de FTS respecto al rowid del nodo: determinista y reconstruible. */
export const FTS_ROWID_OFFSET = 1_000_000_000_000;

export interface FtsQueryOptions {
  /** `and`: deben aparecer todas las palabras (búsqueda); `or`: basta con alguna (contexto). */
  mode?: 'and' | 'or';
  /** El último término se busca como prefijo (para escribir y ver resultados). */
  prefixLast?: boolean;
  maxTokens?: number;
}

/**
 * ÚNICA puerta de entrada del texto de la persona (o de Claude) hacia FTS5. Extrae palabras (letras y números de
 * cualquier idioma), las entrecomilla y descarta todo lo demás, así que operadores (AND, OR, NOT, NEAR), comillas,
 * paréntesis, `columna:` o `*` no se interpretan nunca. Devuelve null si no queda ninguna palabra.
 */
export function buildFtsQuery(text: string, options: FtsQueryOptions = {}): string | null {
  const { mode = 'and', prefixLast = false, maxTokens = 12 } = options;
  const tokens = (text.normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}_]+/gu) ?? []).filter((t) => t.length <= 64).slice(0, maxTokens);
  if (tokens.length === 0) return null;
  const parts = tokens.map((token, i) => (prefixLast && i === tokens.length - 1 ? `"${token}"*` : `"${token}"`));
  return parts.join(mode === 'or' ? ' OR ' : ' ');
}
