import { createHash } from 'node:crypto';
import type { DatabaseSync } from 'node:sqlite';

export interface Migration {
  version: number;
  name: string;
  sql: string;
}

/**
 * Migraciones SOLO aditivas: nunca se edita una antigua (el checksum lo impide).
 * Un cambio de esquema es una migración nueva al final de la lista.
 */
export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    name: 'nucleo',
    sql: `
      CREATE TABLE settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ts TEXT NOT NULL,
        project_id TEXT,
        type TEXT NOT NULL,
        payload TEXT NOT NULL DEFAULT '{}'
      );
      CREATE INDEX activity_ts ON activity(ts);
    `
  },
  {
    version: 2,
    name: 'proyectos_y_pizarra',
    sql: `
      CREATE TABLE projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        root_path TEXT,
        archived_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE boards (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
        cam_x REAL NOT NULL DEFAULT 0,
        cam_y REAL NOT NULL DEFAULT 0,
        zoom REAL NOT NULL DEFAULT 1
      );
      CREATE TABLE panels (
        id TEXT PRIMARY KEY,
        board_id TEXT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
        project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        kind TEXT NOT NULL,
        title TEXT NOT NULL,
        x REAL NOT NULL,
        y REAL NOT NULL,
        w REAL NOT NULL,
        h REAL NOT NULL,
        z INTEGER NOT NULL DEFAULT 0,
        config TEXT NOT NULL DEFAULT '{}',
        host_id TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX panels_board ON panels(board_id);
    `
  },
  {
    version: 3,
    name: 'sesiones_de_claude',
    sql: `
      CREATE TABLE claude_sessions (
        panel_id TEXT PRIMARY KEY REFERENCES panels(id) ON DELETE CASCADE,
        session_id TEXT NOT NULL,
        state TEXT NOT NULL,
        transcript_path TEXT,
        updated_at TEXT NOT NULL
      );
    `
  }
];

export function checksum(sql: string): string {
  return createHash('sha256').update(sql).digest('hex');
}

function assertSequential(migrations: Migration[]): void {
  migrations.forEach((m, i) => {
    if (m.version !== i + 1) {
      throw new Error(`Las migraciones deben ir numeradas 1, 2, 3... sin huecos: se esperaba la ${i + 1} y hay la ${m.version}.`);
    }
  });
}

interface AppliedRow {
  version: number;
  name: string;
  checksum: string;
}

/** Aplica las migraciones pendientes, cada una en su propia transacción. Devuelve las versiones aplicadas. */
export function migrate(
  db: DatabaseSync,
  migrations: Migration[] = MIGRATIONS,
  options: { upTo?: number } = {}
): number[] {
  assertSequential(migrations);
  db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    checksum TEXT NOT NULL,
    applied_at TEXT NOT NULL
  )`);

  const applied = db.prepare('SELECT version, name, checksum FROM schema_migrations ORDER BY version').all() as unknown as AppliedRow[];
  for (const row of applied) {
    const known = migrations.find((m) => m.version === row.version);
    if (!known) {
      throw new Error(
        `La base de datos tiene la migración ${row.version} ("${row.name}"), que esta versión de la app no conoce. ` +
          'Se creó con una versión más nueva. Actualiza La Nave o restaura una copia de seguridad anterior.'
      );
    }
    if (known.sql && checksum(known.sql) !== row.checksum) {
      throw new Error(
        `La migración ${row.version} ("${row.name}") ha cambiado después de aplicarse. ` +
          'No se editan migraciones antiguas: añade una migración nueva con el cambio.'
      );
    }
  }

  const last = applied.length > 0 ? Math.max(...applied.map((r) => r.version)) : 0;
  const limit = options.upTo ?? Number.POSITIVE_INFINITY;
  const done: number[] = [];
  for (const m of migrations) {
    if (m.version <= last || m.version > limit) continue;
    db.exec('BEGIN');
    try {
      db.exec(m.sql);
      db.prepare('INSERT INTO schema_migrations (version, name, checksum, applied_at) VALUES (?, ?, ?, ?)').run(
        m.version,
        m.name,
        checksum(m.sql),
        new Date().toISOString()
      );
      db.exec('COMMIT');
      done.push(m.version);
    } catch (error) {
      db.exec('ROLLBACK');
      const reason = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Falló la migración ${m.version} ("${m.name}"): ${reason}. La base de datos no se ha modificado. ` +
          'Haz una copia de seguridad desde Ajustes y avisa del error.'
      );
    }
  }
  return done;
}
