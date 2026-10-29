import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it } from 'vitest';
import { EventBus } from '@nave/core';
import { FTS_ROWID_OFFSET, createBackup, migrate, openDatabase } from '@nave/db';
import type { EventMap } from '@nave/shared';
import { Brain, extractLinks } from './brain';
import { NaveError, Projects } from './projects';

function setup() {
  const dir = mkdtempSync(join(tmpdir(), 'nave-brain-'));
  const db = openDatabase(join(dir, 'nave.db'));
  migrate(db);
  const bus = new EventBus<EventMap>();
  const events: string[] = [];
  for (const name of ['brain.node_created', 'brain.node_updated', 'brain.node_deleted', 'brain.node_reviewed'] as const) bus.on(name, (e) => events.push(`${name}:${'confidence' in e ? e.confidence : ''}`));
  let n = 0;
  const now = () => new Date(Date.UTC(2026, 9, 29, 10, 0, n++));
  const projects = new Projects(db, bus, now);
  return { db, dir, brain: new Brain(db, bus, now), projects, events };
}

describe('nodos y confianza', () => {
  it('lo que escribe la persona nace verificado; lo que propone Claude, NUNCA', () => {
    const { brain, projects } = setup();
    const p = projects.create({ name: 'P' });
    expect(brain.create({ projectId: p.id, title: 'Decisión', body: 'x' })).toMatchObject({ confidence: 'verified', source: 'user' });
    const proposed = brain.propose(p.id, { title: 'Idea de Claude', body: 'y', sourceRef: 'panel-1' });
    expect(proposed).toMatchObject({ confidence: 'unverified', source: 'claude', sourceRef: 'panel-1' });
  });

  it('aceptar, rechazar y restaurar; editar un nodo sin verificar equivale a revisarlo', () => {
    const { brain, projects, events } = setup();
    const p = projects.create({ name: 'P' });
    const a = brain.propose(p.id, { title: 'A' });
    const b = brain.propose(p.id, { title: 'B' });
    const c = brain.propose(p.id, { title: 'C' });
    expect(brain.review(a.id, 'accept').confidence).toBe('verified');
    expect(brain.review(b.id, 'reject').confidence).toBe('deprecated');
    expect(brain.review(b.id, 'restore').confidence).toBe('unverified');
    expect(brain.update({ id: c.id, body: 'corregido por la persona' })).toMatchObject({ confidence: 'verified', source: 'claude' });
    expect(events).toContain('brain.node_reviewed:verified');
    expect(events).toContain('brain.node_reviewed:deprecated');
  });

  it('la lista pone primero lo pendiente de revisar y al final lo obsoleto', () => {
    const { brain, projects } = setup();
    const p = projects.create({ name: 'P' });
    const ok = brain.create({ projectId: p.id, title: 'Verificado' });
    const dep = brain.propose(p.id, { title: 'Obsoleto' });
    brain.review(dep.id, 'reject');
    const pending = brain.propose(p.id, { title: 'Pendiente' });
    expect(brain.list(p.id).map((n) => n.id)).toEqual([pending.id, ok.id, dep.id]);
  });

  it('proyecto o nodo inexistente: NOT_FOUND con mensaje claro', () => {
    const { brain } = setup();
    expect(() => brain.list('no-existe')).toThrow(NaveError);
    expect(() => brain.get('no-existe')).toThrow(/ya no existe/);
    expect(() => brain.propose('no-existe', { title: 'x' })).toThrow(NaveError);
  });
});

