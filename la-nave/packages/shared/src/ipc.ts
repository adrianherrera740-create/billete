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
  pattern,
  str
} from './parse';
import type { Parser } from './parse';
import { parseSettingsPatch } from './settings';
import { BRAIN_KINDS, PANEL_KINDS, PANEL_MIN_H, PANEL_MIN_W, TASK_STATUSES, ZOOM_MAX, ZOOM_MIN } from './domain';
import type { BackupInfo, DataChange, MobileDevice, MobileStatus, PairingInfo, ProjectSummary, SearchResult, Settings, BrainContext, BrainDetail, BrainHit, BrainNode, Board, ClaudeEvent, ClaudeStatus, HistoryEntry, Note, Panel, Project, ShellOption, Task, TerminalEvent, TerminalStarted } from './domain';

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
  'claude:history': { remote: 'forbidden', input: object({ panelId: id }) },
  // Enviar texto a Claude solo lo PEGA (bracketed paste, sin Intro) y solo en paneles de Claude.
  'claude:paste': { remote: 'forbidden', input: object({ panelId: id, text: str({ min: 1, max: 20_000 }) }) },
  'task:list': { remote: 'allowed', input: object({ projectId: id }) },
  'task:create': { remote: 'allowed', input: object({ projectId: id, title: str({ min: 1, max: 200, trim: true }) }) },
  'task:update': {
    remote: 'allowed',
    input: objectWith(
      { id },
      { title: str({ min: 1, max: 200, trim: true }), status: oneOf(TASK_STATUSES), position: num({ min: 0, max: 1e9 }) }
    )
  },
  'task:delete': { remote: 'forbidden', input: object({ id }) },
  // projectId null = la bandeja de entrada (notas sin proyecto).
  'note:list': { remote: 'allowed', input: object({ projectId: nullable(id) }) },
  'note:create': {
    remote: 'allowed',
    input: objectWith({ projectId: nullable(id) }, { title: str({ max: 120, trim: true }), body: str({ max: 20_000 }) })
  },
  'note:update': {
    remote: 'allowed',
    input: objectWith({ id }, { title: str({ max: 120, trim: true }), body: str({ max: 20_000 }), projectId: nullable(id) })
  },
  'note:delete': { remote: 'forbidden', input: object({ id }) },
  // Brain: el renderer NO puede fijar `source` ni `confidence: verified` de lo que genera Claude; eso lo decide main.
  'brain:list': { remote: 'forbidden', input: object({ projectId: id }) },
  'brain:get': { remote: 'forbidden', input: object({ id }) },
  'brain:create': {
    remote: 'forbidden',
    input: objectWith({ projectId: id, title: str({ min: 1, max: 160, trim: true }) }, { body: str({ max: 50_000 }), kind: oneOf(BRAIN_KINDS) })
  },
  'brain:update': {
    remote: 'forbidden',
    input: objectWith({ id }, { title: str({ min: 1, max: 160, trim: true }), body: str({ max: 50_000 }), kind: oneOf(BRAIN_KINDS) })
  },
  'brain:review': { remote: 'forbidden', input: object({ id, action: oneOf(['accept', 'reject', 'restore'] as const) }) },
  'brain:delete': { remote: 'forbidden', input: object({ id }) },
  'brain:search': {
    remote: 'forbidden',
    input: objectWith({ projectId: id, query: str({ max: 300 }) }, { includeDeprecated: bool })
  },
  'brain:context': { remote: 'forbidden', input: object({ projectId: id, query: str({ max: 300 }) }) },
  'settings:get': { remote: 'forbidden', input: nothing },
  'settings:update': { remote: 'forbidden', input: parseSettingsPatch },
  'overview:summary': { remote: 'allowed', input: nothing },
  // Búsqueda global (Ctrl+K): la hace la persona de forma explícita y cruza proyectos; el contexto para la IA nunca.
  'search:global': { remote: 'forbidden', input: object({ query: str({ min: 1, max: 200, trim: true }) }) },
  // Copias de seguridad: se identifican por NOMBRE (nunca por ruta); main solo busca dentro de su carpeta de copias.
  'backup:list': { remote: 'forbidden', input: nothing },
  'backup:create': { remote: 'forbidden', input: nothing },
  // Gestión del acceso móvil: SOLO desde el PC (un móvil no puede emparejar a otro ni activar nada).
  'mobile:status': { remote: 'forbidden', input: nothing },
  'mobile:set-enabled': { remote: 'forbidden', input: object({ enabled: bool }) },
  'mobile:pair-start': { remote: 'forbidden', input: nothing },
  'mobile:devices': { remote: 'forbidden', input: nothing },
  'mobile:revoke': { remote: 'forbidden', input: object({ id }) },
  'mobile:publish': { remote: 'forbidden', input: nothing },
  'backup:restore': { remote: 'forbidden', input: object({ name: pattern(/^nave-\d{8}-\d{6}-[a-z0-9-]{1,40}\.db$/i, 'no es el nombre de una copia de seguridad') }) }
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
  'claude:paste': null;
  'task:list': Task[];
  'task:create': Task;
  'task:update': Task;
  'task:delete': null;
  'note:list': Note[];
  'note:create': Note;
  'note:update': Note;
  'note:delete': null;
  'brain:list': BrainNode[];
  'brain:get': BrainDetail;
  'brain:create': BrainNode;
  'brain:update': BrainNode;
  'brain:review': BrainNode;
  'brain:delete': null;
  'brain:search': BrainHit[];
  'brain:context': BrainContext;
  'settings:get': Settings;
  'settings:update': Settings;
  'overview:summary': ProjectSummary[];
  'search:global': SearchResult[];
  'backup:list': BackupInfo[];
  'backup:create': BackupInfo;
  'backup:restore': null;
  'mobile:status': MobileStatus;
  'mobile:set-enabled': MobileStatus;
  'mobile:pair-start': PairingInfo;
  'mobile:devices': MobileDevice[];
  'mobile:revoke': null;
  'mobile:publish': { ok: boolean; output: string };
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

export type ChangeSubscribe = (handler: (change: DataChange) => void) => Unsubscribe;

export interface NaveApi {
  readonly platform: string;
  /** Algo cambió fuera de esta ventana (p. ej. una tarea creada desde el móvil). */
  onChanged: ChangeSubscribe;
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
  onClaude: ClaudeSubscribe = () => () => undefined,
  onChanged: ChangeSubscribe = () => () => undefined
): NaveApi {
  return {
    platform,
    onChanged,
    onTerminal,
    onClaude,
    invoke: async (channel, input) => (await transport(channel, input)) as Result<ChannelOutputs[typeof channel]>
  };
}

