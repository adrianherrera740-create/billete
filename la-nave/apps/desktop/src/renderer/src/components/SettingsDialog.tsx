import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { THEMES } from '@nave/shared';
import type { BackupInfo } from '@nave/shared';
import { useNave } from '../store';
import { Dialog } from './Dialog';
import { GlassButton } from './GlassButton';
import { MobileAccess } from './MobileAccess';

const kb = (bytes: number): string => `${Math.max(1, Math.round(bytes / 1024))} KB`;

function Backups() {
  const { t, i18n } = useTranslation();
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [pending, setPending] = useState<BackupInfo | null>(null);

  const [version, setVersion] = useState(0);
  const refresh = (): void => setVersion((v) => v + 1);

  useEffect(() => {
    let current = true;
    void window.nave.invoke('backup:list', undefined).then((res) => {
      if (current && res.ok) setBackups(res.data);
    });
    return () => {
      current = false;
    };
  }, [version]);

  const fail = (message: string): void => useNave.setState({ error: message });

  const create = async (): Promise<void> => {
    const res = await window.nave.invoke('backup:create', undefined);
    if (res.ok) {
      useNave.setState({ info: t('backup.created') });
      refresh();
    } else fail(res.error.message);
  };

  const restore = async (backup: BackupInfo): Promise<void> => {
    setPending(null);
    const res = await window.nave.invoke('backup:restore', { name: backup.name });
    if (res.ok) {
      useNave.setState({ info: t('backup.restoring') });
      refresh(); // ahora existe la copia «Antes de restaurar», con la que se puede deshacer
    } else fail(res.error.message);
  };

  const label = (name: string): string => (i18n.exists(`backup.labels.${name}`) ? t(`backup.labels.${name}`) : name);

  return (
    <section className="backups" data-testid="backups">
      <h3 className="brain-h">{t('backup.title')}</h3>
      <GlassButton data-testid="backup-create" onClick={() => void create()}>
        {t('backup.create')}
      </GlassButton>
      <ul className="side-list backup-list">
        {backups.map((b) => (
          <li key={b.name} className="task" data-testid="backup-item">
            <span className="task-title">
              {label(b.label)} · {new Date(b.createdAt).toLocaleString('es-ES')} · {kb(b.sizeBytes)}
            </span>
            <GlassButton variant="ghost" data-testid="backup-restore" onClick={() => setPending(b)}>
              {t('backup.restore')}
            </GlassButton>
          </li>
        ))}
      </ul>
      {backups.length === 0 && <p className="muted">{t('backup.empty')}</p>}
      {pending && (
        <Dialog title={t('backup.confirmTitle')} onClose={() => setPending(null)}>
          <p>{t('backup.confirmBody', { date: new Date(pending.createdAt).toLocaleString('es-ES') })}</p>
          <div className="actions">
            <GlassButton variant="ghost" onClick={() => setPending(null)}>
              {t('common.cancel')}
            </GlassButton>
            <GlassButton variant="danger" data-testid="backup-confirm" onClick={() => void restore(pending)}>
              {t('backup.restore')}
            </GlassButton>
          </div>
        </Dialog>
      )}
    </section>
  );
}

export function SettingsDialog() {
  const { t } = useTranslation();
  const settings = useNave((s) => s.settings);
  const updateSettings = useNave((s) => s.updateSettings);
  const setDialog = useNave((s) => s.setDialog);
  return (
    <Dialog title={t('settings.title')} onClose={() => setDialog(null)}>
      <div className="form">
        <label>
          {t('settings.theme')}
          <select data-testid="theme-select" value={settings.theme} onChange={(e) => void updateSettings({ theme: e.target.value as (typeof THEMES)[number] })}>
            {THEMES.map((theme) => (
              <option key={theme} value={theme}>
                {t(`settings.themes.${theme}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="check">
          <input type="checkbox" data-testid="notifications-check" checked={settings.notifications} onChange={(e) => void updateSettings({ notifications: e.target.checked })} />
          {t('settings.notifications')}
        </label>
        <p className="muted">{t('settings.notificationsHint')}</p>
        <MobileAccess />
        <Backups />
      </div>
      <div className="actions">
        <GlassButton variant="primary" onClick={() => setDialog(null)}>
          {t('common.close')}
        </GlassButton>
      </div>
    </Dialog>
  );
}
