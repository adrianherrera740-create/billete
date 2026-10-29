import { registerCommand } from './commands';
import i18n from './i18n';
import { useNave } from './store';

/** Comandos de la paleta que trae La Nave. Los módulos futuros registran los suyos con `registerCommand`. */
export function registerDefaultCommands(): () => void {
  const state = () => useNave.getState();
  const n = (): number => (state().board?.panels.length ?? 0) + 1;
  const commands = [
    { id: 'project:new', title: i18n.t('commands.newProject'), keywords: 'crear proyecto', run: () => state().setDialog('new-project') },
    { id: 'panel:terminal', title: i18n.t('commands.addTerminal'), keywords: 'shell consola powershell', run: () => state().addPanel('terminal', i18n.t('terminal.title', { n: n() })) },
    { id: 'panel:claude', title: i18n.t('commands.addClaude'), keywords: 'agente ia', run: () => state().addPanel('claude', i18n.t('claude.title', { n: n() })) },
    { id: 'panel:note', title: i18n.t('commands.addNote'), keywords: 'sticky pizarra', run: () => state().addPanel('sticky', i18n.t('board.noteTitle', { n: n() })) },
    { id: 'view:center', title: i18n.t('commands.center'), keywords: 'visión general proyectos resumen', run: () => state().setView('center') },
    { id: 'view:overview', title: i18n.t('commands.overview'), keywords: 'pizarra zoom', run: () => { state().setView('board'); state().toggleOverview(); } },
    { id: 'side:toggle', title: i18n.t('commands.toggleSide'), keywords: 'panel lateral', run: () => state().toggleSide() },
    { id: 'side:tasks', title: i18n.t('commands.tasks'), keywords: 'pendientes', run: () => { useNave.setState({ view: 'board', sideOpen: true, sideTab: 'tasks' }); } },
    { id: 'side:notes', title: i18n.t('commands.notes'), keywords: 'apuntes bandeja', run: () => { useNave.setState({ view: 'board', sideOpen: true, sideTab: 'notes' }); } },
    { id: 'side:brain', title: i18n.t('commands.brain'), keywords: 'conocimiento memoria', run: () => state().openBrainTab() },
    { id: 'search:global', title: i18n.t('commands.search'), keywords: 'buscar', run: () => state().setDialog('search') },
    { id: 'settings:open', title: i18n.t('commands.settings'), keywords: 'ajustes preferencias', run: () => state().setDialog('settings') },
    { id: 'theme:dark', title: i18n.t('commands.themeDark'), keywords: 'tema oscuro', run: () => state().updateSettings({ theme: 'dark' }) },
    { id: 'theme:light', title: i18n.t('commands.themeLight'), keywords: 'tema claro', run: () => state().updateSettings({ theme: 'light' }) },
    { id: 'theme:system', title: i18n.t('commands.themeSystem'), keywords: 'tema sistema automático', run: () => state().updateSettings({ theme: 'system' }) }
  ];
  const offs = commands.map((c) => registerCommand(c));
  return () => offs.forEach((off) => off());
}
