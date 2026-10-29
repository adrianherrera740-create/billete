import { appendFileSync, existsSync, mkdirSync, renameSync, rmSync, statSync } from 'node:fs';
import { dirname } from 'node:path';
import { redactDeep, redactSecrets } from './redact';

/**
 * Cuatro registros separados. La salida de las terminales NO se registra:
 * el canal `terminals` solo guarda el ciclo de vida (arranque, salida, errores).
 */
export type LogChannel = 'app' | 'terminals' | 'security' | 'activity';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogSink {
  write(line: string): void;
}

export interface Logger {
  debug(message: string, data?: unknown): void;
  info(message: string, data?: unknown): void;
  warn(message: string, data?: unknown): void;
  error(message: string, data?: unknown): void;
}

const ORDER: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

export function createLogger(
  channel: LogChannel,
  sink: LogSink,
  options: { minLevel?: LogLevel; now?: () => Date } = {}
): Logger {
  const minLevel = options.minLevel ?? 'info';
  const now = options.now ?? (() => new Date());
  const log = (level: LogLevel, message: string, data?: unknown): void => {
    if (ORDER[level] < ORDER[minLevel]) return;
    const entry: Record<string, unknown> = {
      ts: now().toISOString(),
      level,
      channel,
      msg: redactSecrets(message)
    };
    if (data !== undefined) entry['data'] = redactDeep(data);
    sink.write(JSON.stringify(entry));
  };
  return {
    debug: (m, d) => log('debug', m, d),
    info: (m, d) => log('info', m, d),
    warn: (m, d) => log('warn', m, d),
    error: (m, d) => log('error', m, d)
  };
}

export function createMemorySink(): LogSink & { lines: string[] } {
  const lines: string[] = [];
  return { lines, write: (line) => void lines.push(line) };
}

/** Archivo JSONL con rotación por tamaño: file, file.1, file.2... */
export function createFileSink(filePath: string, options: { maxBytes?: number; keep?: number } = {}): LogSink {
  const maxBytes = options.maxBytes ?? 2_000_000;
  const keep = options.keep ?? 3;
  mkdirSync(dirname(filePath), { recursive: true });
  const rotate = (): void => {
    rmSync(`${filePath}.${keep}`, { force: true });
    for (let i = keep - 1; i >= 1; i--) {
      if (existsSync(`${filePath}.${i}`)) renameSync(`${filePath}.${i}`, `${filePath}.${i + 1}`);
    }
    renameSync(filePath, `${filePath}.1`);
  };
  return {
    write(line) {
      if (existsSync(filePath) && statSync(filePath).size >= maxBytes) rotate();
      appendFileSync(filePath, `${line}\n`, 'utf8');
    }
  };
}
