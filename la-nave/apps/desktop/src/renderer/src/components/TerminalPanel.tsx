import '@xterm/xterm/css/xterm.css';
import { useEffect, useRef, useState } from 'react';
import { FitAddon } from '@xterm/addon-fit';
import { WebglAddon } from '@xterm/addon-webgl';
import { Terminal } from '@xterm/xterm';
import { useTranslation } from 'react-i18next';
import type { Panel, TerminalEvent } from '@nave/shared';

/**
 * Terminal real (el proceso vive en main). Detalles que importan:
 * - la salida llega por un canal propio y se ordena con `end` para no duplicar lo ya repintado;
 * - copiar al seleccionar, pegar (Ctrl+V / Ctrl+Shift+V), scroll y foco los gestiona xterm + este panel;
 * - en la visión general la entrada se desactiva.
 */
export function TerminalPanel({ panel, readOnly, mode = 'new' }: { panel: Panel; readOnly: boolean; mode?: 'new' | 'resume' }) {
  const { t } = useTranslation();
  const host = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const terminal = new Terminal({
      fontFamily: "'Cascadia Mono', Consolas, 'DejaVu Sans Mono', monospace",
      fontSize: 13,
      cursorBlink: true,
      scrollback: 5000,
      theme: { background: '#0b0f17', foreground: '#e8edf5' }
    });
    const fit = new FitAddon();
    terminal.loadAddon(fit);
    terminal.open(el);
    try {
      const webgl = new WebglAddon();
      webgl.onContextLoss(() => webgl.dispose());
      terminal.loadAddon(webgl);
    } catch {
      // Sin WebGL (o con la GPU desactivada) xterm sigue pintando con su renderizador normal.
    }
    fit.fit();
    term.current = terminal;

    const panelId = panel.id;
    let disposed = false;
    let replayEnd: number | null = null; // hasta que llega la respuesta de `start` se encola la salida
    const queued: Array<Extract<TerminalEvent, { type: 'data' }>> = [];

    const offEvents = window.nave.onTerminal((event) => {
      if (event.panelId !== panelId) return;
      if (event.type === 'exit') {
        terminal.write(`\r\n[${t('terminal.exited', { code: event.exitCode ?? '?' })}]\r\n`);
      } else if (replayEnd === null) {
        queued.push(event);
      } else if (event.end > replayEnd) {
        terminal.write(event.data);
      }
    });

    const size = { panelId, cols: terminal.cols, rows: terminal.rows };
    const started = mode === 'resume' ? window.nave.invoke('claude:resume', size) : window.nave.invoke('terminal:start', size);
    void started.then((res) => {
      if (disposed) return;
      if (!res.ok) {
        setNotice(res.error.message);
        replayEnd = Number.MAX_SAFE_INTEGER;
        return;
      }
      if (res.data.replay) terminal.write(res.data.replay);
      replayEnd = res.data.end;
      for (const event of queued) if (event.end > res.data.end) terminal.write(event.data);
      queued.length = 0;
      setNotice(res.data.notice);
    });

    const inputSub = terminal.onData((data) => {
      void window.nave.invoke('terminal:input', { panelId, data });
    });
    const selectionSub = terminal.onSelectionChange(() => {
      const selected = terminal.getSelection();
      if (selected) void navigator.clipboard.writeText(selected).catch(() => undefined);
    });

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (disposed || el.clientWidth === 0 || el.clientHeight === 0) return;
        fit.fit();
        void window.nave.invoke('terminal:resize', { panelId, cols: terminal.cols, rows: terminal.rows });
      }, 80);
    });
    observer.observe(el);

    return () => {
      disposed = true;
      clearTimeout(resizeTimer);
      observer.disconnect();
      offEvents();
      inputSub.dispose();
      selectionSub.dispose();
      terminal.dispose();
      term.current = null;
    };
  }, [panel.id, mode, t]);

  useEffect(() => {
    if (term.current) term.current.options.disableStdin = readOnly;
  }, [readOnly]);

  return (
    <div className="terminal-wrap">
      {notice && <p className="terminal-notice" role="status">{notice}</p>}
      <div ref={host} className="terminal" data-testid="terminal" onMouseDown={() => !readOnly && term.current?.focus()} />
    </div>
  );
}
