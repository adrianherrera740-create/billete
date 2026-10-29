import type { DatabaseSync } from 'node:sqlite';
import type { ClaudeState, Project, ProjectSummary, SearchResult } from '@nave/shared';
import type { Brain } from './brain';

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

/** Resumen de todos los proyectos para el Command Center. */
export class Overview {
  constructor(private readonly db: DatabaseSync) {}

  summary(): ProjectSummary[] {
    const projects = this.db.prepare('SELECT * FROM projects WHERE archived_at IS NULL ORDER BY created_at, id').all() as unknown as ProjectRow[];
    const count = (sql: string, id: string): number => (this.db.prepare(sql).get(id) as unknown as { n: number }).n;
    const claudes = this.db
      .prepare("SELECT p.id AS id, p.title AS title, p.project_id AS project_id, COALESCE(c.state, 'unknown') AS state FROM panels p LEFT JOIN claude_sessions c ON c.panel_id = p.id WHERE p.kind = 'claude' ORDER BY p.created_at")
      .all() as unknown as Array<{ id: string; title: string; project_id: string; state: string }>;
    return projects.map((r) => {
      const project: Project = { id: r.id, name: r.name, icon: r.icon, color: r.color, rootPath: r.root_path, archivedAt: r.archived_at, createdAt: r.created_at, updatedAt: r.updated_at };
      return {
        project,
        openTasks: count("SELECT COUNT(*) AS n FROM tasks WHERE project_id = ? AND status != 'done'", r.id),
        doingTasks: count("SELECT COUNT(*) AS n FROM tasks WHERE project_id = ? AND status = 'doing'", r.id),
        pendingReview: count("SELECT COUNT(*) AS n FROM brain_nodes WHERE project_id = ? AND confidence = 'unverified'", r.id),
        claude: claudes.filter((c) => c.project_id === r.id).map((c) => ({ panelId: c.id, title: c.title, state: c.state as ClaudeState }))
      };
    });
  }
}

/** Escapa % _ \ para usar el texto de la persona dentro de un LIKE con ESCAPE '\'. */
export function escapeLike(text: string): string {
  return text.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/** Ctrl+K: busca en proyectos, tareas, notas y Brain de TODOS los proyectos (es la persona quien lo pide, de forma explícita). */
export class GlobalSearch {
  constructor(
    private readonly db: DatabaseSync,
    private readonly brain: Brain
  ) {}

  search(query: string, perKind = 8): SearchResult[] {
    const like = `%${escapeLike(query)}%`;
    const results: SearchResult[] = [];
    const projects = this.db.prepare("SELECT id, name FROM projects WHERE archived_at IS NULL AND name LIKE ? ESCAPE '\\' ORDER BY name LIMIT ?").all(like, perKind) as unknown as Array<{ id: string; name: string }>;
    for (const p of projects) results.push({ kind: 'project', id: p.id, projectId: p.id, title: p.name, snippet: '' });

    const tasks = this.db
      .prepare("SELECT t.id AS id, t.title AS title, t.project_id AS pid, p.name AS pname FROM tasks t JOIN projects p ON p.id = t.project_id WHERE p.archived_at IS NULL AND t.title LIKE ? ESCAPE '\\' ORDER BY t.updated_at DESC LIMIT ?")
      .all(like, perKind) as unknown as Array<{ id: string; title: string; pid: string; pname: string }>;
    for (const t of tasks) results.push({ kind: 'task', id: t.id, projectId: t.pid, title: t.title, snippet: t.pname });

    const notes = this.db
      .prepare(
        "SELECT n.id AS id, n.title AS title, n.body AS body, n.project_id AS pid, p.name AS pname FROM notes n LEFT JOIN projects p ON p.id = n.project_id WHERE (n.title LIKE ? ESCAPE '\\' OR n.body LIKE ? ESCAPE '\\') AND (p.id IS NULL OR p.archived_at IS NULL) ORDER BY n.updated_at DESC LIMIT ?"
      )
      .all(like, like, perKind) as unknown as Array<{ id: string; title: string; body: string; pid: string | null; pname: string | null }>;
    for (const n of notes) results.push({ kind: 'note', id: n.id, projectId: n.pid, title: n.title || n.body.slice(0, 60), snippet: n.pname ?? '' });

    for (const hit of this.brain.searchAll(query, perKind)) {
      results.push({ kind: 'brain', id: hit.node.id, projectId: hit.node.projectId, title: hit.node.title, snippet: `${hit.projectName} · ${hit.snippet}` });
    }
    return results;
  }
}
