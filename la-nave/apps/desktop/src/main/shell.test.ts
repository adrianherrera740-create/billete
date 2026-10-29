import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { EventBus } from '@nave/core';
import { migrate, openDatabase } from '@nave/db';
import type { EventMap } from '@nave/shared';
import { Brain } from './brain';
import { Projects } from './projects';
import { SettingsStore } from './settings';
import { GlobalSearch, Overview, escapeLike } from './shell';
import { Tasks } from './tasks';

function setup() {
  const db = openDatabase(join(mkdtempSync(join(tmpdir(), 'nave-shell-')), 'nave.db'));
  migrate(db);
  const bus = new EventBus<EventMap>();
  const changed: string[] = [];
  bus.on('settings.changed', (e) => changed.push(e.key));
  const brain = new Brain(db, bus);
  return { db, projects: new Projects(db, bus), tasks: new Tasks(db, bus), brain, settings: new SettingsStore(db, bus), overview: new Overview(db), search: new GlobalSearch(db, brain), changed };
}

describe('SettingsStore', () => {
  it('devuelve los valores por defecto y aplica parches parciales con evento', () => {
    const { settings, changed } = setup();
    expect(settings.get()).toEqual({ theme: 'dark', notifications: true, sideOpen: true });
    expect(settings.update({ theme: 'light' })).toEqual({ theme: 'light', notifications: true, sideOpen: true });
    expect(settings.update({ notifications: false, sideOpen: false })).toEqual({ theme: 'light', notifications: false, sideOpen: false });
    expect(changed).toEqual(['theme', 'notifications', 'sideOpen']);
  });

  it('un valor guardado inválido o corrupto se ignora y vuelve al valor por defecto', () => {
    const { db, settings } = setup();
    db.exec("INSERT INTO settings (key, value, updated_at) VALUES ('theme', '\"rosa\"', 't'), ('notifications', 'no-es-json', 't'), ('sideOpen', '3', 't')");
    expect(settings.get()).toEqual({ theme: 'dark', notifications: true, sideOpen: true });
  });

  it('las claves internas (ventana) viven aparte de los ajustes de la interfaz', () => {
    const { settings } = setup();
    settings.setRaw('window', { width: 1000, height: 700, maximized: false });
    expect(settings.raw('window')).toEqual({ width: 1000, height: 700, maximized: false });
    expect(settings.get()).not.toHaveProperty('window');
  });
});

describe('Overview (Command Center)', () => {
  it('resume tareas abiertas, en curso, nodos pendientes y paneles de Claude por proyecto', () => {
    const { db, projects, tasks, brain, overview } = setup();
    const a = projects.create({ name: 'A' });
    const b = projects.create({ name: 'B' });
    const t1 = tasks.createTask({ projectId: a.id, title: 'uno' });
    tasks.createTask({ projectId: a.id, title: 'dos' });
    const t3 = tasks.createTask({ projectId: a.id, title: 'tres' });
    tasks.updateTask({ id: t1.id, status: 'doing' });
    tasks.updateTask({ id: t3.id, status: 'done' });
    brain.propose(a.id, { title: 'pendiente' });
    brain.create({ projectId: a.id, title: 'ok' });
    const panel = projects.createPanel({ projectId: a.id, kind: 'claude', x: 0, y: 0, w: 400, h: 300, title: 'Claude 1' });
    db.prepare("INSERT INTO claude_sessions (panel_id, session_id, state, updated_at) VALUES (?, 's', 'working', 't')").run(panel.id);
    projects.archive(b.id, true);
    const [first, ...rest] = overview.summary();
    expect(rest).toEqual([]); // el archivado no sale
    expect(first).toMatchObject({ openTasks: 2, doingTasks: 1, pendingReview: 1, claude: [{ title: 'Claude 1', state: 'working' }] });
    expect(first?.project.name).toBe('A');
  });
});

describe('GlobalSearch (Ctrl+K)', () => {
  it('busca en proyectos, tareas, notas y Brain de todos los proyectos', () => {
    const { projects, tasks, brain, search } = setup();
    const a = projects.create({ name: 'Tienda TikTok' });
    const b = projects.create({ name: 'La Nave' });
    tasks.createTask({ projectId: a.id, title: 'Leer Seller Center' });
    tasks.createNote({ projectId: null, title: '', body: 'idea para el Seller Center de la tienda' });
    brain.create({ projectId: b.id, title: 'Arquitectura', body: 'el Seller Center no tiene nada que ver aquí' });
    const kinds = search.search('seller center').map((r) => r.kind).sort();
    expect(kinds).toEqual(['brain', 'note', 'task']);
    expect(search.search('nave')).toMatchObject([{ kind: 'project', title: 'La Nave', projectId: b.id }]);
    const task = search.search('seller').find((r) => r.kind === 'task');
    expect(task).toMatchObject({ projectId: a.id, snippet: 'Tienda TikTok' });
  });

  it('SEGURIDAD: % y _ no son comodines y las comillas o los operadores no rompen nada', () => {
    const { projects, tasks, brain, search } = setup();
    const p = projects.create({ name: 'P' });
    tasks.createTask({ projectId: p.id, title: 'descuento 50% hoy' });
    tasks.createTask({ projectId: p.id, title: 'otra cosa' });
    brain.create({ projectId: p.id, title: 'Nota', body: 'contenido' });
    expect(search.search('%')).toHaveLength(1); // solo la que contiene un % literal
    expect(search.search('_')).toHaveLength(0);
    expect(escapeLike('50%_\\')).toBe('50\\%\\_\\\\');
    for (const hostile of ['"', "'; DROP TABLE tasks; --", '( NOT *', 'title:x', '\\']) expect(() => search.search(hostile), hostile).not.toThrow();
  });

  it('no incluye proyectos archivados ni nodos obsoletos', () => {
    const { projects, tasks, brain, search } = setup();
    const p = projects.create({ name: 'Viejo' });
    tasks.createTask({ projectId: p.id, title: 'tarea del viejo' });
    const n = brain.create({ projectId: p.id, title: 'Obsoleto viejo' });
    brain.review(n.id, 'reject');
    expect(search.search('viejo').map((r) => r.kind)).toEqual(['project', 'task']);
    projects.archive(p.id, true);
    expect(search.search('viejo')).toEqual([]);
  });
});
