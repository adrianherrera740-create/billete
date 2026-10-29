import { create } from 'zustand';
import { fitToPanels, spawnPosition } from './board/geometry';
import type { Board, Camera, ChannelInput, ChannelName, ChannelOutputs, ClaudeEvent, ClaudeState, Panel, PanelKind, Project, ShellOption } from '@nave/shared';

async function call<C extends ChannelName>(channel: C, input: ChannelInput<C>): Promise<ChannelOutputs[C]> {
  const res = await window.nave.invoke(channel, input);
  if (!res.ok) throw new Error(res.error.message);
  return res.data;
}

const SIZES: Record<string, { w: number; h: number }> = { sticky: { w: 280, h: 200 }, terminal: { w: 640, h: 380 }, claude: { w: 720, h: 460 } };
const DEFAULT_SIZE = { w: 400, h: 280 };
let cameraTimer: ReturnType<typeof setTimeout> | undefined;

interface State {
  projects: Project[];
  showArchived: boolean;
  shells: ShellOption[];
  shellId: string | null;
  claudeStates: Record<string, { state: ClaudeState; sessionId: string | null }>;
  activeId: string | null;
  board: Board | null;
  viewport: { w: number; h: number };
  overview: boolean;
  savedCamera: Camera | null;
  error: string | null;
  ready: boolean;
  load(): Promise<void>;
  setShowArchived(value: boolean): Promise<void>;
  setShellId(id: string): void;
  applyClaude(event: ClaudeEvent): void;
  select(id: string): Promise<void>;
  createProject(input: ChannelInput<'project:create'>): Promise<void>;
  archiveProject(id: string, archived: boolean): Promise<void>;
  setViewport(viewport: { w: number; h: number }): void;
  setCamera(camera: Camera): void;
  toggleOverview(): void;
  addPanel(kind: PanelKind, title: string): Promise<void>;
  patchPanel(id: string, patch: Partial<Pick<Panel, 'x' | 'y' | 'w' | 'h' | 'z'>>): void;
  commitPanel(id: string): Promise<void>;
  bringToFront(id: string): Promise<void>;
  saveConfig(id: string, config: Record<string, unknown>): Promise<void>;
  removePanel(id: string): Promise<void>;
  clearError(): void;
}

export const useNave = create<State>((set, get) => {
  /** Ejecuta una acción y convierte cualquier fallo en un aviso visible, sin romper la interfaz. */
  const guard = async (action: () => Promise<void>): Promise<void> => {
    try {
      await action();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : String(error) });
    }
  };

  const loadBoard = async (id: string): Promise<void> => {
    const board = await call('board:get', { projectId: id });
    set({ activeId: id, board, overview: false, savedCamera: null });
  };

  return {
    projects: [],
    showArchived: false,
    shells: [],
    shellId: null,
    claudeStates: {},
    activeId: null,
    board: null,
    viewport: { w: 1000, h: 700 },
    overview: false,
    savedCamera: null,
    error: null,
    ready: false,

    load: () =>
      guard(async () => {
        const projects = await call('project:list', { includeArchived: get().showArchived });
        const shells = await call('terminal:shells', undefined);
        set({ projects, shells, shellId: get().shellId ?? shells[0]?.id ?? null, ready: true });
        const current = get().activeId;
        const first = projects.find((p) => p.id === current && !p.archivedAt) ?? projects.find((p) => !p.archivedAt);
        if (first) await loadBoard(first.id);
        else set({ activeId: null, board: null });
      }),

    setShowArchived: async (value) => {
      set({ showArchived: value });
      await get().load();
    },

    setShellId: (id) => set({ shellId: id }),

    applyClaude: (event) => set({ claudeStates: { ...get().claudeStates, [event.panelId]: { state: event.state, sessionId: event.sessionId } } }),

    select: (id) => guard(() => loadBoard(id)),

    createProject: (input) =>
      guard(async () => {
        const project = await call('project:create', input);
        set({ projects: await call('project:list', { includeArchived: get().showArchived }) });
        await loadBoard(project.id);
      }),

    archiveProject: (id, archived) =>
      guard(async () => {
        await call('project:archive', { id, archived });
        if (archived && get().activeId === id) set({ activeId: null, board: null });
        await get().load();
      }),

    setViewport: (viewport) => set({ viewport }),

    setCamera: (camera) => {
      const board = get().board;
      if (!board) return;
      set({ board: { ...board, camera } });
      // El estado se ve al instante; se guarda en disco cuando la cámara deja de moverse.
      clearTimeout(cameraTimer);
      cameraTimer = setTimeout(() => {
        if (get().overview) return;
        void guard(async () => {
          await call('board:set-camera', { projectId: board.projectId, x: camera.x, y: camera.y, zoom: camera.zoom });
        });
      }, 400);
    },

    toggleOverview: () => {
      const { board, overview, savedCamera, viewport } = get();
      if (!board) return;
      if (overview) {
        set({ overview: false, board: { ...board, camera: savedCamera ?? board.camera }, savedCamera: null });
      } else {
        set({ overview: true, savedCamera: board.camera, board: { ...board, camera: fitToPanels(board.panels, viewport) } });
      }
    },

    addPanel: (kind, title) =>
      guard(async () => {
        const { board, viewport } = get();
        if (!board) return;
        const size = SIZES[kind] ?? DEFAULT_SIZE;
        const at = spawnPosition(board.camera, viewport, size, board.panels.length);
        const { shellId } = get();
        const config = kind === 'terminal' ? (shellId ? { shell: shellId } : {}) : kind === 'claude' ? {} : { text: '' };
        const panel = await call('panel:create', { projectId: board.projectId, kind, title, ...at, ...size, config });
        const current = get().board;
        if (current) set({ board: { ...current, panels: [...current.panels, panel] } });
      }),

    patchPanel: (id, patch) => {
      const board = get().board;
      if (!board) return;
      set({ board: { ...board, panels: board.panels.map((p) => (p.id === id ? { ...p, ...patch } : p)) } });
    },

    commitPanel: (id) =>
      guard(async () => {
        const panel = get().board?.panels.find((p) => p.id === id);
        if (!panel) return;
        await call('panel:update', { id, x: panel.x, y: panel.y, w: panel.w, h: panel.h, z: panel.z });
      }),

    bringToFront: async (id) => {
      const board = get().board;
      if (!board) return;
      const top = Math.max(...board.panels.map((p) => p.z));
      const panel = board.panels.find((p) => p.id === id);
      if (!panel || panel.z === top) return;
      get().patchPanel(id, { z: top + 1 });
      await get().commitPanel(id);
    },

    saveConfig: (id, config) =>
      guard(async () => {
        const updated = await call('panel:update', { id, config });
        const board = get().board;
        if (board) set({ board: { ...board, panels: board.panels.map((p) => (p.id === id ? { ...p, config: updated.config } : p)) } });
      }),

    removePanel: (id) =>
      guard(async () => {
        await call('panel:delete', { id });
        const board = get().board;
        if (board) set({ board: { ...board, panels: board.panels.filter((p) => p.id !== id) } });
      }),

    clearError: () => set({ error: null })
  };
});
