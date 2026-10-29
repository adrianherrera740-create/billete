/** Contratos compartidos entre main, preload y renderer. En F0 solo la identidad de la app. */
export const APP_NAME = 'La Nave';
export const APP_ID = 'nave';

/** Superficie que el preload expone en `window.nave`. Los canales IPC se añaden aquí (una sola definición). */
export interface NaveApi {
  readonly platform: string;
}
