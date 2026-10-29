import { randomUUID } from 'node:crypto';
import type { DatabaseSync } from 'node:sqlite';
import { redactSecrets } from '@nave/core';
import type { EventBus } from '@nave/core';
import { FTS_ROWID_OFFSET, buildFtsQuery } from '@nave/db';
import type { BrainConfidence, BrainContext, BrainDetail, BrainHit, BrainKind, BrainNode, BrainSource, ChannelInput, EventMap } from '@nave/shared';
import { NaveError } from './projects';

interface NodeRow {
  rid: number;
  id: string;
  project_id: string;
  kind: string;
  title: string;
  body: string;
  confidence: string;
  source: string;
  source_ref: string | null;
  created_at: string;
  updated_at: string;
}

const toNode = (r: NodeRow): BrainNode => ({
  id: r.id,
  projectId: r.project_id,
  kind: r.kind as BrainKind,
  title: r.title,
  body: r.body,
  confidence: r.confidence as BrainConfidence,
  source: r.source as BrainSource,
  sourceRef: r.source_ref,
  createdAt: r.created_at,
  updatedAt: r.updated_at
});

/** [[Título]] dentro del texto: hasta 50 enlaces distintos, sin importar mayúsculas. */
export function extractLinks(body: string): string[] {
  const seen = new Map<string, string>();
  for (const match of body.matchAll(/\[\[([^[\]\n]{1,120})\]\]/g)) {
    const title = (match[1] ?? '').trim();
    if (title && !seen.has(title.toLowerCase())) seen.set(title.toLowerCase(), title);
    if (seen.size >= 50) break;
  }
  return [...seen.values()];
}

const RANK = "CASE n.confidence WHEN 'verified' THEN 0 WHEN 'unverified' THEN 1 ELSE 2 END";

/**
 * El Brain: conocimiento del proyecto con confianza, fuente y relaciones.
 * Reglas: lo generado por Claude NUNCA nace verificado; toda consulta va limitada a UN proyecto;
 * el texto de fuera solo llega a FTS a través de buildFtsQuery; el índice FTS se toca únicamente por rowid.
 */
export class Brain {
  constructor(
    private readonly db: DatabaseSync,
    private readonly bus: EventBus<EventMap>,
    private readonly now: () => Date = () => new Date()
  ) {}

  private ts(): string {
    return this.now().toISOString();
  }

  private row(id: string): NodeRow {
    const row = this.db.prepare('SELECT * FROM brain_nodes WHERE id = ?').get(id) as unknown as NodeRow | undefined;
    if (!row) throw new NaveError('NOT_FOUND', 'Ese nodo del Brain ya no existe. Recarga la lista.');
    return row;
  }

  private assertProject(projectId: string): string {
    const row = this.db.prepare('SELECT name FROM projects WHERE id = ?').get(projectId) as unknown as { name: string } | undefined;
    if (!row) throw new NaveError('NOT_FOUND', 'Ese proyecto ya no existe. Recarga la lista de proyectos.');
    return row.name;
  }

  list(projectId: string): BrainNode[] {
    this.assertProject(projectId);
    // En la lista, lo pendiente de revisar va arriba (hay que actuar); en el contexto para la IA, lo verificado va primero.
    const sql = "SELECT n.* FROM brain_nodes n WHERE n.project_id = ? ORDER BY CASE n.confidence WHEN 'unverified' THEN 0 WHEN 'verified' THEN 1 ELSE 2 END, n.updated_at DESC, n.rid DESC";
    return (this.db.prepare(sql).all(projectId) as unknown as NodeRow[]).map(toNode);
  }

  get(id: string): BrainDetail {
    const row = this.row(id);
    const links = this.db
      .prepare('SELECT l.dst_title AS title, t.id AS target FROM brain_links l LEFT JOIN brain_nodes t ON t.rid = l.dst_rid WHERE l.src_rid = ? ORDER BY l.dst_title')
      .all(row.rid) as unknown as Array<{ title: string; target: string | null }>;
    const backlinks = this.db
      .prepare('SELECT s.id AS id, s.title AS title FROM brain_links l JOIN brain_nodes s ON s.rid = l.src_rid WHERE l.dst_rid = ? ORDER BY s.title')
      .all(row.rid) as unknown as Array<{ id: string; title: string }>;
    return { node: toNode(row), links: links.map((l) => ({ title: l.title, targetId: l.target })), backlinks };
  }

