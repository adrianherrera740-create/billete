import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { startCore } from './nave';

const tmp = (): string => mkdtempSync(join(tmpdir(), 'nave-core-'));

describe('startCore', () => {
  it('crea la BD migrada, la copia de arranque y los logs', () => {
    const dir = tmp();
    const core = startCore(dir, '0.0.1');
    expect(core.db.prepare('SELECT COUNT(*) AS n FROM schema_migrations').get()).toEqual({ n: 3 });
    expect(existsSync(core.paths.backups)).toBe(true);
    core.close();
    expect(readFileSync(join(dir, 'logs', 'app.log'), 'utf8')).toContain('Arranque del núcleo');
  });

  it('emite app.quitting al cerrar y el log guarda la versión', () => {
    const dir = tmp();
    const seen: string[] = [];
    startCore(dir, '0.0.1').close();
    const core = startCore(dir, '0.0.2');
    core.bus.on('app.quitting', () => seen.push('quitting'));
    core.close();
    expect(seen).toEqual(['quitting']);
    expect(readFileSync(join(dir, 'logs', 'app.log'), 'utf8')).toContain('"version":"0.0.2"');
  });

  it('Activity registra los eventos de proyecto', () => {
    const core = startCore(tmp(), '0.0.1');
    const p = core.projects.create({ name: 'Registro' });
    core.projects.createPanel({ projectId: p.id, kind: 'sticky', x: 0, y: 0, w: 200, h: 100 });
    const rows = core.db.prepare('SELECT type, project_id FROM activity ORDER BY id').all();
    expect(rows).toEqual([
      { type: 'project.created', project_id: p.id },
      { type: 'board.panel_added', project_id: p.id }
    ]);
    core.close();
  });

  it('recupera una BD corrupta usando la copia de arranque anterior', () => {
    const dir = tmp();
    startCore(dir, '0.0.1').close();
    writeFileSync(join(dir, 'nave.db'), 'dañada '.repeat(200));
    const core = startCore(dir, '0.0.1');
    expect(core.db.prepare('SELECT COUNT(*) AS n FROM schema_migrations').get()).toEqual({ n: 3 });
    expect(readFileSync(join(dir, 'logs', 'security.log'), 'utf8')).toContain('Base de datos recuperada');
    core.close();
  });
});
