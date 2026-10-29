import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { codeFromHash, createMobileApi, deviceName, pair, tokenStore } from './api';
import { Notes } from './screens/Notes';
import { Summary } from './screens/Summary';
import { Tasks } from './screens/Tasks';

type Gate = 'pairing' | 'unpaired' | 'revoked' | 'ready';
type Tab = 'summary' | 'tasks' | 'notes';

function initialGate(): Gate {
  if (codeFromHash(window.location.hash)) return 'pairing';
  return tokenStore.get() ? 'ready' : 'unpaired';
}

export function App() {
  const { t } = useTranslation();
  const [gate, setGate] = useState<Gate>(initialGate);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('summary');
  const [projectId, setProjectId] = useState<string | null>(null);
  const api = useMemo(() => createMobileApi({ onUnauthorized: () => setGate('revoked'), offlineMessage: t('common.offline') }), [t]);

  // Canjea el código del QR (viaja en el fragmento) por el token de este móvil y limpia la dirección.
  useEffect(() => {
    if (gate !== 'pairing') return;
    const code = codeFromHash(window.location.hash);
    if (!code) return;
    let current = true;
    void pair(code, deviceName(), t('gate.pairFailed')).then((outcome) => {
      if (!current) return;
      window.history.replaceState(null, '', window.location.pathname);
      if (outcome.ok) setGate('ready');
      else {
        setError(outcome.message);
        setGate('unpaired');
      }
    });
    return () => {
      current = false;
    };
  }, [gate, t]);

  if (gate === 'pairing') return <main className="gate"><p data-testid="gate-pairing">{t('gate.pairing')}</p></main>;
  if (gate === 'unpaired' || gate === 'revoked') {
    return (
      <main className="gate" data-testid={`gate-${gate}`}>
        <img src="/icon-192.png" alt="" width="72" height="72" />
        <h1>{gate === 'revoked' ? t('gate.revokedTitle') : t('gate.unpairedTitle')}</h1>
        <p>{gate === 'revoked' ? t('gate.revokedBody') : t('gate.unpairedBody')}</p>
        {error && <p className="error" role="alert">{error}</p>}
      </main>
    );
  }

  const openProject = (id: string): void => {
    setProjectId(id);
    setTab('tasks');
  };

  return (
    <div className="shell" data-testid="mobile-app">
      <header className="top">
        <img src="/icon-192.png" alt="" width="28" height="28" />
        <h1>{t('app.name')}</h1>
      </header>
      <main className="content">
        {tab === 'summary' && <Summary api={api} onOpenProject={openProject} />}
        {tab === 'tasks' && <Tasks api={api} projectId={projectId} onProject={setProjectId} />}
        {tab === 'notes' && <Notes api={api} projectId={projectId} onProject={setProjectId} />}
      </main>
      <nav className="tabs" aria-label="Secciones">
        {(['summary', 'tasks', 'notes'] as const).map((id) => (
          <button key={id} type="button" className={tab === id ? 'on' : ''} aria-current={tab === id ? 'page' : undefined} data-testid={`tab-${id}`} onClick={() => setTab(id)}>
            {t(`nav.${id}`)}
          </button>
        ))}
      </nav>
    </div>
  );
}
