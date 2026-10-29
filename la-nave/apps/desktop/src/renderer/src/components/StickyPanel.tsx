import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Panel } from '@nave/shared';
import { useNave } from '../store';

/** Nota sencilla: el texto se guarda al salir del campo. */
export function StickyPanel({ panel, readOnly }: { panel: Panel; readOnly: boolean }) {
  const { t } = useTranslation();
  const saveConfig = useNave((s) => s.saveConfig);
  const saved = typeof panel.config['text'] === 'string' ? panel.config['text'] : '';
  const [draft, setDraft] = useState(saved);

  return (
    <textarea
      data-testid="sticky-text"
      className="sticky"
      value={draft}
      readOnly={readOnly}
      maxLength={5000}
      placeholder={t('panel.stickyPlaceholder')}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => draft !== saved && void saveConfig(panel.id, { ...panel.config, text: draft })}
      onPointerDown={(e) => e.stopPropagation()}
    />
  );
}
