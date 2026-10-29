import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it } from 'vitest';
import { FTS_ROWID_OFFSET, buildFtsQuery } from './fts';

describe('buildFtsQuery (seguridad: el texto de fuera nunca llega crudo a FTS)', () => {
  it('entrecomilla cada palabra y une con AND por defecto', () => {
    expect(buildFtsQuery('Proveedor  Seller Center')).toBe('"proveedor" "seller" "center"');
    expect(buildFtsQuery('hola mundo', { mode: 'or' })).toBe('"hola" OR "mundo"');
    expect(buildFtsQuery('prov', { prefixLast: true })).toBe('"prov"*');
  });

  it('no deja pasar operadores, comillas, paréntesis, columnas ni comodines', () => {
    const q = buildFtsQuery('title:secreto NOT (a OR b) NEAR("x" "y") * "\\"');
    expect(q).toBe('"title" "secreto" "not" "a" "or" "b" "near" "x" "y"');
    expect(q).not.toMatch(/[():*]|(?<!")\b(NOT|NEAR)\b/);
  });

  it('devuelve null si no hay palabras y limita el número y el tamaño de los términos', () => {
    expect(buildFtsQuery('')).toBeNull();
    expect(buildFtsQuery('()*"\'-- ;:')).toBeNull();
    expect(buildFtsQuery('a b c d e f g h i j k l m n o p')?.split(' ')).toHaveLength(12);
    expect(buildFtsQuery('x'.repeat(65))).toBeNull();
  });

  it('entiende acentos, ñ, otros alfabetos y emojis no rompen nada', () => {
    expect(buildFtsQuery('Reunión ÑANDÚ 日本語 🚀')).toBe('"reunión" "ñandú" "日本語"');
  });

  it('SEGURIDAD: cualquier entrada hostil se ejecuta sin error de sintaxis contra un FTS5 real', () => {
    const db = new DatabaseSync(':memory:');
    db.exec('CREATE VIRTUAL TABLE t USING fts5(title, body)');
    db.exec(`INSERT INTO t (rowid, title, body) VALUES (${FTS_ROWID_OFFSET + 1}, 'plan secreto', 'proveedor de coches')`);
    const hostile = ['"', '""', '"unclosed', 'a AND', 'NOT', '(', ')', 'title:', '{body}: x', '^proveedor', 'NEAR(a b, 5)', 'a* b*', '--', "'; DROP TABLE t; --", '\u0000', 'x'.repeat(5000)];
    for (const input of hostile) {
      const q = buildFtsQuery(input);
      if (q !== null) expect(() => db.prepare('SELECT rowid FROM t WHERE t MATCH ?').all(q), input).not.toThrow();
    }
    // Crudo, `title:secreto` filtraría por columna y encontraría la fila; saneado se busca como dos palabras
    // normales ("title" Y "secreto"), así que no la encuentra: el operador no se interpreta.
    expect(db.prepare('SELECT rowid FROM t WHERE t MATCH ?').all('title:secreto')).toHaveLength(1);
    expect(db.prepare('SELECT rowid FROM t WHERE t MATCH ?').all(buildFtsQuery('title:secreto') ?? '')).toHaveLength(0);
    // y sin buildFtsQuery esa misma entrada SÍ rompe, que es la razón de la regla
    expect(() => db.prepare('SELECT rowid FROM t WHERE t MATCH ?').all('"unclosed')).toThrow();
  });
});
