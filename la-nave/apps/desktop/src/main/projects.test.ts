import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { EventBus } from '@nave/core';
import { migrate, openDatabase } from '@nave/db';
import type { EventMap } from '@nave/shared';
import { NaveError, Projects } from './projects';

function setup(): { projects: Projects; events: string[] } {
  const db = openDatabase(join(mkdtempSync(join(tmpdir(), 'nave-proj-')), 'nave.db'));
  migrate(db);
  const bus = new EventBus<EventMap>();
  const events: string[] = [];
  for (const name of ['project.created', 'project.updated', 'project.archived', 'board.panel_added', 'board.panel_updated', 'board.panel_removed'] as const) {
    bus.on(name, () => events.push(name));
  }
  return { projects: new Projects(db, bus), events };
}

describe('Projects', () => {
  it('crea un proyecto con su pizarra, valores por defecto y evento', () => {
    const { projects, events } = setup();
    const p = projects.create({ name: 'Tienda' });
    expect(p).toMatchObject({ name: 'Tienda', color: '#4f8cff', rootPath: null, archivedAt: null });
    expect(projects.board(p.id)).toMatchObject({ projectId: p.id, camera: { x: 0, y: 0, zoom: 1 }, panels: [] });
    expect(events).toEqual(['project.created']);
  });

  it('edita, archiva y desarchiva; la lista oculta los archivados', () => {
    const { projects } = setup();
    const a = projects.create({ name: 'A' });
    projects.create({ name: 'B' });
    projects.update({ id: a.id, name: 'A2', rootPath: '/home/yo/a' });
    expect(projects.get(a.id)).toMatchObject({ name: 'A2', rootPath: '/home/yo/a' });
    projects.update({ id: a.id, rootPath: null });
    expect(projects.get(a.id).rootPath).toBeNull();
    projects.archive(a.id, true);
    expect(projects.list(false).map((p) => p.name)).toEqual(['B']);
    expect(projects.list(true)).toHaveLength(2);
    projects.archive(a.id, false);
    expect(projects.list(false)).toHaveLength(2);
  });

  it('paneles: crear, mover, editar config, borrar, y orden por z', () => {
    const { projects, events } = setup();
    const p = projects.create({ name: 'P' });
    const a = projects.createPanel({ projectId: p.id, kind: 'sticky', x: 10, y: 20, w: 300, h: 200, config: { text: 'hola' } });
    const b = projects.createPanel({ projectId: p.id, kind: 'sticky', x: 0, y: 0, w: 200, h: 100 });
    expect(b.z).toBeGreaterThan(a.z);
    expect(b.title).toBe('sticky');
    projects.updatePanel({ id: a.id, x: 99, config: { text: 'cambiado' } });
    expect(projects.panel(a.id)).toMatchObject({ x: 99, y: 20, config: { text: 'cambiado' } });
    projects.deletePanel(b.id);
    expect(projects.board(p.id).panels.map((x) => x.id)).toEqual([a.id]);
    expect(events).toEqual(['project.created', 'board.panel_added', 'board.panel_added', 'board.panel_updated', 'board.panel_removed']);
  });

  it('la cámara se guarda por proyecto', () => {
    const { projects } = setup();
    const p = projects.create({ name: 'P' });
    projects.setCamera({ projectId: p.id, x: -50, y: 30, zoom: 0.5 });
    expect(projects.board(p.id).camera).toEqual({ x: -50, y: 30, zoom: 0.5 });
  });

  it('ids que no existen dan NOT_FOUND con mensaje claro', () => {
    const { projects } = setup();
    for (const fn of [() => projects.get('x'), () => projects.board('x'), () => projects.panel('x'), () => projects.deletePanel('x')]) {
      expect(fn).toThrow(NaveError);
    }
    expect(() => projects.get('x')).toThrow(/ya no existe/);
  });
});
