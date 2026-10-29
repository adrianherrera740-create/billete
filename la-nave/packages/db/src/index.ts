export { MIGRATIONS, checksum, migrate } from './migrations';
export type { Migration } from './migrations';
export {
  applyPendingRestore,
  createBackup,
  isHealthy,
  listBackups,
  openDatabase,
  openWithRecovery,
  requestRestore,
  verifyBackup
} from './database';
export type { OpenResult, RestoreOutcome } from './database';
export { FTS_ROWID_OFFSET, buildFtsQuery } from './fts';
export type { FtsQueryOptions } from './fts';
