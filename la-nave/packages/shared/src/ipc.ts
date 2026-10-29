import {
  absolutePath,
  bool,
  hexColor,
  jsonObject,
  nothing,
  nullable,
  num,
  object,
  objectWith,
  oneOf,
  str
} from './parse';
import type { Parser } from './parse';
import { PANEL_KINDS, PANEL_MIN_H, PANEL_MIN_W, ZOOM_MAX, ZOOM_MIN } from './domain';
import type { Board, ClaudeEvent, ClaudeStatus, HistoryEntry, Panel, Project, ShellOption, TerminalEvent, TerminalStarted } from './domain';

export type Remote = 'allowed' | 'forbidden';

const id = str({ min: 1, max: 64 });
const geometry = {
  x: num({ min: -100_000, max: 100_000 }),
  y: num({ min: -100_000, max: 100_000 }),
  w: num({ min: PANEL_MIN_W, max: 4000 }),
  h: num({ min: PANEL_MIN_H, max: 4000 })
};

const projectName = str({ min: 1, max: 80, trim: true });
const projectIcon = str({ min: 1, max: 8, trim: true });

/**
 * Definición ÚNICA de los canales IPC. Cada canal declara su parser y si puede usarse desde el móvil.
 * Un canal nuevo sin `remote` no compila; el test de seguridad exige además que la lista permitida se revise a mano.
 */
export const CHANNELS = {
  'project:list': { remote: 'allowed', input: object({ includeArchived: bool }) },
  'project:create': {
    remote: 'forbidden',
    input: objectWith({ name: projectName }, { icon: projectIcon, color: hexColor, rootPath: nullable(absolutePath) })
  },
  'project:update': {
    remote: 'forbidden',
    input: objectWith({ id }, { name: projectName, icon: projectIcon, color: hexColor, rootPath: nullable(absolutePath) })
  },
  'project:archive': { remote: 'forbidden', input: object({ id, archived: bool }) },
  'board:get': { remote: 'allowed', input: object({ projectId: id }) },
  'board:set-camera': {
    remote: 'forbidden',
    input: object({
      projectId: id,
      x: num({ min: -1_000_000, max: 1_000_000 }),
      y: num({ min: -1_000_000, max: 1_000_000 }),
      zoom: num({ min: ZOOM_MIN, max: ZOOM_MAX })
    })
  },
  'panel:create': {
    remote: 'forbidden',
    input: objectWith({ projectId: id, kind: oneOf(PANEL_KINDS), ...geometry }, { title: str({ min: 1, max: 80, trim: true }), config: jsonObject(20_000) })
  },
  'panel:update': {
    remote: 'forbidden',
    input: objectWith(
      { id },
      {
        title: str({ min: 1, max: 80, trim: true }),
        x: geometry.x,
        y: geometry.y,
        w: geometry.w,
        h: geometry.h,
        z: num({ min: 0, max: 1_000_000, int: true }),
        config: jsonObject(20_000)
      }
    )
  },
  'panel:delete': { remote: 'forbidden', input: object({ id }) },
  // Terminales: acceso a un shell real, por eso nunca desde el móvil. El renderer solo envía el id del panel;
  // el shell y la carpeta salen de la base de datos.
  'terminal:shells': { remote: 'forbidden', input: nothing },
  'terminal:start': {
    remote: 'forbidden',
    input: object({ panelId: id, cols: num({ min: 20, max: 500, int: true }), rows: num({ min: 5, max: 200, int: true }) })
  },
  'terminal:input': { remote: 'forbidden', input: object({ panelId: id, data: str({ min: 1, max: 65_536 }) }) },
  'terminal:resize': {
    remote: 'forbidden',
    input: object({ panelId: id, cols: num({ min: 20, max: 500, int: true }), rows: num({ min: 5, max: 200, int: true }) })
  },
  'terminal:kill': { remote: 'forbidden', input: object({ panelId: id }) },
  // Claude Code: se ejecuta el `claude` real; aquí solo se consulta su estado y se reanuda o lee el historial.
  'claude:status': { remote: 'forbidden', input: object({ panelId: id }) },
  'claude:resume': {
    remote: 'forbidden',
    input: object({ panelId: id, cols: num({ min: 20, max: 500, int: true }), rows: num({ min: 5, max: 200, int: true }) })
  },
  'claude:history': { remote: 'forbidden', input: object({ panelId: id }) }
} as const satisfies Record<string, { remote: Remote; input: Parser<unknown> }>;

export type ChannelName = keyof typeof CHANNELS;
export type ChannelInput<C extends ChannelName> = ReturnType<(typeof CHANNELS)[C]['input']>;

export interface ChannelOutputs {
  'project:list': Project[];
  'project:create': Project;
  'project:update': Project;
  'project:archive': Project;
  'board:get': Board;
  'board:set-camera': null;
  'panel:create': Panel;
  'panel:update': Panel;
  'panel:delete': null;
  'terminal:shells': ShellOption[];
  'terminal:start': TerminalStarted;
  'terminal:input': null;
  'terminal:resize': null;
  'terminal:kill': null;
  'claude:status': ClaudeStatus;
  'claude:resume': TerminalStarted;
  'claude:history': HistoryEntry[];
}

export type ErrorCode = 'VALIDATION' | 'NOT_FOUND' | 'FORBIDDEN' | 'INTERNAL';
export type Result<T> = { ok: true; data: T } | { ok: false; error: { code: ErrorCode; message: string } };

/** Canales que el móvil NO puede usar (gestión solo desde el PC). */
export const REMOTE_FORBIDDEN: ChannelName[] = (Object.keys(CHANNELS) as ChannelName[]).filter(
  (name) => CHANNELS[name].remote === 'forbidden'
);
export const REMOTE_ALLOWED: ChannelName[] = (Object.keys(CHANNELS) as ChannelName[]).filter(
  (name) => CHANNELS[name].remote === 'allowed'
);

export type Transport = (channel: ChannelName, input: unknown) => Promise<Result<unknown>>;

export type Unsubscribe = () => void;
export type TerminalSubscribe = (handler: (event: TerminalEvent) => void) => Unsubscribe;

export type ClaudeSubscribe = (handler: (event: ClaudeEvent) => void) => Unsubscribe;

export interface NaveApi {
  readonly platform: string;
  /** Cambios de estado de las sesiones de Claude (main empuja). */
  onClaude: ClaudeSubscribe;
  invoke<C extends ChannelName>(channel: C, input: ChannelInput<C>): Promise<Result<ChannelOutputs[C]>>;
  /** Salida de las terminales (main empuja; no es un canal invoke). */
  onTerminal: TerminalSubscribe;
}

/** La misma API funciona por IPC (escritorio) o por red (móvil): solo cambia el transporte. */
export function createApi(
  platform: string,
  transport: Transport,
  onTerminal: TerminalSubscribe = () => () => undefined,
  onClaude: ClaudeSubscribe = () => () => undefined
): NaveApi {
  return {
    platform,
    onTerminal,
    onClaude,
    invoke: async (channel, input) => (await transport(channel, input)) as Result<ChannelOutputs[typeof channel]>
  };
}

