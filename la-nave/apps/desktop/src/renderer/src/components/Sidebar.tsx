import { useTranslation } from 'react-i18next';
import { GlassButton } from './GlassButton';
import { useNave } from '../store';

export function Sidebar() {
  const { t } = useTranslation();
  const { projects, activeId, showArchived, select, archiveProject, setShowArchived, view, setView, setDialog } = useNave();

  return (
    <aside className="sidebar glass">
      <h1 className="brand">{t('app.name')}</h1>
      <GlassButton variant="primary" data-testid="new-project-btn" onClick={() => setDialog('new-project')}>
        {t('project.new')}
      </GlassButton>
      <GlassButton data-testid="center-btn" aria-pressed={view === 'center'} onClick={() => setView(view === 'center' ? 'board' : 'center')}>
        {t('center.open')}
      </GlassButton>
      <ul className="projects" aria-label={t('project.list')}>
        {projects.map((p) => (
          <li key={p.id} className={p.id === activeId ? 'active' : ''} style={{ '--accent': p.color } as React.CSSProperties}>
            <button type="button" className="project-item" data-testid="project-item" onClick={() => void select(p.id)} disabled={p.archivedAt !== null}>
              <span className="project-icon" aria-hidden="true">{p.icon}</span>
              <span className="project-name">{p.name}</span>
              {p.archivedAt !== null && <span className="tag">{t('project.archivedTag')}</span>}
            </button>
            <GlassButton
              variant="ghost"
              title={p.archivedAt === null ? t('project.archive') : t('project.restore')}
              aria-label={p.archivedAt === null ? t('project.archive') : t('project.restore')}
              onClick={() => void archiveProject(p.id, p.archivedAt === null)}
            >
              {p.archivedAt === null ? '🗄' : '↩'}
            </GlassButton>
          </li>
        ))}
      </ul>
      <GlassButton data-testid="settings-btn" onClick={() => setDialog('settings')}>
        {t('settings.open')}
      </GlassButton>
      <label className="check">
        <input type="checkbox" checked={showArchived} onChange={(e) => void setShowArchived(e.target.checked)} />
        {t('project.showArchived')}
      </label>
    </aside>
  );
}
