/** Contratos compartidos entre main, preload y renderer. En F0 solo la identidad de la app. */
export const APP_NAME = 'La Nave';
export const APP_ID = 'nave';

/** Superficie que el preload expone en `window.nave`. Los canales IPC se añaden aquí (una sola definición). */
export interface NaveApi {
  readonly platform: string;
}

/** Eventos del bus. Nombre `proyecto.accion`; un evento nuevo es una entrada nueva aquí. */
export interface EventMap {
  'app.started': { version: string };
  'app.quitting': Record<string, never>;
  'settings.changed': { key: string };
  'backup.created': { path: string; label: string };
  'db.recovered': { mode: 'backup' | 'fresh'; quarantined: string | null };
}
export type EventName = keyof EventMap;
export type EventNamesAreDotted = EventName extends `${string}.${string}` ? true : never;
export const EVENT_NAMES_ARE_DOTTED: EventNamesAreDotted = true;
