import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { Panel } from '@nave/shared';
import { panBy, zoomAt } from '../board/geometry';
import { useNave } from '../store';
import { Dialog } from './Dialog';
import { GlassButton } from './GlassButton';
import { PanelFrame } from './PanelFrame';

export function BoardView() {
  const { t } = useTranslation();
  const board = useNave((s) => s.board);
  const overview = useNave((s) => s.overview);
  const setViewport = useNave((s) => s.setViewport);
  const toggleOverview = useNave((s) => s.toggleOverview);
  const addPanel = useNave((s) => s.addPanel);
  const removePanel = useNave((s) => s.removePanel);
  const project = useNave((s) => s.projects.find((p) => p.id === s.activeId));
  const shells = useNave((s) => s.shells);
  const shellId = useNave((s) => s.shellId);
  const setShellId = useNave((s) => s.setShellId);
  const surface = useRef<HTMLDivElement>(null);
  const pan = useRef<{ x: number; y: number } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Panel | null>(null);
  const hasBoard = board !== null;

  // Medimos la vista y bloqueamos el scroll nativo: rueda = mover; Ctrl + rueda = zoom (máx. 100 %).
  useEffect(() => {
    const el = surface.current;
    if (!el) return;
    const measure = (): void => useNave.getState().setViewport({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    const onWheel = (e: WheelEvent): void => {
      // Sobre una terminal la rueda es para su historial (scroll), no para mover la pizarra.
      if (e.target instanceof Element && e.target.closest('.xterm')) return;
      e.preventDefault();
      const { board: b, overview: ov, setCamera } = useNave.getState();
      if (!b || ov) return;
      if (e.ctrlKey) {
        const rect = el.getBoundingClientRect();
        setCamera(zoomAt(b.camera, { x: e.clientX - rect.left, y: e.clientY - rect.top }, b.camera.zoom * Math.exp(-e.deltaY * 0.002)));
      } else {
        setCamera(panBy(b.camera, -e.deltaX, -e.deltaY));
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      observer.disconnect();
      el.removeEventListener('wheel', onWheel);
    };
  }, [hasBoard, setViewport]);

  if (!board || !project) return <main className="board empty"><p className="muted">{t('board.pick')}</p></main>;

  const { camera } = board;
  const startPan = (e: ReactPointerEvent<HTMLDivElement>): void => {
    if (overview || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pan.current = { x: e.clientX, y: e.clientY };
  };
  const movePan = (e: ReactPointerEvent<HTMLDivElement>): void => {
    if (!pan.current) return;
    const dx = e.clientX - pan.current.x;
    const dy = e.clientY - pan.current.y;
    pan.current = { x: e.clientX, y: e.clientY };
    useNave.getState().setCamera(panBy(useNave.getState().board?.camera ?? camera, dx, dy));
  };
  const endPan = (e: ReactPointerEvent<HTMLDivElement>): void => {
    if (!pan.current) return;
    pan.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <main className="board" style={{ '--accent': project.color } as React.CSSProperties}>
      <header className="toolbar glass">
        <span className="board-title">
          <span aria-hidden="true">{project.icon}</span> {project.name}
        </span>
        <span className="spacer" />
        {shells.length > 0 && (
          <select data-testid="shell-select" aria-label={t('terminal.shell')} value={shellId ?? ''} onChange={(e) => setShellId(e.target.value)} disabled={overview}>
            {shells.map((sh) => (
              <option key={sh.id} value={sh.id}>
                {sh.label}
              </option>
            ))}
          </select>
        )}
        <GlassButton data-testid="add-terminal-btn" disabled={overview || shells.length === 0} title={shells.length === 0 ? t('terminal.none') : undefined} onClick={() => void addPanel('terminal', t('terminal.title', { n: board.panels.length + 1 }))}>
          {t('terminal.add')}
        </GlassButton>
        <GlassButton data-testid="add-claude-btn" disabled={overview} onClick={() => void addPanel('claude', t('claude.title', { n: board.panels.length + 1 }))}>
          {t('claude.add')}
        </GlassButton>
        <GlassButton data-testid="add-note-btn" disabled={overview} onClick={() => void addPanel('sticky', t('board.noteTitle', { n: board.panels.length + 1 }))}>
          {t('board.addNote')}
        </GlassButton>
        <GlassButton data-testid="overview-btn" aria-pressed={overview} onClick={toggleOverview}>
          {overview ? t('board.exitOverview') : t('board.overview')}
        </GlassButton>
        <span className="zoom" data-testid="zoom-label">{Math.round(camera.zoom * 100)} %</span>
      </header>

      <div ref={surface} className={`surface ${overview ? 'overview' : ''}`} onPointerDown={startPan} onPointerMove={movePan} onPointerUp={endPan} onPointerCancel={endPan}>
        <div className="world" style={{ transform: `translate(${-camera.x * camera.zoom}px, ${-camera.y * camera.zoom}px) scale(${camera.zoom})` }}>
          {board.panels.map((panel) => (
            <PanelFrame key={panel.id} panel={panel} zoom={camera.zoom} readOnly={overview} onDelete={setPendingDelete} />
          ))}
        </div>
        {board.panels.length === 0 && <p className="muted empty-hint">{t('board.empty')}</p>}
      </div>

      {pendingDelete && (
        <Dialog title={t('panel.deleteTitle')} onClose={() => setPendingDelete(null)}>
          <p>{t('panel.deleteBody', { title: pendingDelete.title })}</p>
          <div className="actions">
            <GlassButton variant="ghost" onClick={() => setPendingDelete(null)}>
              {t('common.cancel')}
            </GlassButton>
            <GlassButton
              variant="danger"
              data-testid="confirm-delete-btn"
              onClick={() => {
                void removePanel(pendingDelete.id);
                setPendingDelete(null);
              }}
            >
              {t('panel.delete')}
            </GlassButton>
          </div>
        </Dialog>
      )}
    </main>
  );
}
