import { mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createFileSink, createLogger, createMemorySink } from './logging';

describe('logging', () => {
  it('escribe JSONL con canal y nivel, y nunca deja pasar secretos', () => {
    const sink = createMemorySink();
    const log = createLogger('security', sink, { now: () => new Date('2026-10-29T10:00:00Z') });
    const secret = 'sk-ant-' + 'q9'.repeat(15);
    log.info(`token ${secret}`, { password: 'x', detalle: secret });
    const entry = JSON.parse(sink.lines[0] ?? '{}') as Record<string, unknown>;
    expect(entry['channel']).toBe('security');
    expect(entry['level']).toBe('info');
    expect(entry['ts']).toBe('2026-10-29T10:00:00.000Z');
    expect(sink.lines[0]).not.toContain(secret);
  });

  it('respeta el nivel mínimo', () => {
    const sink = createMemorySink();
    const log = createLogger('app', sink, { minLevel: 'warn' });
    log.info('no');
    log.error('sí');
    expect(sink.lines).toHaveLength(1);
  });

  it('rota el archivo al superar el tamaño', () => {
    const dir = mkdtempSync(join(tmpdir(), 'nave-log-'));
    const file = join(dir, 'app.log');
    const sink = createFileSink(file, { maxBytes: 100, keep: 2 });
    const log = createLogger('app', sink);
    for (let i = 0; i < 12; i++) log.info(`linea numero ${i} con algo de relleno para pesar`);
    const names = readdirSync(dir).sort();
    expect(names).toContain('app.log');
    expect(names).toContain('app.log.1');
    expect(names).not.toContain('app.log.3');
    expect(readFileSync(file, 'utf8').length).toBeGreaterThan(0);
  });
});
