import { useTranslation } from 'react-i18next';
import { THEMES } from '@nave/shared';
import { useNave } from '../store';
import { Dialog } from './Dialog';
import { GlassButton } from './GlassButton';

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
      </div>
      <div className="actions">
        <GlassButton variant="primary" onClick={() => setDialog(null)}>
          {t('common.close')}
        </GlassButton>
      </div>
    </Dialog>
  );
}
