/** Contratos compartidos entre main, preload y renderer. En F0 solo la identidad de la app. */
export const APP_NAME = 'La Nave';
export const APP_ID = 'nave';

/** Eventos del bus. Nombre `proyecto.accion`; un evento nuevo es una entrada nueva aquí. */
export interface EventMap {
  'app.started': { version: string };
  'app.quitting': Record<string, never>;
  'settings.changed': { key: string };
  'backup.created': { path: string; label: string };
  'db.recovered': { mode: 'backup' | 'fresh'; quarantined: string | null };
  'project.created': { id: string };
  'project.updated': { id: string };
  'project.archived': { id: string; archived: boolean };
  'board.panel_added': { projectId: string; panelId: string };
  'board.panel_updated': { projectId: string; panelId: string };
  'board.panel_removed': { projectId: string; panelId: string };
  'terminal.process_started': { panelId: string; shell: string };
  'terminal.process_exited': { panelId: string; exitCode: number | null };
}
export type EventName = keyof EventMap;
export type EventNamesAreDotted = EventName extends `${string}.${string}` ? true : never;
export const EVENT_NAMES_ARE_DOTTED: EventNamesAreDotted = true;

export * from './parse';
export * from './domain';
export * from './ipc';
