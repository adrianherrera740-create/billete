import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { EventBus } from '@nave/core';
import { migrate, openDatabase } from '@nave/db';
import type { EventMap } from '@nave/shared';
import { NaveError, Projects } from './projects';
import { Tasks } from './tasks';

function setup() {
  const db = openDatabase(join(mkdtempSync(join(tmpdir(), 'nave-tasks-')), 'nave.db'));
  migrate(db);
  const bus = new EventBus<EventMap>();
  const events: string[] = [];
  for (const name of ['task.created', 'task.updated', 'task.deleted', 'note.created', 'note.updated', 'note.deleted'] as const) bus.on(name, () => events.push(name));
  let n = 0;
  const now = () => new Date(Date.UTC(2026, 9, 29, 10, 0, n++));
  const projects = new Projects(db, bus, now);
  return { tasks: new Tasks(db, bus, now), projects, events };
}

describe('tareas', () => {
  it('pertenecen siempre a un proyecto que exista, y se ordenan por posición', () => {
    const { tasks, projects } = setup();
    const p = projects.create({ name: 'P' });
    const a = tasks.createTask({ projectId: p.id, title: 'Primera' });
    const b = tasks.createTask({ projectId: p.id, title: 'Segunda' });
    expect(b.position).toBeGreaterThan(a.position);
    expect(tasks.listTasks(p.id).map((t) => t.title)).toEqual(['Primera', 'Segunda']);
    expect(() => tasks.createTask({ projectId: 'no-existe', title: 'x' })).toThrow(NaveError);
    expect(() => tasks.listTasks('no-existe')).toThrow(/ya no existe/);
  });

  it('estado y fecha de hecha: se rellena al completar y se borra al reabrir', () => {
    const { tasks, projects } = setup();
    const p = projects.create({ name: 'P' });
    const t = tasks.createTask({ projectId: p.id, title: 'x' });
    expect(t).toMatchObject({ status: 'todo', doneAt: null });
    const done = tasks.updateTask({ id: t.id, status: 'done' });
    expect(done.doneAt).not.toBeNull();
    expect(tasks.updateTask({ id: t.id, title: 'x2' }).doneAt).toBe(done.doneAt);
    expect(tasks.updateTask({ id: t.id, status: 'doing' })).toMatchObject({ status: 'doing', doneAt: null });
  });

  it('borrar y eventos; las tareas de otro proyecto no se mezclan', () => {
    const { tasks, projects, events } = setup();
    const a = projects.create({ name: 'A' });
    const b = projects.create({ name: 'B' });
    const t = tasks.createTask({ projectId: a.id, title: 'solo A' });
    expect(tasks.listTasks(b.id)).toEqual([]);
    tasks.deleteTask(t.id);
    expect(() => tasks.task(t.id)).toThrow(/ya no existe/);
    expect(events).toEqual(['task.created', 'task.deleted']);
  });
});

describe('notas', () => {
  it('pueden estar en la bandeja (sin proyecto) y moverse a un proyecto y volver', () => {
    const { tasks, projects } = setup();
    const p = projects.create({ name: 'P' });
    const n = tasks.createNote({ projectId: null, title: 'Idea', body: 'algo' });
    expect(tasks.listNotes(null).map((x) => x.id)).toEqual([n.id]);
    expect(tasks.listNotes(p.id)).toEqual([]);
    tasks.updateNote({ id: n.id, projectId: p.id });
    expect(tasks.listNotes(null)).toEqual([]);
    expect(tasks.listNotes(p.id)).toHaveLength(1);
    tasks.updateNote({ id: n.id, projectId: null });
    expect(tasks.listNotes(null)).toHaveLength(1);
    expect(() => tasks.updateNote({ id: n.id, projectId: 'no-existe' })).toThrow(NaveError);
  });

  it('editar, ordenar por última edición y borrar', () => {
    const { tasks } = setup();
    const a = tasks.createNote({ projectId: null, body: 'a' });
    const b = tasks.createNote({ projectId: null, body: 'b' });
    expect(tasks.listNotes(null).map((x) => x.id)).toEqual([b.id, a.id]);
    tasks.updateNote({ id: a.id, body: 'a2', title: 'T' });
    expect(tasks.listNotes(null).map((x) => x.id)).toEqual([a.id, b.id]);
    expect(tasks.note(a.id)).toMatchObject({ body: 'a2', title: 'T' });
    tasks.deleteNote(a.id);
    expect(tasks.listNotes(null).map((x) => x.id)).toEqual([b.id]);
  });
});
