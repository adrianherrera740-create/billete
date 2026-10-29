import { randomUUID } from 'node:crypto';
import type { DatabaseSync } from 'node:sqlite';
import type { EventBus } from '@nave/core';
import type { ChannelInput, EventMap, Note, Task, TaskStatus } from '@nave/shared';
import { NaveError } from './projects';

interface TaskRow {
  id: string;
  project_id: string;
  title: string;
  status: string;
  position: number;
  created_at: string;
  updated_at: string;
  done_at: string | null;
}
interface NoteRow {
  id: string;
  project_id: string | null;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
}

const toTask = (r: TaskRow): Task => ({
  id: r.id,
  projectId: r.project_id,
  title: r.title,
  status: r.status as TaskStatus,
  position: r.position,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
  doneAt: r.done_at
});
const toNote = (r: NoteRow): Note => ({
  id: r.id,
  projectId: r.project_id,
  title: r.title,
  body: r.body,
  createdAt: r.created_at,
  updatedAt: r.updated_at
});

/** Tareas (siempre de un proyecto) y notas (con proyecto o en la bandeja). */
export class Tasks {
  constructor(
    private readonly db: DatabaseSync,
    private readonly bus: EventBus<EventMap>,
    private readonly now: () => Date = () => new Date()
  ) {}

  private ts(): string {
    return this.now().toISOString();
  }

  private assertProject(id: string): void {
    if (!this.db.prepare('SELECT 1 FROM projects WHERE id = ?').get(id)) {
      throw new NaveError('NOT_FOUND', 'Ese proyecto ya no existe. Recarga la lista de proyectos.');
    }
  }

  // ---- tareas ----
  listTasks(projectId: string): Task[] {
    this.assertProject(projectId);
    return (this.db.prepare('SELECT * FROM tasks WHERE project_id = ? ORDER BY position, created_at, id').all(projectId) as unknown as TaskRow[]).map(toTask);
  }

  task(id: string): Task {
    const row = this.db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as unknown as TaskRow | undefined;
    if (!row) throw new NaveError('NOT_FOUND', 'Esa tarea ya no existe. Recarga la lista.');
    return toTask(row);
  }

  createTask(input: ChannelInput<'task:create'>): Task {
    this.assertProject(input.projectId);
    const id = randomUUID();
    const last = this.db.prepare('SELECT COALESCE(MAX(position), 0) AS p FROM tasks WHERE project_id = ?').get(input.projectId) as unknown as { p: number };
    const t = this.ts();
    this.db
      .prepare("INSERT INTO tasks (id, project_id, title, status, position, created_at, updated_at, done_at) VALUES (?, ?, ?, 'todo', ?, ?, ?, NULL)")
      .run(id, input.projectId, input.title, last.p + 1, t, t);
    this.bus.emit('task.created', { id, projectId: input.projectId });
    return this.task(id);
  }

  updateTask(input: ChannelInput<'task:update'>): Task {
    const current = this.task(input.id);
    const status = input.status ?? current.status;
    const doneAt = status === 'done' ? (current.status === 'done' ? current.doneAt : this.ts()) : null;
    this.db
      .prepare('UPDATE tasks SET title = ?, status = ?, position = ?, done_at = ?, updated_at = ? WHERE id = ?')
      .run(input.title ?? current.title, status, input.position ?? current.position, doneAt, this.ts(), input.id);
    this.bus.emit('task.updated', { id: input.id, projectId: current.projectId });
    return this.task(input.id);
  }

  deleteTask(id: string): null {
    const current = this.task(id);
    this.db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    this.bus.emit('task.deleted', { id, projectId: current.projectId });
    return null;
  }

  // ---- notas ----
  listNotes(projectId: string | null): Note[] {
    if (projectId !== null) this.assertProject(projectId);
    const rows =
      projectId === null
        ? this.db.prepare('SELECT * FROM notes WHERE project_id IS NULL ORDER BY updated_at DESC, id').all()
        : this.db.prepare('SELECT * FROM notes WHERE project_id = ? ORDER BY updated_at DESC, id').all(projectId);
    return (rows as unknown as NoteRow[]).map(toNote);
  }

  note(id: string): Note {
    const row = this.db.prepare('SELECT * FROM notes WHERE id = ?').get(id) as unknown as NoteRow | undefined;
    if (!row) throw new NaveError('NOT_FOUND', 'Esa nota ya no existe. Recarga la lista.');
    return toNote(row);
  }

  createNote(input: ChannelInput<'note:create'>): Note {
    if (input.projectId !== null) this.assertProject(input.projectId);
    const id = randomUUID();
    const t = this.ts();
    this.db.prepare('INSERT INTO notes (id, project_id, title, body, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)').run(id, input.projectId, input.title ?? '', input.body ?? '', t, t);
    this.bus.emit('note.created', { id, projectId: input.projectId });
    return this.note(id);
  }

  updateNote(input: ChannelInput<'note:update'>): Note {
    const current = this.note(input.id);
    const projectId = input.projectId === undefined ? current.projectId : input.projectId;
    if (projectId !== null) this.assertProject(projectId);
    this.db
      .prepare('UPDATE notes SET project_id = ?, title = ?, body = ?, updated_at = ? WHERE id = ?')
      .run(projectId, input.title ?? current.title, input.body ?? current.body, this.ts(), input.id);
    this.bus.emit('note.updated', { id: input.id, projectId });
    return this.note(input.id);
  }

  deleteNote(id: string): null {
    const current = this.note(id);
    this.db.prepare('DELETE FROM notes WHERE id = ?').run(id);
    this.bus.emit('note.deleted', { id, projectId: current.projectId });
    return null;
  }
}
