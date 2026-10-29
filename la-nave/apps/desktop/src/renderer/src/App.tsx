import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BoardView } from './components/BoardView';
import { GlassButton } from './components/GlassButton';
import { Sidebar } from './components/Sidebar';
import { SidePanel } from './components/SidePanel';
import { useNave } from './store';

export function App() {
  const { t } = useTranslation();
  const load = useNave((s) => s.load);
  const error = useNave((s) => s.error);
  const clearError = useNave((s) => s.clearError);
  const ready = useNave((s) => s.ready);
  const sideOpen = useNave((s) => s.sideOpen);
  const info = useNave((s) => s.info);
  const clearInfo = useNave((s) => s.clearInfo);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => window.nave.onClaude((event) => useNave.getState().applyClaude(event)), []);

  return (
    <div className={`app ${sideOpen ? 'with-side' : ''}`} data-testid="app" data-ready={ready}>
      <Sidebar />
      <BoardView />
      {sideOpen && <SidePanel />}
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
