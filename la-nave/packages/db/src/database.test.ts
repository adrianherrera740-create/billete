import { existsSync, mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { backupLabel, createBackup, listBackups, openDatabase, openWithRecovery, requestRestore, verifyBackup } from './database';
import { migrate } from './migrations';

const tmp = (): string => mkdtempSync(join(tmpdir(), 'nave-db-'));

function seeded(dir: string): ReturnType<typeof openDatabase> {
  const db = openDatabase(join(dir, 'nave.db'));
  migrate(db);
  db.prepare("INSERT INTO settings (key, value, updated_at) VALUES ('tema', 'oscuro', 'hoy')").run();
  return db;
}

describe('copias de seguridad', () => {
  it('la copia contiene los datos y es verificable', () => {
    const dir = tmp();
    const db = seeded(dir);
    const file = createBackup(db, join(dir, 'backups'));
    expect(verifyBackup(file)).toBe(true);
    db.close();
  });

  it('conserva solo las N más recientes', () => {
    const dir = tmp();
    const db = seeded(dir);
    let t = Date.UTC(2026, 9, 29, 10, 0, 0);
    for (let i = 0; i < 5; i++) createBackup(db, join(dir, 'backups'), { keep: 3, now: () => new Date((t += 60_000)) });
    expect(listBackups(join(dir, 'backups'))).toHaveLength(3);
    db.close();
  });

  it('la poda es por etiqueta: muchas copias de arranque no borran las manuales', () => {
    const dir = tmp();
    const db = seeded(dir);
    let t = Date.UTC(2026, 9, 29, 10, 0, 0);
    const now = () => new Date((t += 60_000));
    const manual = createBackup(db, join(dir, 'backups'), { keep: 3, label: 'manual', now });
    for (let i = 0; i < 8; i++) createBackup(db, join(dir, 'backups'), { keep: 3, label: 'arranque', now });
    const names = listBackups(join(dir, 'backups'));
    expect(names).toContain(manual);
    expect(names.filter((n) => backupLabel(n) === 'arranque')).toHaveLength(3);
    db.close();
  });

  it('backupLabel entiende etiquetas con guiones y el sufijo numérico', () => {
    expect(backupLabel('/x/nave-20261029-100000-antes-de-restaurar.db')).toBe('antes-de-restaurar');
    expect(backupLabel('nave-20261029-100000-manual-2.db')).toBe('manual');
    expect(backupLabel('otra-cosa.db')).toBeNull();
  });

  it('rechaza un archivo que no es una copia sana', () => {
    const dir = tmp();
    const bogus = join(dir, 'nave-20260101-000000-auto.db');
    writeFileSync(bogus, 'esto no es sqlite');
    expect(verifyBackup(bogus)).toBe(false);
    expect(verifyBackup(join(dir, 'no-existe.db'))).toBe(false);
  });
});

describe('arranque seguro', () => {
  it('BD sana: no hace nada especial', () => {
    const dir = tmp();
    seeded(dir).close();
    const r = openWithRecovery(join(dir, 'nave.db'), join(dir, 'backups'));
    expect(r.recovery).toBe('none');
    r.db.close();
  });

  it('BD corrupta con copia: aparta el archivo y recupera los datos', () => {
    const dir = tmp();
    const backups = join(dir, 'backups');
    const db = seeded(dir);
    createBackup(db, backups);
    db.close();
    writeFileSync(join(dir, 'nave.db'), 'basura que no es una base de datos '.repeat(50));
    const r = openWithRecovery(join(dir, 'nave.db'), backups);
    expect(r.recovery).toBe('backup');
    expect(r.quarantined).not.toBeNull();
    expect(existsSync(r.quarantined ?? '')).toBe(true);
    expect(r.db.prepare("SELECT value FROM settings WHERE key = 'tema'").get()).toEqual({ value: 'oscuro' });
    r.db.close();
  });

  it('BD corrupta sin copias: crea una nueva sin perder el archivo viejo', () => {
    const dir = tmp();
    writeFileSync(join(dir, 'nave.db'), 'corrupto'.repeat(100));
    const r = openWithRecovery(join(dir, 'nave.db'), join(dir, 'backups'));
    expect(r.recovery).toBe('fresh');
    expect(readdirSync(dir).some((f) => f.includes('.corrupt-'))).toBe(true);
    r.db.close();
  });
});

describe('restauración al arrancar', () => {
  it('se pide con un marcador y se aplica antes de abrir la BD', () => {
    const dir = tmp();
    const backups = join(dir, 'backups');
    const db = seeded(dir);
    const file = createBackup(db, backups);
    db.prepare("UPDATE settings SET value = 'claro' WHERE key = 'tema'").run();
    db.close();
    requestRestore(join(dir, 'nave.db'), file);
    const r = openWithRecovery(join(dir, 'nave.db'), backups);
    expect(r.restore.restored).toBe(true);
    expect(r.db.prepare("SELECT value FROM settings WHERE key = 'tema'").get()).toEqual({ value: 'oscuro' });
    expect(readdirSync(dir).some((f) => f.includes('.before-restore-'))).toBe(true);
    expect(existsSync(join(dir, 'restore-request.json'))).toBe(false);
    r.db.close();
  });

  it('no acepta restaurar una copia dañada', () => {
    const dir = tmp();
    const bogus = join(dir, 'nave-20260101-000000-auto.db');
    writeFileSync(bogus, 'nada');
    expect(() => requestRestore(join(dir, 'nave.db'), bogus)).toThrow(/dañada/);
  });
});
