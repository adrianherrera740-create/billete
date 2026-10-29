import { ipcMain } from 'electron';
import { CHANNELS, ValidationError } from '@nave/shared';
import type { ChannelInput, ChannelName, ChannelOutputs, Result } from '@nave/shared';
import { NaveError } from './projects';
import type { Projects } from './projects';

export type Handler<C extends ChannelName> = (input: ChannelInput<C>) => ChannelOutputs[C];
export type Handlers = { [C in ChannelName]: Handler<C> };

export interface IpcLike {
  handle(channel: string, listener: (event: unknown, input: unknown) => unknown): void;
}

/** Traduce cualquier excepción a un Result con mensaje en español; nunca filtra trazas ni rutas internas. */
export function run<C extends ChannelName>(channel: C, handler: Handler<C>, raw: unknown, onError: (error: unknown) => void): Result<ChannelOutputs[C]> {
  try {
    const input = CHANNELS[channel].input(raw) as ChannelInput<C>;
    return { ok: true, data: handler(input) };
  } catch (error) {
    if (error instanceof ValidationError) return { ok: false, error: { code: 'VALIDATION', message: `Datos no válidos (${error.message}).` } };
    if (error instanceof NaveError) return { ok: false, error: { code: error.code, message: error.message } };
    onError(error);
    return { ok: false, error: { code: 'INTERNAL', message: 'Algo ha fallado dentro de La Nave. Inténtalo de nuevo; si se repite, revisa el registro de la app.' } };
  }
}

export function handlersFor(projects: Projects): Handlers {
  return {
    'project:list': (i) => projects.list(i.includeArchived),
    'project:create': (i) => projects.create(i),
    'project:update': (i) => projects.update(i),
    'project:archive': (i) => projects.archive(i.id, i.archived),
    'board:get': (i) => projects.board(i.projectId),
    'board:set-camera': (i) => projects.setCamera(i),
    'panel:create': (i) => projects.createPanel(i),
    'panel:update': (i) => projects.updatePanel(i),
    'panel:delete': (i) => projects.deletePanel(i.id)
  };
}

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
    ipc.handle(channel, (event, raw) => {
      if (!isTrusted(event)) return { ok: false, error: { code: 'FORBIDDEN', message: 'Esta petición no viene de la ventana de La Nave.' } };
      return run(channel, handlers[channel] as Handler<typeof channel>, raw, onError);
    });
  }
}
