import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { startCore } from './nave';

function setup() {
  const dir = mkdtempSync(join(tmpdir(), 'nave-backups-'));
  const restart = vi.fn();
  const core = startCore(dir, '0.0.1', restart);
  return { dir, core, restart };
}

describe('Backups', () => {
  it('crea copias manuales verificables y las lista, la más nueva primero, con etiqueta y fecha', () => {
    const { core } = setup();
    const created = core.backups.create();
    expect(created).toMatchObject({ label: 'manual', sizeBytes: expect.any(Number) });
    expect(created.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    const names = core.backups.list().map((b) => b.label);
    expect(names).toContain('arranque');
    expect(names).toContain('manual');
    core.close();
  });

  it('restaurar: guarda antes una copia para deshacer, deja el marcador y pide reiniciar; NO toca la BD abierta', () => {
    const { dir, core, restart } = setup();
    core.projects.create({ name: 'Antes' });
    const backup = core.backups.create();
    core.projects.create({ name: 'Después' });
    core.backups.restore(backup.name);
    expect(restart).toHaveBeenCalledTimes(1);
    expect(existsSync(join(dir, 'restore-request.json'))).toBe(true);
    expect(core.backups.list().some((b) => b.label === 'antes-de-restaurar')).toBe(true);
    expect(core.projects.list(false).map((p) => p.name)).toEqual(['Antes', 'Después']); // sigue la BD de ahora
    core.close();
  });

  it('al arrancar de nuevo se aplica la restauración y los datos vuelven a ser los de la copia', () => {
    const { dir, core } = setup();
    core.projects.create({ name: 'Antes' });
    const backup = core.backups.create();
    core.projects.create({ name: 'Después' });
    core.backups.restore(backup.name);
    core.close();
    const reopened = startCore(dir, '0.0.1');
    expect(reopened.projects.list(false).map((p) => p.name)).toEqual(['Antes']);
    expect(existsSync(join(dir, 'restore-request.json'))).toBe(false);
    // y se puede DESHACER volviendo a la copia de seguridad previa a restaurar
    const undo = reopened.backups.list().find((b) => b.label === 'antes-de-restaurar');
    expect(undo).toBeDefined();
    reopened.close();
  });

  it('SEGURIDAD: una copia dañada se rechaza antes de tocar nada; un nombre que no existe da NOT_FOUND', () => {
    const { dir, core, restart } = setup();
    const file = join(dir, 'backups', 'nave-20200101-000000-manual.db');
    writeFileSync(file, 'esto no es sqlite');
    expect(() => core.backups.restore('nave-20200101-000000-manual.db')).toThrow(/dañada|no existe/);
    expect(() => core.backups.restore('nave-20200101-000000-nada.db')).toThrow(/ya no existe/);
    expect(restart).not.toHaveBeenCalled();
    expect(existsSync(join(dir, 'restore-request.json'))).toBe(false);
    expect(readFileSync(file, 'utf8')).toBe('esto no es sqlite');
    core.close();
  });

  it('SEGURIDAD: un nombre con ruta no sale de la carpeta de copias', () => {
    const { core } = setup();
    expect(() => core.backups.restore('../nave.db')).toThrow();
    expect(() => core.backups.restore('sub/nave-20200101-000000-manual.db')).toThrow();
    core.close();
  });
});
