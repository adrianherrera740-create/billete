import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { NaveApi, ProjectSummary } from '@nave/shared';
import { call, message } from '../remote';

export function Summary({ api, onOpenProject }: { api: NaveApi; onOpenProject(id: string): void }) {
  const { t } = useTranslation();
  const [data, setData] = useState<ProjectSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [idea, setIdea] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let current = true;
    call(api, 'overview:summary', undefined)
      .then((summary) => {
        if (!current) return;
        setData(summary);
        setError(null);
      })
      .catch((e: unknown) => current && setError(message(e)));
    return () => {
      current = false;
    };
  }, [api, tick]);

  // Se refresca solo cada 20 s mientras la pantalla está abierta.
  useEffect(() => {
    const timer = setInterval(() => setTick((n) => n + 1), 20_000);
    return () => clearInterval(timer);
  }, []);

  const capture = (e: FormEvent): void => {
    e.preventDefault();
    const body = idea.trim();
    if (!body) return;
    setSaved(false);
    call(api, 'note:create', { projectId: null, body })
      .then(() => {
        setIdea('');
        setSaved(true);
        setError(null);
      })
      .catch((err: unknown) => setError(message(err)));
  };

  return (
    <section>
      <form className="card" onSubmit={capture}>
        <h2>{t('summary.capture')}</h2>
        <textarea data-testid="capture-text" value={idea} maxLength={20000} placeholder={t('summary.capturePlaceholder')} aria-label={t('summary.capture')} onChange={(e) => { setIdea(e.target.value); setSaved(false); }} />
        <button type="submit" className="primary" data-testid="capture-save" disabled={idea.trim() === ''}>
          {t('summary.captureSave')}
        </button>
        {saved && <p className="ok" role="status" data-testid="capture-saved">{t('summary.captured')}</p>}
      </form>

      {error && <p className="error" role="alert" data-testid="error">{error}</p>}
      <div className="row">
        <h2>{t('summary.projects')}</h2>
        <button type="button" className="ghost" onClick={() => setTick((n) => n + 1)}>{t('common.refresh')}</button>
      </div>
      {data === null && !error && <p className="muted">{t('common.loading')}</p>}
      {data?.length === 0 && <p className="muted">{t('summary.empty')}</p>}
      <ul className="list">
        {data?.map((s) => (
          <li key={s.project.id}>
            <button type="button" className="card project" data-testid="project-card" style={{ '--accent': s.project.color } as React.CSSProperties} onClick={() => onOpenProject(s.project.id)}>
              <strong><span aria-hidden="true">{s.project.icon}</span> {s.project.name}</strong>
              <span data-testid="card-tasks">{t('summary.tasks', { count: s.openTasks, doing: s.doingTasks })}</span>
              <span>{t('summary.review', { count: s.pendingReview })}</span>
              <span className="muted">{s.claude.length === 0 ? t('summary.noClaude') : s.claude.map((c) => `${c.title}: ${t(`claude.state.${c.state}`)}`).join(' · ')}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
