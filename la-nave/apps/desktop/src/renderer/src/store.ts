import { create } from 'zustand';
import { fitToPanels, spawnPosition } from './board/geometry';
import type { Board, Camera, ChannelInput, ChannelName, ChannelOutputs, BrainContext, BrainDetail, BrainHit, BrainKind, BrainNode, ClaudeEvent, ClaudeState, Note, Panel, PanelKind, Project, ShellOption, Task, TaskStatus } from '@nave/shared';

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
  tasks: Task[];
  notes: Note[];
  inbox: Note[];
  brain: BrainNode[];
  sideOpen: boolean;
  info: string | null;
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
  toggleSide(): void;
  loadSide(): Promise<void>;
  addTask(title: string): Promise<void>;
  setTaskStatus(id: string, status: TaskStatus): Promise<void>;
  removeTask(id: string): Promise<void>;
  addNote(projectId: string | null): Promise<void>;
  saveNote(id: string, patch: { title?: string; body?: string; projectId?: string | null }): Promise<void>;
  removeNote(id: string): Promise<void>;
  pasteToClaude(panelId: string, text: string): Promise<void>;
  loadBrain(): Promise<void>;
  openBrain(id: string | null): Promise<BrainDetail | null>;
  addBrain(title: string): Promise<void>;
  saveBrain(id: string, patch: { title?: string; body?: string; kind?: BrainKind }): Promise<void>;
  reviewBrain(id: string, action: 'accept' | 'reject' | 'restore'): Promise<void>;
  removeBrain(id: string): Promise<void>;
  searchBrain(query: string): Promise<BrainHit[]>;
  contextBrain(query: string): Promise<BrainContext | null>;
  clearInfo(): void;
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
    await get().loadSide();
  };

  return {
    projects: [],
    showArchived: false,
    shells: [],
    shellId: null,
    claudeStates: {},
    activeId: null,
    tasks: [],
    notes: [],
    inbox: [],
    brain: [],
    sideOpen: true,
    info: null,
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
        else {
          set({ activeId: null, board: null, tasks: [], notes: [] });
          await get().loadSide();
        }
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

    toggleSide: () => set({ sideOpen: !get().sideOpen }),

    loadSide: async () => {
      const { activeId } = get();
      try {
        const inbox = await call('note:list', { projectId: null });
        if (!activeId) return set({ tasks: [], notes: [], inbox });
        const [tasks, notes] = await Promise.all([call('task:list', { projectId: activeId }), call('note:list', { projectId: activeId })]);
        set({ tasks, notes, inbox });
      } catch (error) {
        set({ error: error instanceof Error ? error.message : String(error) });
      }
    },

    addTask: (title) =>
      guard(async () => {
        const { activeId } = get();
        if (!activeId) return;
        const task = await call('task:create', { projectId: activeId, title });
        set({ tasks: [...get().tasks, task] });
      }),

    setTaskStatus: (id, status) =>
      guard(async () => {
        const task = await call('task:update', { id, status });
        set({ tasks: get().tasks.map((x) => (x.id === id ? task : x)) });
      }),

    removeTask: (id) =>
      guard(async () => {
        await call('task:delete', { id });
        set({ tasks: get().tasks.filter((x) => x.id !== id) });
      }),

    addNote: (projectId) =>
      guard(async () => {
        await call('note:create', { projectId });
        await get().loadSide();
      }),

    saveNote: (id, patch) =>
      guard(async () => {
        await call('note:update', { id, ...patch });
        await get().loadSide();
      }),

    removeNote: (id) =>
      guard(async () => {
        await call('note:delete', { id });
        await get().loadSide();
      }),

    pasteToClaude: (panelId, text) =>
      guard(async () => {
        await call('claude:paste', { panelId, text });
        const title = get().board?.panels.find((p) => p.id === panelId)?.title ?? 'Claude';
        set({ info: `Pegado en «${title}». Revísalo y pulsa Intro dentro de Claude para enviarlo.` });
      }),

    loadBrain: () =>
      guard(async () => {
        const { activeId } = get();
        set({ brain: activeId ? await call('brain:list', { projectId: activeId }) : [] });
      }),

    openBrain: async (id) => {
      if (id === null) return null;
      try {
        return await call('brain:get', { id });
      } catch (error) {
        set({ error: error instanceof Error ? error.message : String(error) });
        return null;
      }
    },

    addBrain: (title) =>
      guard(async () => {
        const { activeId } = get();
        if (!activeId) return;
        await call('brain:create', { projectId: activeId, title });
        await get().loadBrain();
      }),

    saveBrain: (id, patch) =>
      guard(async () => {
        await call('brain:update', { id, ...patch });
        await get().loadBrain();
      }),

    reviewBrain: (id, action) =>
      guard(async () => {
        await call('brain:review', { id, action });
        await get().loadBrain();
      }),

    removeBrain: (id) =>
      guard(async () => {
        await call('brain:delete', { id });
        await get().loadBrain();
      }),

    searchBrain: async (query) => {
      const { activeId } = get();
      if (!activeId) return [];
      try {
        return await call('brain:search', { projectId: activeId, query });
      } catch (error) {
        set({ error: error instanceof Error ? error.message : String(error) });
        return [];
      }
    },

    contextBrain: async (query) => {
      const { activeId } = get();
      if (!activeId) return null;
      try {
        return await call('brain:context', { projectId: activeId, query });
      } catch (error) {
        set({ error: error instanceof Error ? error.message : String(error) });
        return null;
      }
    },

    clearInfo: () => set({ info: null }),

    clearError: () => set({ error: null })
  };
});
