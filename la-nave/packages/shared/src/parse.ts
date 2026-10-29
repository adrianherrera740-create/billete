/** Parsers a mano (sin dependencias). Toda entrada IPC o remota pasa por uno antes de tocar nada. */
export class ValidationError extends Error {
  constructor(
    readonly path: string,
    message: string
  ) {
    super(`${path}: ${message}`);
    this.name = 'ValidationError';
  }
}

export type Parser<T> = (value: unknown, path?: string) => T;

const fail = (path: string, message: string): never => {
  throw new ValidationError(path, message);
};

export function str(options: { min?: number; max?: number; trim?: boolean } = {}): Parser<string> {
  const { min = 0, max = 10_000, trim = false } = options;
  return (value, path = 'valor') => {
    if (typeof value !== 'string') return fail(path, 'debe ser texto');
    if (value.includes('\0')) return fail(path, 'contiene caracteres no válidos');
    const text = trim ? value.trim() : value;
    if (text.length < min) return fail(path, min === 1 ? 'no puede estar vacío' : `debe tener al menos ${min} caracteres`);
    if (text.length > max) return fail(path, `no puede pasar de ${max} caracteres`);
    return text;
  };
}

export function num(options: { min?: number; max?: number; int?: boolean } = {}): Parser<number> {
  const { min = -Infinity, max = Infinity, int = false } = options;
  return (value, path = 'valor') => {
    if (typeof value !== 'number' || !Number.isFinite(value)) return fail(path, 'debe ser un número');
    if (int && !Number.isInteger(value)) return fail(path, 'debe ser un número entero');
    if (value < min || value > max) return fail(path, `debe estar entre ${min} y ${max}`);
    return value;
  };
}

export const bool: Parser<boolean> = (value, path = 'valor') =>
  typeof value === 'boolean' ? value : fail(path, 'debe ser verdadero o falso');

export function oneOf<T extends string>(values: readonly T[]): Parser<T> {
  return (value, path = 'valor') =>
    typeof value === 'string' && (values as readonly string[]).includes(value)
      ? (value as T)
      : fail(path, `debe ser uno de: ${values.join(', ')}`);
}

export function nullable<T>(parser: Parser<T>): Parser<T | null> {
  return (value, path) => (value === null ? null : parser(value, path));
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

type Shape = Record<string, Parser<unknown>>;
type Out<S extends Shape> = { [K in keyof S]: ReturnType<S[K]> };

/** Objeto con todas las claves obligatorias. Una clave desconocida es un error (detecta erratas). */
export function object<S extends Shape>(shape: S): Parser<Out<S>> {
  return (value, path = 'datos') => {
    if (!isPlainObject(value)) return fail(path, 'debe ser un objeto');
    for (const key of Object.keys(value)) if (!Object.hasOwn(shape, key)) fail(`${path}.${key}`, 'campo desconocido');
    const out: Record<string, unknown> = {};
    for (const [key, parser] of Object.entries(shape)) {
      if (!Object.hasOwn(value, key)) fail(`${path}.${key}`, 'falta este campo');
      out[key] = parser(value[key], `${path}.${key}`);
    }
    return out as Out<S>;
  };
}

/** Como `object`, pero las claves de `optional` pueden faltar (si faltan, no aparecen en el resultado). */
export function objectWith<R extends Shape, O extends Shape>(
  required: R,
  optional: O
): Parser<Out<R> & { [K in keyof O]?: ReturnType<O[K]> }> {
  return (value, path = 'datos') => {
    if (!isPlainObject(value)) return fail(path, 'debe ser un objeto');
    const all: Shape = { ...required, ...optional };
    for (const key of Object.keys(value)) if (!Object.hasOwn(all, key)) fail(`${path}.${key}`, 'campo desconocido');
    const out: Record<string, unknown> = {};
    for (const [key, parser] of Object.entries(required)) {
      if (!Object.hasOwn(value, key)) fail(`${path}.${key}`, 'falta este campo');
      out[key] = parser(value[key], `${path}.${key}`);
    }
    for (const [key, parser] of Object.entries(optional)) {
      if (Object.hasOwn(value, key)) out[key] = parser(value[key], `${path}.${key}`);
    }
    return out as Out<R> & { [K in keyof O]?: ReturnType<O[K]> };
  };
}

export const nothing: Parser<undefined> = (value, path = 'datos') =>
  value === undefined || value === null ? undefined : fail(path, 'este canal no admite datos');

/** Objeto libre (p. ej. `config` de un panel) con límite de tamaño al serializar. */
export function jsonObject(maxChars: number): Parser<Record<string, unknown>> {
  return (value, path = 'config') => {
    if (!isPlainObject(value)) return fail(path, 'debe ser un objeto');
    let text: string;
    try {
      text = JSON.stringify(value);
    } catch {
      return fail(path, 'no se puede guardar');
    }
    if (text.length > maxChars) return fail(path, `es demasiado grande (máx. ${maxChars} caracteres)`);
    return value;
  };
}

export const hexColor: Parser<string> = (value, path = 'color') =>
  typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value) ? value.toLowerCase() : fail(path, 'debe tener la forma #rrggbb');

/** Ruta absoluta de Windows o POSIX, sin `..` ni caracteres de control. */
export const absolutePath: Parser<string> = (value, path = 'ruta') => {
  const text = str({ min: 1, max: 500, trim: true })(value, path);
  const absolute = /^[A-Za-z]:[\\/]/.test(text) || text.startsWith('/') || text.startsWith('\\\\');
  if (!absolute) return fail(path, 'debe ser una ruta absoluta');
  if (text.split(/[\\/]+/).includes('..')) return fail(path, 'no puede contener ".."');
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1f]/.test(text)) return fail(path, 'contiene caracteres no válidos');
  return text;
};