  private insert(projectId: string, input: { title: string; body?: string | undefined; kind?: BrainKind | undefined }, source: BrainSource, confidence: BrainConfidence, sourceRef: string | null): BrainNode {
    this.assertProject(projectId);
    const id = randomUUID();
    const t = this.ts();
    const body = input.body ?? '';
    const result = this.db
      .prepare('INSERT INTO brain_nodes (id, project_id, kind, title, body, confidence, source, source_ref, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, projectId, input.kind ?? 'note', input.title, body, confidence, source, sourceRef, t, t);
    this.setLinks(Number(result.lastInsertRowid), body);
    this.relink(projectId);
    this.bus.emit('brain.node_created', { id, projectId });
    return toNode(this.row(id));
  }

  /** Lo escribe la persona: nace verificado. */
  create(input: ChannelInput<'brain:create'>): BrainNode {
    return this.insert(input.projectId, input, 'user', 'verified', null);
  }

  /** Lo propone Claude (p. ej. por MCP más adelante): SIEMPRE nace sin verificar, pida lo que pida. */
  propose(projectId: string, input: { title: string; body?: string; kind?: BrainKind; sourceRef?: string }): BrainNode {
    return this.insert(projectId, input, 'claude', 'unverified', input.sourceRef ?? null);
  }

  /** Editar un nodo sin verificar equivale a revisarlo: queda verificado con el texto de la persona. */
  update(input: ChannelInput<'brain:update'>): BrainNode {
    const current = this.row(input.id);
    const reviewed = current.confidence === 'unverified';
    this.db
      .prepare('UPDATE brain_nodes SET title = ?, body = ?, kind = ?, confidence = ?, updated_at = ? WHERE id = ?')
      .run(input.title ?? current.title, input.body ?? current.body, input.kind ?? current.kind, reviewed ? 'verified' : current.confidence, this.ts(), input.id);
    const body = input.body ?? current.body;
    this.setLinks(current.rid, body);
    this.relink(current.project_id);
    this.bus.emit('brain.node_updated', { id: input.id, projectId: current.project_id });
    if (reviewed) this.bus.emit('brain.node_reviewed', { id: input.id, projectId: current.project_id, confidence: 'verified' });
    return toNode(this.row(input.id));
  }

  review(id: string, action: 'accept' | 'reject' | 'restore'): BrainNode {
    const current = this.row(id);
    const confidence: BrainConfidence = action === 'accept' ? 'verified' : action === 'reject' ? 'deprecated' : 'unverified';
    this.db.prepare('UPDATE brain_nodes SET confidence = ?, updated_at = ? WHERE id = ?').run(confidence, this.ts(), id);
    this.bus.emit('brain.node_reviewed', { id, projectId: current.project_id, confidence });
    return toNode(this.row(id));
  }

  delete(id: string): null {
    const current = this.row(id);
    // Los disparadores borran la fila de FTS por rowid; nunca se recorre la tabla.
    this.db.prepare('DELETE FROM brain_nodes WHERE id = ?').run(id);
    this.relink(current.project_id);
    this.bus.emit('brain.node_deleted', { id, projectId: current.project_id });
    return null;
  }

  private setLinks(rid: number, body: string): void {
    this.db.prepare('DELETE FROM brain_links WHERE src_rid = ?').run(rid);
    const insert = this.db.prepare('INSERT OR IGNORE INTO brain_links (src_rid, dst_title, dst_rid) VALUES (?, ?, NULL)');
    for (const title of extractLinks(body)) insert.run(rid, title);
  }

  /** Resuelve a qué nodo apunta cada [[enlace]] (por título, dentro del mismo proyecto). */
  private relink(projectId: string): void {
    this.db
      .prepare(
        `UPDATE brain_links SET dst_rid = (
           SELECT t.rid FROM brain_nodes t WHERE t.project_id = ? AND lower(t.title) = lower(brain_links.dst_title) AND t.rid != brain_links.src_rid LIMIT 1)
         WHERE src_rid IN (SELECT rid FROM brain_nodes WHERE project_id = ?)`
      )
      .run(projectId, projectId);
  }

  /** El índice de enlaces es derivado: se reconstruye entero al arrancar. */
  rebuildLinks(): void {
    this.db.exec('DELETE FROM brain_links');
    const nodes = this.db.prepare('SELECT rid, body FROM brain_nodes').all() as unknown as Array<{ rid: number; body: string }>;
    for (const node of nodes) this.setLinks(node.rid, node.body);
    const projects = this.db.prepare('SELECT DISTINCT project_id FROM brain_nodes').all() as unknown as Array<{ project_id: string }>;
    for (const { project_id } of projects) this.relink(project_id);
  }

  private match(projectId: string, query: string, mode: 'and' | 'or', limit: number, includeDeprecated: boolean): Array<NodeRow & { snip: string }> {
    const fts = buildFtsQuery(query, { mode, prefixLast: mode === 'and' });
    if (fts === null) return [];
    const sql = `SELECT n.*, snippet(brain_fts, 1, '[', ']', '…', 14) AS snip
      FROM brain_fts JOIN brain_nodes n ON n.rid = brain_fts.rowid - ${FTS_ROWID_OFFSET}
      WHERE brain_fts MATCH ? AND n.project_id = ? ${includeDeprecated ? '' : "AND n.confidence != 'deprecated'"}
      ORDER BY ${mode === 'or' ? `${RANK}, ` : ''}bm25(brain_fts, 4.0, 1.0) LIMIT ?`;
    return this.db.prepare(sql).all(fts, projectId, limit) as unknown as Array<NodeRow & { snip: string }>;
  }

  search(projectId: string, query: string, includeDeprecated = false): BrainHit[] {
    this.assertProject(projectId);
    return this.match(projectId, query, 'and', 25, includeDeprecated).map((row) => ({
      node: toNode(row),
      snippet: row.snip && row.snip.trim() !== '' ? row.snip : row.body.slice(0, 140)
    }));
  }

  /** Búsqueda entre TODOS los proyectos (solo para la búsqueda global de la persona; el contexto para la IA nunca la usa). */
  searchAll(query: string, limit = 15): Array<BrainHit & { projectName: string }> {
    const fts = buildFtsQuery(query, { mode: 'and', prefixLast: true });
    if (fts === null) return [];
    const sql = `SELECT n.*, p.name AS pname, snippet(brain_fts, 1, '[', ']', '…', 14) AS snip
      FROM brain_fts JOIN brain_nodes n ON n.rid = brain_fts.rowid - ${FTS_ROWID_OFFSET} JOIN projects p ON p.id = n.project_id
      WHERE brain_fts MATCH ? AND n.confidence != 'deprecated' AND p.archived_at IS NULL
      ORDER BY bm25(brain_fts, 4.0, 1.0) LIMIT ?`;
    const rows = this.db.prepare(sql).all(fts, limit) as unknown as Array<NodeRow & { snip: string; pname: string }>;
    return rows.map((row) => ({ node: toNode(row), snippet: row.snip && row.snip.trim() !== '' ? row.snip : row.body.slice(0, 140), projectName: row.pname }));
  }

  /**
   * Paquete de contexto para la IA: SOLO lo relevante a la consulta, de UN proyecto, con tope de nodos y de
   * caracteres, lo verificado primero, lo dudoso marcado y los secretos redactados. Nunca el Brain entero.
   */
  context(projectId: string, query: string, limits: { maxNodes?: number; maxChars?: number } = {}): BrainContext {
    const name = this.assertProject(projectId);
    const maxNodes = limits.maxNodes ?? 8;
    const maxChars = limits.maxChars ?? 4000;
    const rows = this.match(projectId, query, 'or', maxNodes, false);
    if (rows.length === 0) return { text: '', nodes: [], truncated: false };

    let text = `Contexto del proyecto «${name}» (solo lo relevante a la consulta; lo marcado «sin verificar» puede ser incorrecto):\n`;
    const used: BrainContext['nodes'] = [];
    let truncated = false;
    for (const row of rows) {
      const mark = row.confidence === 'verified' ? '' : ' [sin verificar]';
      const head = `\n## ${row.title}${mark}\n`;
      const room = maxChars - text.length - head.length;
      if (room < 80) {
        truncated = true;
        break;
      }
      const body = row.body.length > room ? `${row.body.slice(0, room - 1)}…` : row.body;
      if (body.length < row.body.length) truncated = true;
      text += head + body + '\n';
      used.push({ id: row.id, title: row.title, confidence: row.confidence as BrainConfidence });
    }
    if (used.length < rows.length) truncated = true;
    return { text: redactSecrets(text), nodes: used, truncated };
  }
}
