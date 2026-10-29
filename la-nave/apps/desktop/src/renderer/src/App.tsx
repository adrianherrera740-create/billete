import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BoardView } from './components/BoardView';
import { GlassButton } from './components/GlassButton';
import { Sidebar } from './components/Sidebar';
import { useNave } from './store';

export function App() {
  const { t } = useTranslation();
  const load = useNave((s) => s.load);
  const error = useNave((s) => s.error);
  const clearError = useNave((s) => s.clearError);
  const ready = useNave((s) => s.ready);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => window.nave.onClaude((event) => useNave.getState().applyClaude(event)), []);

  return (
    <div className="app" data-testid="app" data-ready={ready}>
      <Sidebar />
      <BoardView />
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
