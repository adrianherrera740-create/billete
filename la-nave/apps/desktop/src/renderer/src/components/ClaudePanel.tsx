import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { HistoryEntry, Panel } from '@nave/shared';
import { useNave } from '../store';
import { GlassButton } from './GlassButton';
import { TerminalPanel } from './TerminalPanel';

type Phase = 'checking' | 'choose' | 'terminal';

/**
 * Panel de Claude Code: el `claude` real corre en una terminal; la barra muestra el estado que llega por hooks.
 * Si el panel ya tuvo una sesión NO se abre otra sola (perdería el id): se pregunta si se reanuda o se empieza de nuevo.
 */
export function ClaudePanel({ panel, readOnly }: { panel: Panel; readOnly: boolean }) {
  const { t } = useTranslation();
  const info = useNave((s) => s.claudeStates[panel.id]);
  const applyClaude = useNave((s) => s.applyClaude);
  const [phase, setPhase] = useState<Phase>('checking');
  const [mode, setMode] = useState<'new' | 'resume'>('new');
  const [run, setRun] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void window.nave.invoke('claude:status', { panelId: panel.id }).then((res) => {
      if (cancelled) return;
      if (!res.ok) {
        setError(res.error.message);
        setPhase('terminal');
        return;
      }
      const status = res.data;
      applyClaude({ type: 'claude-state', panelId: panel.id, state: status.state, sessionId: status.sessionId });
      // Hay sesión anterior y el proceso no está en marcha: que decida la persona.
      setPhase(status.available && !status.running && status.sessionId !== null ? 'choose' : 'terminal');
    });
    return () => {
      cancelled = true;
    };
  }, [panel.id, applyClaude]);

  const begin = (next: 'new' | 'resume'): void => {
    setHistory(null);
    setMode(next);
    setRun((n) => n + 1);
    setPhase('terminal');
  };

  const openHistory = async (): Promise<void> => {
    const res = await window.nave.invoke('claude:history', { panelId: panel.id });
    if (res.ok) {
      setHistory(res.data);
      setError(null);
    } else setError(res.error.message);
  };

  const state = info?.state ?? 'unknown';
  const canRestart = phase === 'terminal' && state === 'ended' && !readOnly;

  return (
    <div className="claude-wrap">
      <div className="claude-bar">
        <span className={`claude-state ${state}`} data-testid="claude-state">
          {t(`claude.state.${state}`)}
        </span>
        <span className="spacer" />
        {canRestart && (
          <>
            <GlassButton data-testid="claude-resume-btn" onClick={() => begin('resume')}>
              {t('claude.resume')}
            </GlassButton>
            <GlassButton data-testid="claude-fresh-btn" onClick={() => begin('new')}>
              {t('claude.fresh')}
            </GlassButton>
          </>
        )}
        <GlassButton data-testid="claude-history-btn" disabled={info?.sessionId == null} onClick={() => (history === null ? void openHistory() : setHistory(null))}>
          {history === null ? t('claude.history') : t('claude.hideHistory')}
        </GlassButton>
      </div>
      <div className="claude-body">
        {error && <p className="terminal-notice" role="status">{error}</p>}
        {phase === 'terminal' && <TerminalPanel key={`${mode}-${run}`} panel={panel} readOnly={readOnly} mode={mode} />}
        {phase === 'choose' && (
          <div className="claude-choose" data-testid="claude-choose">
            <p>{t('claude.choose')}</p>
            <div className="actions">
              <GlassButton variant="primary" data-testid="claude-resume-btn" onClick={() => begin('resume')}>
                {t('claude.resume')}
              </GlassButton>
              <GlassButton data-testid="claude-fresh-btn" onClick={() => begin('new')}>
                {t('claude.fresh')}
              </GlassButton>
            </div>
          </div>
        )}
        {history !== null && (
          <div className="claude-history" data-testid="claude-history">
            <h3>{t('claude.historyTitle')}</h3>
            {history.length === 0 && <p className="muted">{t('claude.historyEmpty')}</p>}
            {history.map((entry, i) => (
              <p key={i} className="msg">
                <span className="who">{entry.role === 'user' ? t('claude.you') : t('claude.claude')}</span>
                {entry.text}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
