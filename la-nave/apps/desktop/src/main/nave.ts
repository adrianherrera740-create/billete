import { join } from 'node:path';
import type { DatabaseSync } from 'node:sqlite';
import { EventBus, createFileSink, createLogger } from '@nave/core';
import type { LogChannel, Logger } from '@nave/core';
import { createBackup, migrate, openWithRecovery } from '@nave/db';
import type { EventMap } from '@nave/shared';

export interface NaveCore {
  bus: EventBus<EventMap>;
  db: DatabaseSync;
  log: Record<LogChannel, Logger>;
  paths: { dataDir: string; db: string; backups: string; logs: string };
  close(): void;
}

const CHANNELS: LogChannel[] = ['app', 'terminals', 'security', 'activity'];

/** Nave Core: carpeta de datos, logs separados, BD con migraciones, copia al arrancar y bus de eventos. */
export function startCore(dataDir: string, version: string): NaveCore {
  const paths = { dataDir, db: join(dataDir, 'nave.db'), backups: join(dataDir, 'backups'), logs: join(dataDir, 'logs') };
  const log = Object.fromEntries(
    CHANNELS.map((c) => [c, createLogger(c, createFileSink(join(paths.logs, `${c}.log`)))])
  ) as Record<LogChannel, Logger>;
  const bus = new EventBus<EventMap>((event, error) => log.app.error(`Fallo en un manejador de ${event}`, error));

  const opened = openWithRecovery(paths.db, paths.backups);
  const { db } = opened;
  if (opened.recovery !== 'none') {
    log.security.warn('Base de datos recuperada al arrancar', { modo: opened.recovery, apartado: opened.quarantined });
    bus.emit('db.recovered', { mode: opened.recovery, quarantined: opened.quarantined });
  }
  if (opened.restore.restored) log.app.info('Copia de seguridad restaurada al arrancar', { desde: opened.restore.from });

  const applied = migrate(db);
  if (applied.length > 0) log.app.info('Migraciones aplicadas', { versiones: applied });

  const backup = createBackup(db, paths.backups, { label: 'arranque' });
  bus.emit('backup.created', { path: backup, label: 'arranque' });
  log.app.info('Arranque del núcleo', { version });
  bus.emit('app.started', { version });

  return {
    bus,
    db,
    log,
    paths,
    close() {
      bus.emit('app.quitting', {});
      log.app.info('Cierre del núcleo');
      db.close();
    }
  };
}
