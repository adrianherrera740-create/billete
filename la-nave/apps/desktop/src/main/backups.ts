import { existsSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import type { DatabaseSync } from 'node:sqlite';
import type { EventBus } from '@nave/core';
import { backupLabel, createBackup, listBackups, requestRestore } from '@nave/db';
import type { BackupInfo, EventMap } from '@nave/shared';
import { NaveError } from './projects';

function toInfo(file: string): BackupInfo {
  const name = basename(file);
  const m = /^nave-(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})-/.exec(name);
  const createdAt = m ? `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z` : statSync(file).mtime.toISOString();
  return { name, label: backupLabel(file) ?? 'desconocida', createdAt, sizeBytes: statSync(file).size };
}

/**
 * Copias de seguridad desde la interfaz. Se identifican por NOMBRE y solo se busca dentro de la carpeta de copias.
 * Restaurar NO toca la BD abierta: antes guarda una copia de seguridad (para poder deshacer), deja un marcador y
 * pide reiniciar; el marcador se aplica al arrancar, antes de abrir la BD.
 */
export class Backups {
  constructor(
    private readonly db: DatabaseSync,
    private readonly dbPath: string,
    private readonly dir: string,
    private readonly bus: EventBus<EventMap>,
    private readonly onRestoreRequested: () => void = () => undefined
  ) {}

  list(): BackupInfo[] {
    return listBackups(this.dir).map(toInfo);
  }

  create(): BackupInfo {
    const file = createBackup(this.db, this.dir, { label: 'manual', keep: 20 });
    this.bus.emit('backup.created', { path: file, label: 'manual' });
    return toInfo(file);
  }

  restore(name: string): null {
    const file = join(this.dir, name);
    if (basename(file) !== name || !existsSync(file)) throw new NaveError('NOT_FOUND', 'Esa copia de seguridad ya no existe. Actualiza la lista.');
    try {
      requestRestore(this.dbPath, file); // comprueba que la copia está sana ANTES de tocar nada
    } catch (error) {
      throw new NaveError('VALIDATION', error instanceof Error ? error.message : 'La copia no se puede restaurar.');
    }
    createBackup(this.db, this.dir, { label: 'antes-de-restaurar', keep: 5 });
    this.onRestoreRequested();
    return null;
  }
}
