import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { filterCommands, listCommands } from '../commands';
import { useNave } from '../store';
import { Dialog } from './Dialog';

/** Ctrl+Shift+P: paleta de comandos. Lista lo que cualquier módulo haya registrado. */
export function CommandPalette() {
  const { t } = useTranslation();
  const setDialog = useNave((s) => s.setDialog);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const commands = filterCommands(listCommands(), query);

  const run = (i: number): void => {
    const command = commands[i];
    if (!command) return;
    setDialog(null);
    void command.run();
  };

  return (
    <Dialog title={t('palette.title')} onClose={() => setDialog(null)}>
      <input
        className="palette-input"
        data-testid="palette-input"
        autoFocus
        value={query}
        placeholder={t('palette.placeholder')}
        aria-label={t('palette.placeholder')}
        onChange={(e) => {
          setQuery(e.target.value);
          setIndex(0);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') setIndex((i) => Math.min(i + 1, Math.max(commands.length - 1, 0)));
          else if (e.key === 'ArrowUp') setIndex((i) => Math.max(i - 1, 0));
          else if (e.key === 'Enter') run(index);
        }}
      />
      <ul className="palette-list" data-testid="palette-list">
        {commands.map((c, i) => (
          <li key={c.id}>
            <button type="button" className={`palette-item ${i === index ? 'on' : ''}`} data-testid="palette-item" onClick={() => run(i)}>
              <span className="palette-title">{c.title}</span>
            </button>
          </li>
        ))}
      </ul>
      {commands.length === 0 && <p className="muted">{t('palette.empty')}</p>}
      <p className="muted palette-hint">{t('palette.shortcuts')}</p>
    </Dialog>
  );
}
