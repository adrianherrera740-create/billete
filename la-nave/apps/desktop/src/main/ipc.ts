import { ipcMain } from 'electron';
import { CHANNELS } from '@nave/shared';
import type { ChannelName } from '@nave/shared';
import { run } from './handlers';
import type { Handler, Handlers, IpcLike } from './handlers';

export { handlersFor, run } from './handlers';
export type { Handler, Handlers, IpcLike, Services } from './handlers';

/**
 * Registro ÚNICO de IPC: toda la comunicación renderer → main pasa por aquí.
 * Cada canal valida su entrada con el parser de @nave/shared antes de ejecutar el manejador.
 */
export function registerIpc(
  handlers: Handlers,
  onError: (error: unknown) => void,
  ipc: IpcLike = ipcMain,
  isTrusted: (event: unknown) => boolean = () => true
): void {
  for (const channel of Object.keys(CHANNELS) as ChannelName[]) {
    ipc.handle(channel, async (event, raw) => {
      if (!isTrusted(event)) return { ok: false, error: { code: 'FORBIDDEN', message: 'Esta petición no viene de la ventana de La Nave.' } };
      return await run(channel, handlers[channel] as Handler<typeof channel>, raw, onError);
    });
  }
}
