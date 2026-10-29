import { useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { Panel } from '@nave/shared';
import { moveRect, resizeRect } from '../board/geometry';
import { useNave } from '../store';
import { GlassButton } from './GlassButton';
import { ClaudePanel } from './ClaudePanel';
import { StickyPanel } from './StickyPanel';
import { TerminalPanel } from './TerminalPanel';

interface Props {
  panel: Panel;
  zoom: number;
  readOnly: boolean;
  onDelete(panel: Panel): void;
}

type Drag = { mode: 'move' | 'resize'; startX: number; startY: number; origin: Pick<Panel, 'x' | 'y' | 'w' | 'h'> };

/** Marco de un panel de la pizarra: se mueve por la cabecera y se redimensiona por la esquina. */
export function PanelFrame({ panel, zoom, readOnly, onDelete }: Props) {
  const { t } = useTranslation();
  const patchPanel = useNave((s) => s.patchPanel);
  const commitPanel = useNave((s) => s.commitPanel);
  const bringToFront = useNave((s) => s.bringToFront);
  const drag = useRef<Drag | null>(null);

  const begin = (mode: Drag['mode'], e: ReactPointerEvent<HTMLElement>): void => {
    if (readOnly || e.button !== 0) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { mode, startX: e.clientX, startY: e.clientY, origin: { x: panel.x, y: panel.y, w: panel.w, h: panel.h } };
    void bringToFront(panel.id);
  };

  const move = (e: ReactPointerEvent<HTMLElement>): void => {
    const d = drag.current;
    if (!d) return;
    const dx = (e.clientX - d.startX) / zoom;
    const dy = (e.clientY - d.startY) / zoom;
    const next = d.mode === 'move' ? moveRect(d.origin, dx, dy) : resizeRect(d.origin, dx, dy);
    patchPanel(panel.id, d.mode === 'move' ? { x: next.x, y: next.y } : { w: next.w, h: next.h });
  };

  const end = (e: ReactPointerEvent<HTMLElement>): void => {
    if (!drag.current) return;
    drag.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
    void commitPanel(panel.id);
  };

  return (
    <section
      className={`panel glass ${readOnly ? 'readonly' : ''}`}
      data-testid="panel"
      data-panel-id={panel.id}
      style={{ left: panel.x, top: panel.y, width: panel.w, height: panel.h, zIndex: panel.z }}
      onPointerDown={(e) => {
        // El fondo de la pizarra se arrastra; un panel no debe iniciar ese arrastre.
        e.stopPropagation();
        if (!readOnly) void bringToFront(panel.id);
      }}
    >
      <header className="panel-head" onPointerDown={(e) => begin('move', e)} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
        <span className="panel-title">{panel.title}</span>
        {!readOnly && (
          <GlassButton variant="ghost" aria-label={t('panel.delete')} title={t('panel.delete')} onPointerDown={(e) => e.stopPropagation()} onClick={() => onDelete(panel)}>
            ✕
          </GlassButton>
        )}
      </header>
      <div className="panel-body">
        {panel.kind === 'sticky' && <StickyPanel panel={panel} readOnly={readOnly} />}
        {panel.kind === 'terminal' && <TerminalPanel panel={panel} readOnly={readOnly} />}
        {panel.kind === 'claude' && <ClaudePanel panel={panel} readOnly={readOnly} />}
        {panel.kind !== 'sticky' && panel.kind !== 'terminal' && panel.kind !== 'claude' && <p className="muted">{t('panel.soon', { kind: panel.kind })}</p>}
      </div>
      {!readOnly && <div className="resize" aria-hidden="true" onPointerDown={(e) => begin('resize', e)} onPointerMove={move} onPointerUp={end} onPointerCancel={end} />}
    </section>
  );
}
