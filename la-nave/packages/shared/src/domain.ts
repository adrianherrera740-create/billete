export const PANEL_KINDS = ['terminal', 'claude', 'sticky', 'browser'] as const;
export type PanelKind = (typeof PANEL_KINDS)[number];

export interface Project {
  id: string;
  name: string;
  icon: string;
  color: string;
  rootPath: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Panel {
  id: string;
  boardId: string;
  projectId: string;
  kind: PanelKind;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  config: Record<string, unknown>;
  hostId: string | null;
}

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

export interface Board {
  id: string;
  projectId: string;
  camera: Camera;
  panels: Panel[];
}

/** El zoom máximo es 100 %: xterm falla bajo scale. */
export const ZOOM_MIN = 0.1;
export const ZOOM_MAX = 1;
export const PANEL_MIN_W = 160;
export const PANEL_MIN_H = 100;

/** Shell detectado en este equipo (solo lo que el renderer necesita ver). */
export interface ShellOption {
  id: string;
  label: string;
}

export interface TerminalStarted {
  running: boolean;
  /** Salida acumulada para repintar el panel; `end` es el desplazamiento total al que corresponde. */
  replay: string;
  end: number;
  shell: string;
  cwd: string;
  notice: string | null;
}

/** Eventos de terminal empujados de main al renderer (NO pasan por el bus, Activity ni logs). */
export type TerminalEvent =
  | { type: 'data'; panelId: string; data: string; end: number }
  | { type: 'exit'; panelId: string; exitCode: number | null };

export const CLAUDE_STATES = ['unknown', 'idle', 'working', 'waiting', 'ended'] as const;
export type ClaudeState = (typeof CLAUDE_STATES)[number];

export interface ClaudeStatus {
  panelId: string;
  state: ClaudeState;
  sessionId: string | null;
  /** ¿Está instalado `claude` en este equipo? Si no, el panel lo explica en vez de fallar. */
  available: boolean;
  running: boolean;
  notice: string | null;
}

export interface ClaudeEvent {
  type: 'claude-state';
  panelId: string;
  state: ClaudeState;
  sessionId: string | null;
}

export interface HistoryEntry {
  role: 'user' | 'assistant';
  text: string;
}
