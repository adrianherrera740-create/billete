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

export const TASK_STATUSES = ['todo', 'doing', 'done'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

/** Una tarea pertenece SIEMPRE a un proyecto. */
export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatus;
  position: number;
  createdAt: string;
  updatedAt: string;
  doneAt: string | null;
}

/** Una nota puede no tener proyecto (la bandeja de entrada). */
export interface Note {
  id: string;
  projectId: string | null;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export const BRAIN_CONFIDENCE = ['verified', 'unverified', 'deprecated'] as const;
export type BrainConfidence = (typeof BRAIN_CONFIDENCE)[number];
export const BRAIN_KINDS = ['note', 'decision', 'fact', 'source'] as const;
export type BrainKind = (typeof BRAIN_KINDS)[number];
export type BrainSource = 'user' | 'claude';

/** Un nodo del Brain. Lo generado por Claude NUNCA nace verificado: la persona lo acepta, edita o rechaza. */
export interface BrainNode {
  id: string;
  projectId: string;
  kind: BrainKind;
  title: string;
  body: string;
  confidence: BrainConfidence;
  source: BrainSource;
  sourceRef: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BrainDetail {
  node: BrainNode;
  /** [[enlaces]] del texto; `targetId` es null si ese título no existe en el proyecto. */
  links: Array<{ title: string; targetId: string | null }>;
  backlinks: Array<{ id: string; title: string }>;
}

export interface BrainHit {
  node: BrainNode;
  snippet: string;
}

/** Paquete de contexto para la IA: solo lo relevante y con tope de tamaño, nunca el Brain entero. */
export interface BrainContext {
  text: string;
  nodes: Array<{ id: string; title: string; confidence: BrainConfidence }>;
  truncated: boolean;
}

export const THEMES = ['dark', 'light', 'system'] as const;
export type Theme = (typeof THEMES)[number];

export interface Settings {
  theme: Theme;
  notifications: boolean;
  sideOpen: boolean;
}
export const DEFAULT_SETTINGS: Settings = { theme: 'dark', notifications: true, sideOpen: true };

/** Resumen de un proyecto para el Command Center. */
export interface ProjectSummary {
  project: Project;
  openTasks: number;
  doingTasks: number;
  pendingReview: number;
  claude: Array<{ panelId: string; title: string; state: ClaudeState }>;
}

export interface SearchResult {
  kind: 'project' | 'task' | 'note' | 'brain';
  id: string;
  projectId: string | null;
  title: string;
  snippet: string;
}
