import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export function openDatabase(path: string): DatabaseSync {
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA foreign_keys = ON');
  db.exec('PRAGMA busy_timeout = 5000');
  return db;
}

/** Comprobación rápida de integridad. Si el archivo no es una BD, devuelve false. */
export function isHealthy(db: DatabaseSync): boolean {
  try {
    const rows = db.prepare('PRAGMA quick_check').all() as Array<Record<string, unknown>>;
    return rows.length === 1 && Object.values(rows[0] ?? {})[0] === 'ok';
  } catch {
    return false;
  }
}

function stamp(now: Date): string {
  return now.toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '-');
}

/** Copia consistente con VACUUM INTO (incluye lo que aún está en el WAL). Conserva las `keep` más recientes. */
export function createBackup(
  db: DatabaseSync,
  backupsDir: string,
  options: { keep?: number; label?: string; now?: () => Date } = {}
): string {
  const keep = options.keep ?? 10;
  const label = (options.label ?? 'auto').replace(/[^a-z0-9-]/gi, '');
  const now = options.now ?? (() => new Date());
  mkdirSync(backupsDir, { recursive: true });
  let target = join(backupsDir, `nave-${stamp(now())}-${label}.db`);
  for (let n = 1; existsSync(target); n++) target = join(backupsDir, `nave-${stamp(now())}-${label}-${n}.db`);
  db.prepare('VACUUM INTO ?').run(target);
  for (const old of listBackups(backupsDir).slice(keep)) rmSync(old, { force: true });
  return target;
}

/** Copias de seguridad, de la más nueva a la más antigua. */
export function listBackups(backupsDir: string): string[] {
  if (!existsSync(backupsDir)) return [];
  return readdirSync(backupsDir)
    .filter((f) => /^nave-.*\.db$/.test(f))
    .sort()
    .reverse()
    .map((f) => join(backupsDir, f));
}

export function verifyBackup(path: string): boolean {
  if (!existsSync(path)) return false;
  let db: DatabaseSync | undefined;
  try {
    db = new DatabaseSync(path, { readOnly: true });
    return isHealthy(db);
  } catch {
    return false;
  } finally {
    db?.close();
  }
}

function removeSidecars(dbPath: string): void {
  rmSync(`${dbPath}-wal`, { force: true });
  rmSync(`${dbPath}-shm`, { force: true });
}

const markerPath = (dbPath: string): string => join(dirname(dbPath), 'restore-request.json');

/** Pide restaurar una copia: no toca la BD abierta, deja un marcador que se aplica al arrancar. */
export function requestRestore(dbPath: string, backupFile: string): void {
  const backup = resolve(backupFile);
  if (!verifyBackup(backup)) {
    throw new Error(`La copia "${basename(backup)}" no existe o está dañada, así que no se puede restaurar. Elige otra copia.`);
  }
  writeFileSync(markerPath(dbPath), JSON.stringify({ backup, requestedAt: new Date().toISOString() }), 'utf8');
}

export type RestoreOutcome = { restored: false; reason: string | null } | { restored: true; from: string; previous: string };

/** Se llama al arrancar, ANTES de abrir la BD. La BD anterior queda guardada como `.before-restore-*`. */
export function applyPendingRestore(dbPath: string, now: () => Date = () => new Date()): RestoreOutcome {
  const marker = markerPath(dbPath);
  if (!existsSync(marker)) return { restored: false, reason: null };
  try {
    const { backup } = JSON.parse(readFileSync(marker, 'utf8')) as { backup?: unknown };
    if (typeof backup !== 'string' || !verifyBackup(backup)) {
      return { restored: false, reason: 'La copia pedida ya no existe o está dañada; se mantiene la base de datos actual.' };
    }
    const previous = `${dbPath}.before-restore-${stamp(now())}`;
    if (existsSync(dbPath)) renameSync(dbPath, previous);
    removeSidecars(dbPath);
    copyFileSync(backup, dbPath);
    return { restored: true, from: backup, previous };
  } catch {
    return { restored: false, reason: 'No se pudo leer la petición de restauración; se mantiene la base de datos actual.' };
  } finally {
    rmSync(marker, { force: true });
  }
}

export interface OpenResult {
  db: DatabaseSync;
  recovery: 'none' | 'backup' | 'fresh';
  restore: RestoreOutcome;
  /** Archivo corrupto apartado, si lo hubo. */
  quarantined: string | null;
}

/**
 * Arranque seguro: aplica una restauración pedida, abre la BD y, si está corrupta,
 * aparta el archivo y recupera la última copia sana (o crea una BD nueva).
 */
export function openWithRecovery(dbPath: string, backupsDir: string, now: () => Date = () => new Date()): OpenResult {
  const restore = applyPendingRestore(dbPath, now);
  const tryOpen = (): DatabaseSync | null => {
    try {
      const db = openDatabase(dbPath);
      if (isHealthy(db)) return db;
      db.close();
    } catch {
      /* archivo ilegible: se trata como corrupto */
    }
    return null;
  };

  if (!existsSync(dbPath)) {
    return { db: openDatabase(dbPath), recovery: 'none', restore, quarantined: null };
  }
  const healthy = tryOpen();
  if (healthy) return { db: healthy, recovery: 'none', restore, quarantined: null };

  const quarantined = `${dbPath}.corrupt-${stamp(now())}`;
  renameSync(dbPath, quarantined);
  removeSidecars(dbPath);
  for (const backup of listBackups(backupsDir)) {
    if (!verifyBackup(backup)) continue;
    copyFileSync(backup, dbPath);
    const db = tryOpen();
    if (db) return { db, recovery: 'backup', restore, quarantined };
    rmSync(dbPath, { force: true });
  }
  return { db: openDatabase(dbPath), recovery: 'fresh', restore, quarantined };
}
