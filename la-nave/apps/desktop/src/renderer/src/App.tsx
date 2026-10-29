import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BoardView } from './components/BoardView';
import { CommandCenter } from './components/CommandCenter';
import { CommandPalette } from './components/CommandPalette';
import { GlassButton } from './components/GlassButton';
import { GlobalSearch } from './components/GlobalSearch';
import { NewProjectDialog } from './components/NewProjectDialog';
import { SettingsDialog } from './components/SettingsDialog';
import { Sidebar } from './components/Sidebar';
import { SidePanel } from './components/SidePanel';
import { registerDefaultCommands } from './defaultCommands';
import i18n from './i18n';
import { matchShortcut } from './shortcuts';
import { useNave } from './store';

/** Aplica el tema (oscuro, claro o el del sistema) al documento. */
function useTheme(): void {
  const theme = useNave((s) => s.settings.theme);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = (): void => {
      document.documentElement.dataset['theme'] = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme;
    };
    apply();
    if (theme !== 'system') return;
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);
}

/** Atajos fijos (ver shortcuts.ts). Se escuchan en captura para que ni xterm ni los campos de texto se los queden. */
function useShortcuts(): void {
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      const id = matchShortcut(e);
      if (!id) return;
      e.preventDefault();
      e.stopPropagation();
      const s = useNave.getState();
      const count = (s.board?.panels.length ?? 0) + 1;
      if (id === 'search') s.setDialog('search');
      else if (id === 'palette') s.setDialog('palette');
      else if (id === 'terminal') void s.addPanel('terminal', i18n.t('terminal.title', { n: count }));
      else if (id === 'agent') void s.addPanel('claude', i18n.t('claude.title', { n: count }));
      else {
        s.openBrainTab();
        setTimeout(() => document.querySelector<HTMLInputElement>('[data-testid="brain-search"]')?.focus(), 50);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, []);
}

export function App() {
  const { t } = useTranslation();
  const load = useNave((s) => s.load);
  const error = useNave((s) => s.error);
  const clearError = useNave((s) => s.clearError);
  const ready = useNave((s) => s.ready);
  const sideOpen = useNave((s) => s.sideOpen);
  const info = useNave((s) => s.info);
  const clearInfo = useNave((s) => s.clearInfo);
  const view = useNave((s) => s.view);
  const dialog = useNave((s) => s.dialog);
  const setDialog = useNave((s) => s.setDialog);

  useTheme();
  useShortcuts();

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => window.nave.onClaude((event) => useNave.getState().applyClaude(event)), []);
  useEffect(() => registerDefaultCommands(), []);

  return (
    <div className={`app ${sideOpen && view === 'board' ? 'with-side' : ''}`} data-testid="app" data-ready={ready}>
      <Sidebar />
      {view === 'center' ? <CommandCenter /> : <BoardView />}
      {sideOpen && view === 'board' && <SidePanel />}
      {dialog === 'search' && <GlobalSearch />}
      {dialog === 'palette' && <CommandPalette />}
      {dialog === 'settings' && <SettingsDialog />}
      {dialog === 'new-project' && <NewProjectDialog onClose={() => setDialog(null)} />}
      {info && !error && (
        <div className="toast info glass" role="status" data-testid="info-toast">
          <span>{info}</span>
          <GlassButton variant="ghost" onClick={clearInfo}>
            {t('common.close')}
          </GlassButton>
        </div>
      )}
      {error && (
        <div className="toast glass" role="alert" data-testid="error-toast">
          <span>{error}</span>
          <GlassButton variant="ghost" onClick={clearError}>
            {t('common.close')}
          </GlassButton>
        </div>
      )}
    </div>
  );
}
