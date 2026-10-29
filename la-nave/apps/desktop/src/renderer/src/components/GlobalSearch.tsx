import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SearchResult } from '@nave/shared';
import { useNave } from '../store';
import { Dialog } from './Dialog';

/** Ctrl+K: busca en proyectos, tareas, notas y Brain de todos los proyectos. */
export function GlobalSearch() {
  const { t } = useTranslation();
  const setDialog = useNave((s) => s.setDialog);
  const goTo = useNave((s) => s.goTo);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [index, setIndex] = useState(0);
  const text = query.trim();

  useEffect(() => {
    if (!text) return;
    let current = true;
    const timer = setTimeout(() => {
      void window.nave.invoke('search:global', { query: text }).then((res) => {
        if (!current || !res.ok) return;
        setResults(res.data);
        setIndex(0);
      });
    }, 150);
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [text]);

  const shown = text ? results : [];
  const open = (r: SearchResult | undefined): void => {
    if (r) void goTo(r);
  };

  return (
    <Dialog title={t('search.title')} onClose={() => setDialog(null)}>
      <input
        className="palette-input"
        data-testid="global-search-input"
        autoFocus
        value={query}
        placeholder={t('search.placeholder')}
        aria-label={t('search.placeholder')}
        maxLength={200}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') setIndex((i) => Math.min(i + 1, Math.max(shown.length - 1, 0)));
          else if (e.key === 'ArrowUp') setIndex((i) => Math.max(i - 1, 0));
          else if (e.key === 'Enter') open(shown[index]);
        }}
      />
      <ul className="palette-list" data-testid="global-search-results">
        {shown.map((r, i) => (
          <li key={`${r.kind}-${r.id}`}>
            <button type="button" className={`palette-item ${i === index ? 'on' : ''}`} data-testid="global-search-item" onClick={() => open(r)}>
              <span className="badge">{t(`search.kind.${r.kind}`)}</span>
              <span className="palette-title">{r.title}</span>
              {r.snippet && <span className="snippet">{r.snippet}</span>}
            </button>
          </li>
        ))}
      </ul>
      {text !== '' && shown.length === 0 && <p className="muted">{t('search.empty')}</p>}
    </Dialog>
  );
}
