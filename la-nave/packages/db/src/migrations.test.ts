import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it } from 'vitest';
import { MIGRATIONS, migrate } from './migrations';
import type { Migration } from './migrations';

const mem = (): DatabaseSync => new DatabaseSync(':memory:');

describe('migraciones', () => {
  it('aplica las reales sobre una BD vacía y es idempotente', () => {
    const db = mem();
    expect(migrate(db)).toEqual(MIGRATIONS.map((m) => m.version));
    expect(migrate(db)).toEqual([]);
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as Array<{ name: string }>;
    expect(tables.map((t) => t.name)).toEqual(expect.arrayContaining(['settings', 'activity', 'schema_migrations']));
  });

  it('una migración nueva sobre una BD antigua no pierde datos', () => {
    const v1: Migration = { version: 1, name: 'a', sql: 'CREATE TABLE t (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL);' };
    const v2: Migration = { version: 2, name: 'b', sql: "ALTER TABLE t ADD COLUMN color TEXT NOT NULL DEFAULT 'azul';" };
    const db = mem();
    migrate(db, [v1, v2], { upTo: 1 });
    db.prepare('INSERT INTO t (nombre) VALUES (?)').run('Proyecto uno');
    expect(migrate(db, [v1, v2])).toEqual([2]);
    expect(db.prepare('SELECT nombre, color FROM t').all()).toEqual([{ nombre: 'Proyecto uno', color: 'azul' }]);
  });

  it('la migración 2 sobre una BD en versión 1 conserva ajustes y actividad', () => {
    const db = mem();
    migrate(db, MIGRATIONS, { upTo: 1 });
    db.prepare("INSERT INTO settings (key, value, updated_at) VALUES ('tema', 'oscuro', 'hoy')").run();
    db.prepare("INSERT INTO activity (ts, type) VALUES ('hoy', 'prueba')").run();
    expect(migrate(db)).toEqual(MIGRATIONS.slice(1).map((m) => m.version));
    expect(db.prepare('SELECT value FROM settings').all()).toEqual([{ value: 'oscuro' }]);
    expect(db.prepare('SELECT type FROM activity').all()).toEqual([{ type: 'prueba' }]);
  });

  it('la migración 3 sobre una BD en versión 2 conserva proyectos y paneles', () => {
    const db = mem();
    db.exec('PRAGMA foreign_keys = ON');
    migrate(db, MIGRATIONS, { upTo: 2 });
    db.exec(`INSERT INTO projects VALUES ('p','n','i','#000000',NULL,NULL,'t','t');
      INSERT INTO boards (id, project_id) VALUES ('b','p');
      INSERT INTO panels (id, board_id, project_id, kind, title, x, y, w, h, created_at, updated_at) VALUES ('a','b','p','claude','t',0,0,200,100,'t','t');`);
    expect(migrate(db)).toEqual([3]);
    expect(db.prepare('SELECT id FROM panels').all()).toEqual([{ id: 'a' }]);
    db.exec("INSERT INTO claude_sessions (panel_id, session_id, state, updated_at) VALUES ('a','s','idle','t')");
    db.exec("DELETE FROM panels WHERE id = 'a'");
    expect(db.prepare('SELECT COUNT(*) AS n FROM claude_sessions').get()).toEqual({ n: 0 });
  });

  it('borrar un proyecto borra su pizarra y sus paneles en cascada', () => {
    const db = mem();
    db.exec('PRAGMA foreign_keys = ON');
    migrate(db);
    db.exec(`INSERT INTO projects VALUES ('p','n','i','#000000',NULL,NULL,'t','t');
      INSERT INTO boards (id, project_id) VALUES ('b','p');
      INSERT INTO panels (id, board_id, project_id, kind, title, x, y, w, h, created_at, updated_at) VALUES ('a','b','p','sticky','t',0,0,200,100,'t','t');`);
    db.exec("DELETE FROM projects WHERE id = 'p'");
    expect(db.prepare('SELECT COUNT(*) AS n FROM panels').get()).toEqual({ n: 0 });
  });

  it('rechaza una migración antigua editada (checksum)', () => {
    const db = mem();
    migrate(db);
    const edited = MIGRATIONS.map((m, i) => (i === 0 ? { ...m, sql: `${m.sql}\nCREATE TABLE extra (x);` } : m));
    expect(() => migrate(db, edited)).toThrow(/ha cambiado después de aplicarse/);
  });

  it('rechaza una BD creada por una versión más nueva', () => {
    const db = mem();
    const v1: Migration = { version: 1, name: 'a', sql: 'CREATE TABLE a (x);' };
    const v2: Migration = { version: 2, name: 'b', sql: 'CREATE TABLE b (x);' };
    migrate(db, [v1, v2]);
    expect(() => migrate(db, [v1])).toThrow(/versión más nueva/);
  });

  it('si una migración falla hace rollback y no deja la BD a medias', () => {
    const db = mem();
    const bad: Migration = { version: 1, name: 'mala', sql: 'CREATE TABLE ok (x); CREATE TABLE ok (x);' };
    expect(() => migrate(db, [bad])).toThrow(/Falló la migración 1/);
    const names = (db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as Array<{ name: string }>).map((t) => t.name);
    expect(names).not.toContain('ok');
    expect(db.prepare('SELECT COUNT(*) AS n FROM schema_migrations').get()).toEqual({ n: 0 });
  });

  it('exige numeración sin huecos', () => {
    expect(() => migrate(mem(), [{ version: 2, name: 'x', sql: 'SELECT 1;' }])).toThrow(/sin huecos/);
  });
});