describe('índice FTS: rowid determinista y sin recorridos completos', () => {
  const rowids = (db: DatabaseSync): number[] => (db.prepare('SELECT rowid FROM brain_fts ORDER BY rowid').all() as Array<{ rowid: number }>).map((r) => r.rowid);

  it('cada nodo tiene en FTS el rowid 1e12 + su rid, y se mantiene al editar y borrar', () => {
    const { db, brain, projects } = setup();
    const p = projects.create({ name: 'P' });
    const a = brain.create({ projectId: p.id, title: 'Alfa', body: 'contenido uno' });
    const b = brain.create({ projectId: p.id, title: 'Beta', body: 'contenido dos' });
    const rid = (id: string): number => (db.prepare('SELECT rid FROM brain_nodes WHERE id = ?').get(id) as { rid: number }).rid;
    expect(rowids(db)).toEqual([FTS_ROWID_OFFSET + rid(a.id), FTS_ROWID_OFFSET + rid(b.id)]);
    brain.update({ id: a.id, body: 'texto nuevo zorro' });
    expect(brain.search(p.id, 'zorro').map((h) => h.node.id)).toEqual([a.id]);
    expect(brain.search(p.id, 'uno')).toEqual([]);
    brain.delete(a.id);
    expect(rowids(db)).toEqual([FTS_ROWID_OFFSET + rid(b.id)]);
  });

  it('SOBREVIVE A LAS COPIAS: el rowid no cambia tras VACUUM INTO y la búsqueda sigue funcionando', () => {
    const { db, dir, brain, projects } = setup();
    const p = projects.create({ name: 'P' });
    const nodes = Array.from({ length: 30 }, (_, i) => brain.create({ projectId: p.id, title: `Nodo ${i}`, body: `palabra${i} comun` }));
    for (const node of nodes.slice(0, 20)) brain.delete(node.id); // huecos en los rid
    const before = rowids(db);
    const copy = new DatabaseSync(createBackup(db, join(dir, 'b'), { label: 'test' }), { readOnly: true });
    expect(rowids(copy)).toEqual(before);
    const hit = copy.prepare('SELECT n.title FROM brain_fts JOIN brain_nodes n ON n.rid = brain_fts.rowid - ? WHERE brain_fts MATCH ?').all(FTS_ROWID_OFFSET, '"palabra25"');
    expect(hit).toEqual([{ title: 'Nodo 25' }]);
  });

  it('borrar un proyecto entero (en cascada) no deja filas huérfanas en FTS', () => {
    const { db, brain, projects } = setup();
    const p = projects.create({ name: 'P' });
    brain.create({ projectId: p.id, title: 'A', body: 'x' });
    brain.create({ projectId: p.id, title: 'B', body: 'y' });
    db.prepare('DELETE FROM projects WHERE id = ?').run(p.id);
    expect(rowids(db)).toEqual([]);
  });

  it('con miles de nodos, borrar y buscar sigue siendo rápido (no hay recorrido completo)', () => {
    const { db, brain, projects } = setup();
    const p = projects.create({ name: 'P' });
    db.exec('BEGIN');
    const insert = db.prepare("INSERT INTO brain_nodes (id, project_id, title, body, created_at, updated_at) VALUES (?, ?, ?, ?, 't', 't')");
    for (let i = 0; i < 8000; i++) insert.run(`id-${i}`, p.id, `titulo ${i}`, `cuerpo ${i} relleno relleno relleno`);
    db.exec('COMMIT');
    const t0 = performance.now();
    for (let i = 0; i < 50; i++) brain.delete(`id-${i}`);
    const perDelete = (performance.now() - t0) / 50;
    expect(perDelete).toBeLessThan(20); // un recorrido de 8000 filas cuesta mucho más que esto
    const t1 = performance.now();
    expect(brain.search(p.id, 'cuerpo 7999').length).toBeGreaterThan(0);
    expect(performance.now() - t1).toBeLessThan(200);
  });
});

