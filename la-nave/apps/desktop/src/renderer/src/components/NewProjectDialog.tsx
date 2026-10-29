import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from './Dialog';
import { GlassButton } from './GlassButton';
import { useNave } from '../store';

const COLORS = ['#4f8cff', '#8b5cf6', '#ec4899', '#f97316', '#22c55e', '#14b8a6'];

export function NewProjectDialog({ onClose }: { onClose(): void }) {
  const { t } = useTranslation();
  const createProject = useNave((s) => s.createProject);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🚀');
  const [color, setColor] = useState(COLORS[0] ?? '#4f8cff');
  const [rootPath, setRootPath] = useState('');

  const submit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    const path = rootPath.trim();
    await createProject({ name, icon, color, rootPath: path === '' ? null : path });
    onClose();
  };

  return (
    <Dialog title={t('project.new')} onClose={onClose}>
      <form onSubmit={(e) => void submit(e)} className="form">
        <label>
          {t('project.name')}
          <input data-testid="project-name-input" value={name} onChange={(e) => setName(e.target.value)} autoFocus maxLength={80} required />
        </label>
        <label>
          {t('project.icon')}
          <input value={icon} onChange={(e) => setIcon(e.target.value)} maxLength={8} required />
        </label>
        <fieldset>
          <legend>{t('project.color')}</legend>
          <div className="swatches">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`swatch ${c === color ? 'on' : ''}`}
                style={{ background: c }}
                aria-label={c}
                aria-pressed={c === color}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </fieldset>
        <label>
          {t('project.folder')}
          <input value={rootPath} onChange={(e) => setRootPath(e.target.value)} placeholder={t('project.folderHint')} />
        </label>
        <div className="actions">
          <GlassButton variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </GlassButton>
          <GlassButton variant="primary" type="submit" data-testid="create-project-btn">
            {t('project.create')}
          </GlassButton>
        </div>
      </form>
    </Dialog>
  );
}
