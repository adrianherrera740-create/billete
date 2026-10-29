import { CHANNELS, ValidationError } from '@nave/shared';
import type { ChannelInput, ChannelName, ChannelOutputs, Result } from '@nave/shared';
import { NaveError } from './projects';
import type { Projects } from './projects';
import type { Backups } from './backups';
import type { Brain } from './brain';
import type { ClaudeService } from './claude';
import type { Overview, GlobalSearch } from './shell';
import type { SettingsStore } from './settings';
import type { MobileService } from './mobile/service';
import type { Tasks } from './tasks';
import type { TerminalManager } from './terminals';

export type Handler<C extends ChannelName> = (input: ChannelInput<C>) => ChannelOutputs[C] | Promise<ChannelOutputs[C]>;
export type Handlers = { [C in ChannelName]: Handler<C> };

export interface IpcLike {
  handle(channel: string, listener: (event: unknown, input: unknown) => unknown): void;
}

/** Traduce cualquier excepción a un Result con mensaje en español; nunca filtra trazas ni rutas internas. */
export async function run<C extends ChannelName>(channel: C, handler: Handler<C>, raw: unknown, onError: (error: unknown) => void): Promise<Result<ChannelOutputs[C]>> {
  try {
    const input = CHANNELS[channel].input(raw) as ChannelInput<C>;
    return { ok: true, data: await handler(input) };
  } catch (error) {
    if (error instanceof ValidationError) return { ok: false, error: { code: 'VALIDATION', message: `Datos no válidos (${error.message}).` } };
    if (error instanceof NaveError) return { ok: false, error: { code: error.code, message: error.message } };
    onError(error);
    return { ok: false, error: { code: 'INTERNAL', message: 'Algo ha fallado dentro de La Nave. Inténtalo de nuevo; si se repite, revisa el registro de la app.' } };
  }
}

export interface Services {
  projects: Projects;
  terminals: TerminalManager;
  claude: ClaudeService;
  tasks: Tasks;
  brain: Brain;
  settings: SettingsStore;
  overview: Overview;
  search: GlobalSearch;
  backups: Backups;
  mobile: MobileService;
}

export function handlersFor({ projects, terminals, claude, tasks, brain, settings, overview, search, backups, mobile }: Services): Handlers {
  return {
    'project:list': (i) => projects.list(i.includeArchived),
    'project:create': (i) => projects.create(i),
    'project:update': (i) => projects.update(i),
    'project:archive': (i) => projects.archive(i.id, i.archived),
    'board:get': (i) => projects.board(i.projectId),
    'board:set-camera': (i) => projects.setCamera(i),
    'panel:create': (i) => projects.createPanel(i),
    'panel:update': (i) => projects.updatePanel(i),
    'panel:delete': (i) => projects.deletePanel(i.id),
    'terminal:shells': () => terminals.shellOptions(),
    'terminal:start': (i) => terminals.start(i.panelId, i.cols, i.rows),
    'terminal:input': (i) => terminals.input(i.panelId, i.data),
    'terminal:resize': (i) => terminals.resize(i.panelId, i.cols, i.rows),
    'terminal:kill': (i) => terminals.kill(i.panelId),
    'claude:status': (i) => claude.status(i.panelId, terminals.isRunning(i.panelId)),
    'claude:resume': (i) => {
      if (terminals.isRunning(i.panelId)) throw new NaveError('VALIDATION', 'La sesión ya está en marcha. Cierra el panel si quieres empezar otra.');
      return terminals.start(i.panelId, i.cols, i.rows, true);
    },
    'claude:history': (i) => claude.history(i.panelId),
    'claude:paste': (i) => terminals.paste(i.panelId, i.text),
    'task:list': (i) => tasks.listTasks(i.projectId),
    'task:create': (i) => tasks.createTask(i),
    'task:update': (i) => tasks.updateTask(i),
    'task:delete': (i) => tasks.deleteTask(i.id),
    'note:list': (i) => tasks.listNotes(i.projectId),
    'note:create': (i) => tasks.createNote(i),
    'note:update': (i) => tasks.updateNote(i),
    'note:delete': (i) => tasks.deleteNote(i.id),
    'brain:list': (i) => brain.list(i.projectId),
    'brain:get': (i) => brain.get(i.id),
    'brain:create': (i) => brain.create(i),
    'brain:update': (i) => brain.update(i),
    'brain:review': (i) => brain.review(i.id, i.action),
    'brain:delete': (i) => brain.delete(i.id),
    'brain:search': (i) => brain.search(i.projectId, i.query, i.includeDeprecated ?? false),
    'brain:context': (i) => brain.context(i.projectId, i.query),
    'settings:get': () => settings.get(),
    'settings:update': (i) => settings.update(i),
    'overview:summary': () => overview.summary(),
    'search:global': (i) => search.search(i.query),
    'backup:list': () => backups.list(),
    'backup:create': () => backups.create(),
    'backup:restore': (i) => backups.restore(i.name),
    'mobile:status': () => mobile.status(),
    'mobile:set-enabled': (i) => mobile.setEnabled(i.enabled),
    'mobile:pair-start': () => mobile.startPairing(),
    'mobile:devices': () => mobile.listDevices(),
    'mobile:revoke': (i) => mobile.revoke(i.id),
    'mobile:publish': () => mobile.publish()
  };
}

