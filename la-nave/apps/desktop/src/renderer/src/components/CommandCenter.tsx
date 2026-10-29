import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNave } from '../store';

/** Visión de todos los proyectos a la vez: qué hay abierto, qué hay por revisar y qué hace cada Claude. */
export function CommandCenter() {
  const { t } = useTranslation();
  const summary = useNave((s) => s.summary);
  const loadSummary = useNave((s) => s.loadSummary);
  const goTo = useNave((s) => s.goTo);
  const claudeStates = useNave((s) => s.claudeStates);
  const changeTick = useNave((s) => s.changeTick);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary, claudeStates, changeTick]);

  const attention = summary.flatMap((s) => s.claude.filter((c) => c.state === 'waiting' || c.state === 'working').map((c) => ({ ...c, project: s.project })));

  return (
    <main className="center" data-testid="command-center">
      <h2>{t('center.title')}</h2>
      <section>
        <h3 className="brain-h">{t('center.attention')}</h3>
        {attention.length === 0 ? (
          <p className="muted" data-testid="center-calm">{t('center.calm')}</p>
        ) : (
          <ul className="side-list" data-testid="center-attention">
            {attention.map((a) => (
              <li key={a.panelId} className="task">
                <span className={`claude-state ${a.state}`}>{t(`claude.state.${a.state}`)}</span>
                <button type="button" className="link" onClick={() => void goTo({ kind: 'project', id: a.project.id, projectId: a.project.id })}>
                  {a.title} · {a.project.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <div className="cards">
        {summary.map((s) => (
          <button key={s.project.id} type="button" className="card glass" data-testid="center-card" style={{ '--accent': s.project.color } as React.CSSProperties} onClick={() => void goTo({ kind: 'project', id: s.project.id, projectId: s.project.id })}>
            <span className="card-title">
              <span aria-hidden="true">{s.project.icon}</span> {s.project.name}
            </span>
            <span data-testid="center-tasks">{t('center.tasks', { count: s.openTasks, doing: s.doingTasks })}</span>
            <span data-testid="center-review">{t('center.review', { count: s.pendingReview })}</span>
            <span className="muted">{s.claude.length === 0 ? t('center.noClaude') : s.claude.map((c) => `${c.title}: ${t(`claude.state.${c.state}`)}`).join(' · ')}</span>
          </button>
        ))}
      </div>
      {summary.length === 0 && <p className="muted">{t('center.empty')}</p>}
    </main>
  );
}
