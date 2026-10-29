import { describe, expect, it } from 'vitest';
import { ValidationError, absolutePath, hexColor, jsonObject, nullable, num, object, objectWith, oneOf, str } from './parse';

describe('parsers (seguridad: validación de entrada)', () => {
  it('str recorta, valida longitud y rechaza NUL y no-texto', () => {
    const p = str({ min: 1, max: 5, trim: true });
    expect(p('  hola ')).toBe('hola');
    expect(() => p('')).toThrow(ValidationError);
    expect(() => p('   ')).toThrow(/vacío/);
    expect(() => p('demasiado')).toThrow(/pasar de 5/);
    expect(() => p(5)).toThrow(/texto/);
    expect(() => p('a\0b')).toThrow(/no válidos/);
  });

  it('num rechaza NaN, Infinity, cadenas y fuera de rango', () => {
    const p = num({ min: 0, max: 10, int: true });
    expect(p(3)).toBe(3);
    for (const bad of [NaN, Infinity, '3', 11, -1, 2.5]) expect(() => p(bad)).toThrow(ValidationError);
  });

  it('object exige todas las claves y rechaza las desconocidas', () => {
    const p = object({ a: str({ min: 1 }), b: num() });
    expect(p({ a: 'x', b: 1 })).toEqual({ a: 'x', b: 1 });
    expect(() => p({ a: 'x' })).toThrow(/falta este campo/);
    expect(() => p({ a: 'x', b: 1, c: 2 })).toThrow(/campo desconocido/);
    expect(() => p([])).toThrow(/objeto/);
    expect(() => p(null)).toThrow(/objeto/);
  });

  it('objectWith deja fuera las opcionales ausentes y no contamina el prototipo', () => {
    const p = objectWith({ id: str({ min: 1 }) }, { name: str({ min: 1 }) });
    expect(p({ id: '1' })).toEqual({ id: '1' });
    expect('name' in p({ id: '1' })).toBe(false);
    const hostile = JSON.parse('{"id":"1","__proto__":{"polluted":true}}') as unknown;
    expect(() => p(hostile)).toThrow(/campo desconocido/);
    expect(({} as Record<string, unknown>)['polluted']).toBeUndefined();
  });

  it('oneOf, nullable y hexColor', () => {
    expect(oneOf(['a', 'b'])('a')).toBe('a');
    expect(() => oneOf(['a', 'b'])('c')).toThrow(/uno de/);
    expect(nullable(str({ min: 1 }))(null)).toBeNull();
    expect(hexColor('#AABBCC')).toBe('#aabbcc');
    expect(() => hexColor('rojo')).toThrow(/#rrggbb/);
  });

  it('absolutePath acepta rutas absolutas y rechaza relativas, ".." y control', () => {
    expect(absolutePath('C:\\Proyectos\\mi app')).toBe('C:\\Proyectos\\mi app');
    expect(absolutePath('/home/yo/p')).toBe('/home/yo/p');
    for (const bad of ['proyectos/x', '..\\x', 'C:\\a\\..\\b', '/a/../b', 'C:\\a\u0007b', '']) {
      expect(() => absolutePath(bad)).toThrow(ValidationError);
    }
  });

  it('jsonObject limita el tamaño y rechaza no-objetos', () => {
    const p = jsonObject(20);
    expect(p({ a: 1 })).toEqual({ a: 1 });
    expect(() => p({ texto: 'x'.repeat(50) })).toThrow(/demasiado grande/);
    expect(() => p('x')).toThrow(/objeto/);
  });
});
