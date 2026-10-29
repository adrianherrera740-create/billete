import { join } from 'node:path';
import type { DatabaseSync } from 'node:sqlite';
import { EventBus, createFileSink, createLogger, redactDeep } from '@nave/core';
import type { LogChannel, Logger } from '@nave/core';
import { createBackup, migrate, openWithRecovery } from '@nave/db';
import type { EventMap, EventName } from '@nave/shared';
import { Projects } from './projects';
import { Tasks } from './tasks';

export interface NaveCore {
  bus: EventBus<EventMap>;
  db: DatabaseSync;
  projects: Projects;
  tasks: Tasks;
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

  const projects = new Projects(db, bus);
  const tasks = new Tasks(db, bus);
  recordActivity(db, bus);

  const backup = createBackup(db, paths.backups, { label: 'arranque' });
  bus.emit('backup.created', { path: backup, label: 'arranque' });
  log.app.info('Arranque del núcleo', { version });
  bus.emit('app.started', { version });

  return {
    bus,
    db,
    projects,
    tasks,
    log,
    paths,
    close() {
      bus.emit('app.quitting', {});
      log.app.info('Cierre del núcleo');
      db.close();
    }
  };
}

const ACTIVITY_EVENTS: EventName[] = [
  'project.created',
  'project.updated',
  'project.archived',
  'board.panel_added',
  'board.panel_updated',
  'board.panel_removed',
  'task.created',
  'task.updated',
  'task.deleted',
  'note.created',
  'note.updated',
  'note.deleted'
];

/** Activity: cada evento de proyecto queda registrado, siempre redactado. Nunca la salida de terminales. */
function recordActivity(db: DatabaseSync, bus: EventBus<EventMap>): void {
  const insert = db.prepare('INSERT INTO activity (ts, project_id, type, payload) VALUES (?, ?, ?, ?)');
  for (const name of ACTIVITY_EVENTS) {
    bus.on(name, (payload) => {
      const data = payload as { id?: string; projectId?: string };
      insert.run(new Date().toISOString(), data.projectId ?? data.id ?? null, name, JSON.stringify(redactDeep(payload)));
    });
  }
}