describe('búsqueda y contexto', () => {
  it('busca por palabras, con prefijo en la última, acentos y snippet; ignora obsoletos salvo que se pida', () => {
    const { brain, projects } = setup();
    const p = projects.create({ name: 'P' });
    const a = brain.create({ projectId: p.id, title: 'Proveedor CJ', body: 'Almacén en Alemania y Polonia, sin NIF exigido' });
    const b = brain.propose(p.id, { title: 'Proveedor viejo', body: 'ya no sirve' });
    brain.review(b.id, 'reject');
    expect(brain.search(p.id, 'almacen aleman').map((h) => h.node.id)).toEqual([a.id]);
    expect(brain.search(p.id, 'Proveedor').map((h) => h.node.id)).toEqual([a.id]);
    expect(brain.search(p.id, 'Proveedor', true)).toHaveLength(2);
    expect(brain.search(p.id, 'almacen')[0]?.snippet).toContain('[');
    expect(brain.search(p.id, '')).toEqual([]);
    expect(brain.search(p.id, '"( NOT *')).toEqual([]);
  });

  it('SEGURIDAD: nunca mezcla proyectos', () => {
    const { brain, projects } = setup();
    const a = projects.create({ name: 'A' });
    const b = projects.create({ name: 'B' });
    brain.create({ projectId: a.id, title: 'Secreto de A', body: 'dato confidencial alfa' });
    expect(brain.search(b.id, 'confidencial')).toEqual([]);
    expect(brain.context(b.id, 'confidencial alfa').nodes).toEqual([]);
    expect(brain.context(a.id, 'confidencial').nodes).toHaveLength(1);
  });

  it('el contexto es un paquete acotado: verificado primero, lo dudoso marcado, secretos redactados, con tope', () => {
    const { brain, projects } = setup();
    const p = projects.create({ name: 'Tienda' });
    const secret = 'sk-ant-' + 'a1'.repeat(15);
    brain.propose(p.id, { title: 'Supuesto', body: 'proveedor quizá barato' });
    brain.create({ projectId: p.id, title: 'Proveedor probado', body: `proveedor con clave ${secret}` });
    const ctx = brain.context(p.id, 'proveedor');
    expect(ctx.nodes.map((n) => n.title)).toEqual(['Proveedor probado', 'Supuesto']);
    expect(ctx.text).toContain('«Tienda»');
    expect(ctx.text).toContain('Supuesto [sin verificar]');
    expect(ctx.text).not.toContain('Proveedor probado [sin verificar]');
    expect(ctx.text).not.toContain(secret);
    expect(ctx.truncated).toBe(false);
  });

  it('nunca devuelve el Brain entero: topes de nodos y de caracteres', () => {
    const { brain, projects } = setup();
    const p = projects.create({ name: 'P' });
    for (let i = 0; i < 40; i++) brain.create({ projectId: p.id, title: `Nodo ${i}`, body: `tema común ${'texto '.repeat(200)}` });
    const ctx = brain.context(p.id, 'tema');
    expect(ctx.nodes.length).toBeLessThanOrEqual(8);
    expect(ctx.text.length).toBeLessThanOrEqual(4100);
    expect(ctx.truncated).toBe(true);
    expect(brain.context(p.id, 'tema', { maxNodes: 2, maxChars: 600 }).nodes.length).toBeLessThanOrEqual(2);
    expect(brain.context(p.id, '').text).toBe('');
  });
});

describe('enlaces [[...]] y retroenlaces', () => {
  it('extractLinks: sin repetidos (sin importar mayúsculas), con tope y sin saltos de línea', () => {
    expect(extractLinks('ver [[Alfa]] y [[alfa]] y [[Beta gamma]] [[a\nb]] [[]]')).toEqual(['Alfa', 'Beta gamma']);
    expect(extractLinks(Array.from({ length: 80 }, (_, i) => `[[n${i}]]`).join(' '))).toHaveLength(50);
  });

  it('resuelve por título dentro del proyecto, calcula retroenlaces y se actualiza al renombrar o borrar', () => {
    const { brain, projects } = setup();
    const p = projects.create({ name: 'P' });
    const other = projects.create({ name: 'O' });
    const a = brain.create({ projectId: p.id, title: 'Alfa', body: 'depende de [[Beta]] y de [[Fantasma]]' });
    brain.create({ projectId: other.id, title: 'Beta', body: 'de otro proyecto' });
    expect(brain.get(a.id).links).toEqual([{ title: 'Beta', targetId: null }, { title: 'Fantasma', targetId: null }]);
    const b = brain.create({ projectId: p.id, title: 'Beta', body: '' });
    expect(brain.get(a.id).links[0]).toEqual({ title: 'Beta', targetId: b.id });
    expect(brain.get(b.id).backlinks).toEqual([{ id: a.id, title: 'Alfa' }]);
    brain.update({ id: b.id, title: 'Beta renombrada' });
    expect(brain.get(a.id).links[0]).toEqual({ title: 'Beta', targetId: null });
    brain.update({ id: b.id, title: 'beta' });
    expect(brain.get(a.id).links[0]?.targetId).toBe(b.id);
    brain.delete(b.id);
    expect(brain.get(a.id).links[0]?.targetId).toBeNull();
  });

  it('el índice derivado se reconstruye entero al arrancar', () => {
    const { db, brain, projects } = setup();
    const p = projects.create({ name: 'P' });
    const a = brain.create({ projectId: p.id, title: 'A', body: '[[B]]' });
    const b = brain.create({ projectId: p.id, title: 'B', body: '' });
    db.exec('DELETE FROM brain_links');
    expect(brain.get(a.id).links).toEqual([]);
    brain.rebuildLinks();
    expect(brain.get(a.id).links).toEqual([{ title: 'B', targetId: b.id }]);
  });
});
