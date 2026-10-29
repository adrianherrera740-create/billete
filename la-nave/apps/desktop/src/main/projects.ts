import { randomUUID } from 'node:crypto';
import type { DatabaseSync } from 'node:sqlite';
import type { EventBus } from '@nave/core';
import type { Board, ChannelInput, EventMap, Panel, PanelKind, Project } from '@nave/shared';

/** Error con código que el registro IPC traduce a un `Result` de error. */
export class NaveError extends Error {
  constructor(
    readonly code: 'NOT_FOUND' | 'VALIDATION',
    message: string
  ) {
    super(message);
    this.name = 'NaveError';
  }
}

interface ProjectRow {
  id: string;
  name: string;
  icon: string;
  color: string;
  root_path: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}
interface BoardRow {
  id: string;
  project_id: string;
  cam_x: number;
  cam_y: number;
  zoom: number;
}
interface PanelRow {
  id: string;
  board_id: string;
  project_id: string;
  kind: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  config: string;
  host_id: string | null;
}

const toProject = (r: ProjectRow): Project => ({
  id: r.id,
  name: r.name,
  icon: r.icon,
  color: r.color,
  rootPath: r.root_path,
  archivedAt: r.archived_at,
  createdAt: r.created_at,
  updatedAt: r.updated_at
});

const toPanel = (r: PanelRow): Panel => ({
  id: r.id,
  boardId: r.board_id,
  projectId: r.project_id,
  kind: r.kind as PanelKind,
  title: r.title,
  x: r.x,
  y: r.y,
  w: r.w,
  h: r.h,
  z: r.z,
  config: JSON.parse(r.config) as Record<string, unknown>,
  hostId: r.host_id
});

const DEFAULT_ICON = '🚀';
const DEFAULT_COLOR = '#4f8cff';

export class Projects {
  constructor(
    private readonly db: DatabaseSync,
    private readonly bus: EventBus<EventMap>,
    private readonly now: () => Date = () => new Date()
  ) {}

  private ts(): string {
    return this.now().toISOString();
  }

  list(includeArchived: boolean): Project[] {
    const sql = `SELECT * FROM projects ${includeArchived ? '' : 'WHERE archived_at IS NULL'} ORDER BY created_at, id`;
    return (this.db.prepare(sql).all() as unknown as ProjectRow[]).map(toProject);
  }

  get(id: string): Project {
    const row = this.db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as unknown as ProjectRow | undefined;
    if (!row) throw new NaveError('NOT_FOUND', 'Ese proyecto ya no existe. Recarga la lista de proyectos.');
    return toProject(row);
  }

  create(input: ChannelInput<'project:create'>): Project {
    const id = randomUUID();
    const t = this.ts();
    this.db.exec('BEGIN');
    try {
      this.db
        .prepare('INSERT INTO projects (id, name, icon, color, root_path, archived_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NULL, ?, ?)')
        .run(id, input.name, input.icon ?? DEFAULT_ICON, input.color ?? DEFAULT_COLOR, input.rootPath ?? null, t, t);
      this.db.prepare('INSERT INTO boards (id, project_id) VALUES (?, ?)').run(randomUUID(), id);
      this.db.exec('COMMIT');
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }
    this.bus.emit('project.created', { id });
    return this.get(id);
  }

  update(input: ChannelInput<'project:update'>): Project {
    const current = this.get(input.id);
    this.db
      .prepare('UPDATE projects SET name = ?, icon = ?, color = ?, root_path = ?, updated_at = ? WHERE id = ?')
      .run(
        input.name ?? current.name,
        input.icon ?? current.icon,
        input.color ?? current.color,
        input.rootPath === undefined ? current.rootPath : input.rootPath,
        this.ts(),
        input.id
      );
    this.bus.emit('project.updated', { id: input.id });
    return this.get(input.id);
  }

  archive(id: string, archived: boolean): Project {
    this.get(id);
    this.db.prepare('UPDATE projects SET archived_at = ?, updated_at = ? WHERE id = ?').run(archived ? this.ts() : null, this.ts(), id);
    this.bus.emit('project.archived', { id, archived });
    return this.get(id);
  }

  board(projectId: string): Board {
    this.get(projectId);
    const board = this.db.prepare('SELECT * FROM boards WHERE project_id = ?').get(projectId) as unknown as BoardRow | undefined;
    if (!board) throw new NaveError('NOT_FOUND', 'Este proyecto no tiene pizarra. Crea el proyecto de nuevo.');
    const panels = (this.db.prepare('SELECT * FROM panels WHERE board_id = ? ORDER BY z, created_at, id').all(board.id) as unknown as PanelRow[]).map(toPanel);
    return { id: board.id, projectId, camera: { x: board.cam_x, y: board.cam_y, zoom: board.zoom }, panels };
  }

  setCamera(input: ChannelInput<'board:set-camera'>): null {
    this.get(input.projectId);
    this.db.prepare('UPDATE boards SET cam_x = ?, cam_y = ?, zoom = ? WHERE project_id = ?').run(input.x, input.y, input.zoom, input.projectId);
    return null;
  }

  createPanel(input: ChannelInput<'panel:create'>): Panel {
    const board = this.board(input.projectId);
    const id = randomUUID();
    const t = this.ts();
    const top = this.db.prepare('SELECT COALESCE(MAX(z), 0) AS z FROM panels WHERE board_id = ?').get(board.id) as unknown as { z: number };
    this.db
      .prepare(
        'INSERT INTO panels (id, board_id, project_id, kind, title, x, y, w, h, z, config, host_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)'
      )
      .run(id, board.id, input.projectId, input.kind, input.title ?? input.kind, input.x, input.y, input.w, input.h, top.z + 1, JSON.stringify(input.config ?? {}), t, t);
    this.bus.emit('board.panel_added', { projectId: input.projectId, panelId: id });
    return this.panel(id);
  }

  panel(id: string): Panel {
    const row = this.db.prepare('SELECT * FROM panels WHERE id = ?').get(id) as unknown as PanelRow | undefined;
    if (!row) throw new NaveError('NOT_FOUND', 'Ese panel ya no existe. Recarga la pizarra.');
    return toPanel(row);
  }

  updatePanel(input: ChannelInput<'panel:update'>): Panel {
    const current = this.panel(input.id);
    this.db
      .prepare('UPDATE panels SET title = ?, x = ?, y = ?, w = ?, h = ?, z = ?, config = ?, updated_at = ? WHERE id = ?')
      .run(
        input.title ?? current.title,
        input.x ?? current.x,
        input.y ?? current.y,
        input.w ?? current.w,
        input.h ?? current.h,
        input.z ?? current.z,
        JSON.stringify(input.config ?? current.config),
        this.ts(),
        input.id
      );
    this.bus.emit('board.panel_updated', { projectId: current.projectId, panelId: input.id });
    return this.panel(input.id);
  }

  deletePanel(id: string): null {
    const current = this.panel(id);
    this.db.prepare('DELETE FROM panels WHERE id = ?').run(id);
    this.bus.emit('board.panel_removed', { projectId: current.projectId, panelId: id });
    return null;
  }
}
