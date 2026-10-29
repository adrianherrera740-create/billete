import { useTranslation } from 'react-i18next';

export function App(): React.JSX.Element {
  const { t } = useTranslation();
  return (
    <main className="shell">
      <h1 data-testid="app-name">{t('app.name')}</h1>
      <p>{t('app.tagline')}</p>
      <p data-testid="phase">{t('app.phase', { phase: 'F0' })}</p>
      <p data-testid="platform">{t('app.platform', { platform: window.nave.platform })}</p>
    </main>
  );
}
