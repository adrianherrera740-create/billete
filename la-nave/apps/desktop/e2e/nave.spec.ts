import { existsSync, mkdtempSync, readFileSync, realpathSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { _electron as electron, expect, test } from '@playwright/test';
import type { ElectronApplication, Page } from '@playwright/test';

type Bridge = { nave: { invoke(channel: string, input: unknown): Promise<unknown> } };

const launch = (dataDir: string): Promise<ElectronApplication> =>
  electron.launch({
    args: [join(__dirname, '../out/main/index.js'), ...(process.platform === 'linux' ? ['--no-sandbox'] : [])],
    env: { ...process.env, NAVE_NO_RELAUNCH: '1', NAVE_USER_DATA: dataDir }
  });

async function ready(app: ElectronApplication): Promise<Page> {
  const page = await app.firstWindow();
  await expect(page.getByTestId('app')).toHaveAttribute('data-ready', 'true');
  return page;
}

async function createProject(page: Page, name: string, folder?: string): Promise<void> {
  await page.getByTestId('new-project-btn').click();
  await page.getByTestId('project-name-input').fill(name);
  if (folder) await page.getByLabel('Carpeta del proyecto (opcional)').fill(folder);
  await page.getByTestId('create-project-btn').click();
}

test('arranca, crea su BD y el renderer no tiene Node', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'nave-e2e-'));
  const app = await launch(dataDir);
  const page = await ready(app);
  expect(await page.evaluate(() => typeof (globalThis as { require?: unknown }).require)).toBe('undefined');
  expect(await page.evaluate(() => typeof (globalThis as { process?: unknown }).process)).toBe('undefined');
  await app.close();
  expect(existsSync(join(dataDir, 'nave.db'))).toBe(true);
  expect(readFileSync(join(dataDir, 'logs', 'app.log'), 'utf8')).toContain('Arranque del núcleo');
});

test('proyecto, nota, movimiento y visión general persisten al reiniciar', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'nave-e2e-'));
  let app = await launch(dataDir);
  let page = await ready(app);

  await createProject(page, 'Mi tienda');
  await expect(page.getByTestId('project-item')).toHaveCount(1);
  await page.getByTestId('add-note-btn').click();
  await expect(page.getByTestId('panel')).toHaveCount(1);
  await page.getByTestId('sticky-text').fill('recordar el proveedor');
  await page.getByTestId('sticky-text').blur();

  // Mover el panel arrastrando su cabecera.
  const before = await page.getByTestId('panel').boundingBox();
  const head = await page.locator('.panel-head').boundingBox();
  if (!before || !head) throw new Error('No se encontró el panel');
  await page.mouse.move(head.x + 40, head.y + 10);
  await page.mouse.down();
  await page.mouse.move(head.x + 140, head.y + 70, { steps: 8 });
  await page.mouse.up();
  const moved = await page.getByTestId('panel').boundingBox();
  if (!moved) throw new Error('El panel desapareció al moverlo');
  expect(Math.round(moved.x - before.x)).toBe(100);
  expect(Math.round(moved.y - before.y)).toBe(60);

  // El zoom nunca pasa del 100 %.
  const surface = await page.locator('.surface').boundingBox();
  if (!surface) throw new Error('No se encontró la pizarra');
  await page.mouse.move(surface.x + 300, surface.y + 300);
  await page.keyboard.down('Control');
  await page.mouse.wheel(0, 400);
  await page.keyboard.up('Control');
  const zoomedOut = Number((await page.getByTestId('zoom-label').innerText()).replace(/\D/g, ''));
  expect(zoomedOut).toBeLessThan(100);
  await page.keyboard.down('Control');
  for (let i = 0; i < 6; i++) await page.mouse.wheel(0, -2000);
  await page.keyboard.up('Control');
  await expect(page.getByTestId('zoom-label')).toHaveText('100 %');

  // Visión general: los paneles son de solo lectura.
  await page.getByTestId('overview-btn').click();
  await expect(page.getByTestId('sticky-text')).toHaveJSProperty('readOnly', true);
  await page.getByTestId('overview-btn').click();
  await expect(page.getByTestId('sticky-text')).toHaveJSProperty('readOnly', false);
  await page.waitForTimeout(600); // deja que se guarde la cámara
  await app.close();

  app = await launch(dataDir);
  page = await ready(app);
  await expect(page.getByTestId('project-item')).toHaveText(/Mi tienda/);
  await expect(page.getByTestId('panel')).toHaveCount(1);
  await expect(page.getByTestId('sticky-text')).toHaveValue('recordar el proveedor');
  const after = await page.getByTestId('panel').boundingBox();
  if (!after) throw new Error('El panel no volvió a aparecer');
  expect(Math.round(after.x - moved.x)).toBe(0);
  await app.close();
});

test('borrar un panel pide confirmación y archivar oculta el proyecto', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'nave-e2e-'));
  const app = await launch(dataDir);
  const page = await ready(app);
  await createProject(page, 'Temporal');
  await page.getByTestId('add-note-btn').click();
  await page.getByRole('button', { name: 'Borrar panel' }).first().click();
  await page.getByRole('button', { name: 'Cancelar' }).click();
  await expect(page.getByTestId('panel')).toHaveCount(1);
  await page.getByRole('button', { name: 'Borrar panel' }).first().click();
  await page.getByTestId('confirm-delete-btn').click();
  await expect(page.getByTestId('panel')).toHaveCount(0);

  await page.getByRole('button', { name: 'Archivar proyecto' }).click();
  await expect(page.getByTestId('project-item')).toHaveCount(0);
  await page.getByLabel('Ver archivados').check();
  await expect(page.getByTestId('project-item')).toHaveCount(1);
  await app.close();
});

test('seguridad: el IPC valida las entradas y rechaza canales desconocidos', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'nave-e2e-'));
  const app = await launch(dataDir);
  const page = await ready(app);
  const invalid = await page.evaluate(() => (globalThis as unknown as Bridge).nave.invoke('project:create', { name: '' }));
  expect(invalid).toMatchObject({ ok: false, error: { code: 'VALIDATION' } });
  const unknown = await page.evaluate(async () => {
    try {
      await (globalThis as unknown as Bridge).nave.invoke('fs:borrar-todo', {});
      return 'aceptado';
    } catch (e) {
      return String(e);
    }
  });
  expect(unknown).toContain('Canal desconocido');
  await app.close();
});

/** Lo que el panel ha recibido hasta ahora: se pide como lo haría el renderer, sin leer el DOM (xterm pinta en WebGL). */
const replayOf = (page: Page, panelId: string): Promise<string> =>
  page.evaluate(async (id) => {
    const res = await (globalThis as unknown as Bridge).nave.invoke('terminal:start', { panelId: id, cols: 80, rows: 24 });
    return (res as { ok: boolean; data?: { replay: string } }).data?.replay ?? '';
  }, panelId);

test('terminal real: ejecuta un comando en la carpeta del proyecto y se cierra con el panel', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'nave-e2e-'));
  const projectDir = realpathSync(mkdtempSync(join(tmpdir(), 'nave-proj-')));
  const app = await launch(dataDir);
  const page = await ready(app);
  await createProject(page, 'Con terminal', projectDir);
  await page.getByTestId('add-terminal-btn').click();
  await expect(page.getByTestId('terminal')).toBeVisible();
  const panelId = (await page.getByTestId('panel').getAttribute('data-panel-id')) ?? '';

  await page.locator('.xterm-helper-textarea').focus();
  const win = process.platform === 'win32';
  // El resultado (hola-42) solo aparece si el shell evaluó la operación; lo tecleado no lo contiene.
  await page.keyboard.type(win ? 'echo "hola-$(20+22)"\r' : 'echo hola-$((20+22))\n');
  await expect.poll(() => replayOf(page, panelId), { timeout: 15_000 }).toContain('hola-42');
  await page.keyboard.type(win ? 'pwd\r' : 'pwd\n');
  await expect.poll(() => replayOf(page, panelId), { timeout: 15_000 }).toContain(projectDir);

  // Borrar el panel mata el proceso.
  await page.getByRole('button', { name: 'Borrar panel' }).first().click();
  await page.getByTestId('confirm-delete-btn').click();
  await expect(page.getByTestId('panel')).toHaveCount(0);
  const after = await page.evaluate(
    (id) => (globalThis as unknown as Bridge).nave.invoke('terminal:input', { panelId: id, data: 'x' }),
    panelId
  );
  expect(after).toMatchObject({ ok: false });
  await app.close();
});

test('Claude: estado por hooks, historial de solo lectura y reanudar la misma sesión', async () => {
  test.skip(process.platform === 'win32', 'El falso claude es un script de Unix');
  const dataDir = mkdtempSync(join(tmpdir(), 'nave-e2e-'));
  const home = mkdtempSync(join(tmpdir(), 'nave-home-'));
  const env = { HOME: home, NAVE_CLAUDE_BIN: join(__dirname, 'fixtures', 'fake-claude.mjs') };
  const launchWith = (): Promise<ElectronApplication> =>
    electron.launch({
      args: [join(__dirname, '../out/main/index.js'), '--no-sandbox'],
      env: { ...process.env, ...env, NAVE_NO_RELAUNCH: '1', NAVE_USER_DATA: dataDir }
    });

  let app = await launchWith();
  let page = await ready(app);
  await createProject(page, 'Con Claude');
  await page.getByTestId('add-claude-btn').click();
  const panelId = (await page.getByTestId('panel').getAttribute('data-panel-id')) ?? '';

  // 1) La sesión nueva arranca sola (no había ninguna) y el hook SessionStart la deja "Inactivo".
  await expect(page.getByTestId('claude-state')).toHaveText('Inactivo', { timeout: 15_000 });
  await expect.poll(() => replayOf(page, panelId), { timeout: 15_000 }).toContain('mode=new');
  const sessionId = /session=([0-9a-f-]{36})/.exec(await replayOf(page, panelId))?.[1] ?? '';
  expect(sessionId).toHaveLength(36);

  // 2) Un mensaje: el hook UserPromptSubmit lo pone "Trabajando" y Stop lo devuelve a "Inactivo".
  await page.locator('.xterm-helper-textarea').focus();
  await page.keyboard.type('hola nave\n');
  await expect(page.getByTestId('claude-state')).toHaveText('Trabajando');
  await expect(page.getByTestId('claude-state')).toHaveText('Inactivo', { timeout: 15_000 });

  // 3) Historial de solo lectura, leído del .jsonl.
  await page.getByTestId('claude-history-btn').click();
  await expect(page.getByTestId('claude-history')).toContainText('hola nave');
  await expect(page.getByTestId('claude-history')).toContainText('eco: hola nave');
  await page.getByTestId('claude-history-btn').click();

  // 4) La sesión termina y se puede reanudar con el MISMO id.
  await page.locator('.xterm-helper-textarea').focus();
  await page.keyboard.type('exit\n');
  await expect(page.getByTestId('claude-state')).toHaveText('Terminada', { timeout: 15_000 });
  await page.getByTestId('claude-resume-btn').click();
  await expect.poll(() => replayOf(page, panelId), { timeout: 15_000 }).toContain(`mode=resume session=${sessionId}`);
  await page.waitForTimeout(500);
  await app.close();

  // 5) Tras reiniciar la app NO se abre otra sesión sola: pregunta qué hacer y conserva el id.
  app = await launchWith();
  page = await ready(app);
  await expect(page.getByTestId('claude-choose')).toBeVisible();
  await page.getByTestId('claude-resume-btn').click();
  const again = page.getByTestId('panel').getAttribute('data-panel-id');
  await expect.poll(async () => replayOf(page, (await again) ?? ''), { timeout: 15_000 }).toContain(`mode=resume session=${sessionId}`);
  await app.close();
});

test('Claude: sin claude instalado el panel lo explica', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'nave-e2e-'));
  const app = await electron.launch({
    args: [join(__dirname, '../out/main/index.js'), '--no-sandbox'],
    env: { ...process.env, PATH: '/nada', NAVE_CLAUDE_BIN: '/no/existe', NAVE_NO_RELAUNCH: '1', NAVE_USER_DATA: dataDir }
  });
  const page = await ready(app);
  await createProject(page, 'Sin Claude');
  await page.getByTestId('add-claude-btn').click();
  await expect(page.getByRole('status')).toContainText('No se ha encontrado Claude Code');
  await app.close();
});

test('tareas y notas: por proyecto, bandeja sin proyecto, mover entre ambos y persistir', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'nave-e2e-'));
  let app = await launch(dataDir);
  let page = await ready(app);
  await createProject(page, 'Alfa');
  await page.getByTestId('task-input').fill('Leer Seller Center');
  await page.getByTestId('task-add-btn').click();
  await page.getByTestId('task-input').fill('Abrir la ficha de CJ');
  await page.getByTestId('task-add-btn').click();
  await expect(page.getByTestId('task')).toHaveCount(2);
  await page.getByTestId('task').first().getByRole('checkbox').check();
  await expect(page.getByTestId('task').first()).toHaveClass(/done/);

  // Una nota de proyecto y otra en la bandeja (sin proyecto).
  await page.getByTestId('tab-notes').click();
  await page.getByTestId('note-add-btn').click();
  await page.getByTestId('note-body').fill('nota de Alfa');
  await page.getByTestId('note-body').blur();
  await page.getByTestId('tab-inbox').click();
  await page.getByTestId('inbox-add-btn').click();
  await page.getByTestId('note-body').fill('idea suelta');
  await page.getByTestId('note-body').blur();

  // La bandeja no depende del proyecto: sigue ahí con otro proyecto abierto, y las tareas no se mezclan.
  await createProject(page, 'Beta');
  await expect(page.getByTestId('tab-tasks')).toBeVisible();
  await page.getByTestId('tab-tasks').click();
  await expect(page.getByTestId('task')).toHaveCount(0);
  await page.getByTestId('tab-inbox').click();
  await expect(page.getByTestId('note-body')).toHaveValue('idea suelta');

  // Mover la nota de la bandeja a Beta y comprobar que sale de la bandeja.
  await page.getByLabel('Mover la nota a').selectOption({ label: 'Beta' });
  await expect(page.getByTestId('note')).toHaveCount(0);
  await page.getByTestId('tab-notes').click();
  await expect(page.getByTestId('note-body')).toHaveValue('idea suelta');
  await app.close();

  app = await launch(dataDir);
  page = await ready(app);
  await page.getByTestId('project-item').filter({ hasText: 'Alfa' }).click();
  await expect(page.getByTestId('task')).toHaveCount(2);
  await expect(page.getByTestId('task').first()).toHaveClass(/done/);
  await page.getByTestId('tab-notes').click();
  await expect(page.getByTestId('note-body')).toHaveValue('nota de Alfa');
  await app.close();
});

test('enviar una nota a Claude la pega sin Intro; la persona decide cuándo enviarla', async () => {
  test.skip(process.platform === 'win32', 'El falso claude es un script de Unix');
  const dataDir = mkdtempSync(join(tmpdir(), 'nave-e2e-'));
  const home = mkdtempSync(join(tmpdir(), 'nave-home-'));
  const app = await electron.launch({
    args: [join(__dirname, '../out/main/index.js'), '--no-sandbox'],
    env: { ...process.env, HOME: home, NAVE_CLAUDE_BIN: join(__dirname, 'fixtures', 'fake-claude.mjs'), NAVE_NO_RELAUNCH: '1', NAVE_USER_DATA: dataDir }
  });
  const page = await ready(app);
  await createProject(page, 'Con envío');
  await page.getByTestId('tab-notes').click();
  await page.getByTestId('note-add-btn').click();
  await page.getByTestId('note-body').fill('revisa el plan de proveedores');
  await page.getByTestId('note-body').blur();
  // Sin panel de Claude no se puede enviar.
  await expect(page.getByTestId('note-send-btn')).toBeDisabled();

  await page.getByTestId('add-claude-btn').click();
  await expect(page.getByTestId('claude-state')).toHaveText('Inactivo', { timeout: 15_000 });
  await page.getByTestId('note-send-btn').click();
  await expect(page.getByTestId('info-toast')).toContainText('pulsa Intro dentro de Claude');

  // Sin Intro, Claude no empieza a trabajar.
  await page.waitForTimeout(1200);
  await expect(page.getByTestId('claude-state')).toHaveText('Inactivo');

  // La persona pulsa Intro y entonces sí.
  await page.locator('.xterm-helper-textarea').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('claude-state')).toHaveText('Trabajando');
  await expect(page.getByTestId('claude-state')).toHaveText('Inactivo', { timeout: 15_000 });
  await page.getByTestId('claude-history-btn').click();
  await expect(page.getByTestId('claude-history')).toContainText('revisa el plan de proveedores');
  await app.close();
});

test('Brain: nodos, enlaces, búsqueda, revisión de lo propuesto por Claude y contexto acotado', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'nave-e2e-'));
  const app = await launch(dataDir);
  const page = await ready(app);
  await createProject(page, 'Tienda');
  await page.getByTestId('tab-brain').click();

  // Dos nodos de la persona, enlazados con [[ ]].
  for (const title of ['Plan CJ', 'Seller Center']) {
    await page.getByTestId('brain-new-title').fill(title);
    await page.getByTestId('brain-add').click();
  }
  await expect(page.getByTestId('brain-node')).toHaveCount(2);
  await expect(page.getByTestId('brain-section-verified')).toBeVisible();
  await page.getByTestId('brain-node').filter({ hasText: 'Plan CJ' }).getByRole('button').first().click();
  await page.getByTestId('brain-body').fill('Almacén en Alemania y Polonia. Antes hay que leer [[Seller Center]] y [[Nada]].');
  await page.getByTestId('brain-save').click();
  await page.getByTestId('brain-node').filter({ hasText: 'Seller Center' }).getByRole('button').first().click();
  await expect(page.getByTestId('brain-backlinks')).toContainText('Plan CJ');
  await page.getByRole('button', { name: 'Cerrar' }).first().click();
  await page.getByTestId('brain-node').filter({ hasText: 'Plan CJ' }).getByRole('button').first().click();
  await expect(page.getByTestId('brain-links')).toContainText('Seller Center');
  await expect(page.getByTestId('brain-links')).toContainText('Nada?'); // enlace sin resolver
  await page.getByRole('button', { name: 'Cerrar' }).first().click();

  // Búsqueda: acentos, prefijo y fragmento; el texto hostil no rompe nada.
  await page.getByTestId('brain-search').fill('almacen aleman');
  await expect(page.getByTestId('brain-hits')).toContainText('Plan CJ');
  await page.getByTestId('brain-search').fill(String.raw`" ( NOT * title:x`);
  await expect(page.getByTestId('brain-hits')).toContainText('No hay resultados');
  await expect(page.getByTestId('error-toast')).toHaveCount(0);
  await page.getByTestId('brain-search').fill('');

  // Lo que propone Claude (aquí, insertado en la BD como lo haría MCP) llega SIN verificar.
  const db = new DatabaseSync(join(dataDir, 'nave.db'));
  const projectId = (db.prepare('SELECT id FROM projects').get() as { id: string }).id;
  const insert = db.prepare("INSERT INTO brain_nodes (id, project_id, title, body, confidence, source, created_at, updated_at) VALUES (?, ?, ?, ?, 'unverified', 'claude', 't', 't')");
  insert.run('c1', projectId, 'Suposición de plazos', 'Los plazos de CJ serían de 5 días', );
  insert.run('c2', projectId, 'Dato dudoso', 'CJ exige factura de alta');
  db.close();
  await page.getByTestId('tab-tasks').click();
  await page.getByTestId('tab-brain').click();
  await expect(page.getByTestId('brain-section-unverified')).toContainText('Pendientes de revisión (2)');
  await expect(page.getByTestId('brain-section-unverified').getByText('Propuesto por Claude')).toHaveCount(2);

  // El contexto marca lo dudoso y deja claro que es de este proyecto.
  await page.getByTestId('brain-search').fill('plazos CJ');
  await page.getByTestId('brain-context-btn').click();
  await expect(page.getByTestId('brain-context-text')).toContainText('«Tienda»');
  await expect(page.getByTestId('brain-context-text')).toContainText('Suposición de plazos [sin verificar]');
  await page.getByRole('button', { name: 'Cerrar' }).last().click();
  await page.getByTestId('brain-search').fill('');

  // Aceptar uno y rechazar otro.
  await page.getByTestId('brain-node').filter({ hasText: 'Suposición de plazos' }).getByTestId('brain-accept').click();
  await page.getByTestId('brain-node').filter({ hasText: 'Dato dudoso' }).getByTestId('brain-reject').click();
  await expect(page.getByTestId('brain-section-unverified')).toHaveCount(0);
  await expect(page.getByTestId('brain-section-deprecated')).toContainText('Dato dudoso');
  await expect(page.getByTestId('brain-section-verified')).toContainText('Suposición de plazos');
  // Lo obsoleto no sale en las búsquedas.
  await page.getByTestId('brain-search').fill('factura');
  await expect(page.getByTestId('brain-hits')).toContainText('No hay resultados');
  await app.close();
});

type Doc = { document: { documentElement: { dataset: Record<string, string | undefined> } } };
const theme = (page: Page): Promise<string | undefined> => page.evaluate(() => (globalThis as unknown as Doc).document.documentElement.dataset['theme']);

test('atajos fijos y paleta de comandos; Ctrl+N no hace nada', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'nave-e2e-'));
  const app = await launch(dataDir);
  const page = await ready(app);
  await createProject(page, 'Atajos');

  await page.keyboard.press('Control+k');
  await expect(page.getByTestId('global-search-input')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('global-search-input')).toHaveCount(0);

  await page.keyboard.press('Control+Shift+P');
  await expect(page.getByTestId('palette-input')).toBeVisible();
  await page.getByTestId('palette-input').fill('tema claro');
  await page.keyboard.press('Enter');
  await expect.poll(() => theme(page)).toBe('light');
  await page.keyboard.press('Control+Shift+P');
  await page.getByTestId('palette-input').fill('anadir terminal'); // sin acento: también lo encuentra
  await expect(page.getByTestId('palette-item')).toHaveCount(1);
  await page.keyboard.press('Escape');

  await page.keyboard.press('Control+Shift+T');
  await expect(page.getByTestId('terminal')).toBeVisible();
  await page.keyboard.press('Control+Shift+A');
  await expect(page.getByTestId('panel')).toHaveCount(2);
  await page.getByTestId('tab-tasks').click();
  await page.keyboard.press('Control+Shift+B');
  await expect(page.getByTestId('brain-search')).toBeVisible();

  // Ctrl+N no existe: ni diálogo de proyecto nuevo ni paneles nuevos.
  await page.keyboard.press('Control+n');
  await page.keyboard.press('Control+Shift+N');
  await expect(page.getByTestId('project-name-input')).toHaveCount(0);
  await expect(page.getByTestId('panel')).toHaveCount(2);
  await app.close();
});

test('el tema se guarda en ajustes y sigue al reiniciar', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'nave-e2e-'));
  let app = await launch(dataDir);
  let page = await ready(app);
  expect(await theme(page)).toBe('dark');
  await page.getByTestId('settings-btn').click();
  await page.getByTestId('theme-select').selectOption('light');
  await expect.poll(() => theme(page)).toBe('light');
  await page.getByTestId('notifications-check').uncheck();
  await app.close();

  app = await launch(dataDir);
  page = await ready(app);
  await expect.poll(() => theme(page)).toBe('light');
  await page.getByTestId('settings-btn').click();
  await expect(page.getByTestId('notifications-check')).not.toBeChecked();
  await app.close();
  const db = new DatabaseSync(join(dataDir, 'nave.db'));
  expect(db.prepare("SELECT value FROM settings WHERE key = 'theme'").get()).toEqual({ value: '"light"' });
  db.close();
});

test('Command Center: resumen de todos los proyectos y salto a uno', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'nave-e2e-'));
  const app = await launch(dataDir);
  const page = await ready(app);
  await createProject(page, 'Alfa');
  await page.getByTestId('task-input').fill('Una');
  await page.getByTestId('task-add-btn').click();
  await page.getByTestId('task-input').fill('Dos');
  await page.getByTestId('task-add-btn').click();
  await page.getByTestId('task-status').first().click(); // pendiente -> en curso
  await createProject(page, 'Beta');

  await page.getByTestId('center-btn').click();
  await expect(page.getByTestId('command-center')).toBeVisible();
  await expect(page.getByTestId('center-card')).toHaveCount(2);
  const alfa = page.getByTestId('center-card').filter({ hasText: 'Alfa' });
  await expect(alfa.getByTestId('center-tasks')).toHaveText('2 tareas abiertas (1 en curso)');
  await expect(page.getByTestId('center-card').filter({ hasText: 'Beta' }).getByTestId('center-tasks')).toHaveText('0 tareas abiertas (0 en curso)');
  await expect(page.getByTestId('center-card').filter({ hasText: 'Beta' }).getByTestId('center-review')).toHaveText('0 pendientes de revisar en el Brain');
  await expect(page.getByTestId('center-calm')).toBeVisible();

  await alfa.click();
  await expect(page.getByTestId('command-center')).toHaveCount(0);
  await expect(page.getByTestId('task')).toHaveCount(2);
  await app.close();
});

test('búsqueda global (Ctrl+K): encuentra en otros proyectos y navega hasta el resultado', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'nave-e2e-'));
  const app = await launch(dataDir);
  const page = await ready(app);
  await createProject(page, 'Tienda');
  await page.getByTestId('task-input').fill('Revisar proveedores de gorras');
  await page.getByTestId('task-add-btn').click();
  await page.getByTestId('tab-brain').click();
  await page.getByTestId('brain-new-title').fill('Criterio de margen');
  await page.getByTestId('brain-add').click();
  await createProject(page, 'La Nave');

  await page.keyboard.press('Control+k');
  await page.getByTestId('global-search-input').fill('gorras');
  await expect(page.getByTestId('global-search-item')).toHaveCount(1);
  await expect(page.getByTestId('global-search-item')).toContainText('Tarea');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('board-title')).toContainText('Tienda');
  await expect(page.getByTestId('task')).toContainText('Revisar proveedores de gorras');

  // Un resultado del Brain abre el nodo directamente, y el texto hostil no rompe la búsqueda.
  await page.keyboard.press('Control+k');
  await page.getByTestId('global-search-input').fill('margen');
  await page.getByTestId('global-search-item').filter({ hasText: 'Brain' }).click();
  await expect(page.getByTestId('brain-title')).toHaveValue('Criterio de margen');
  await page.keyboard.press('Control+k');
  await page.getByTestId('global-search-input').fill('" ( NOT * % _ ' + String.fromCharCode(92)); // comillas, operadores, comodines y una barra invertida
  await expect(page.getByTestId('error-toast')).toHaveCount(0);
  await app.close();
});

test('la ventana recuerda su tamaño y posición', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'nave-e2e-'));
  let app = await launch(dataDir);
  await ready(app);
  await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0]?.setBounds({ x: 40, y: 30, width: 1111, height: 703 }));
  await new Promise((resolve) => setTimeout(resolve, 900)); // el guardado va con retardo
  await app.close();
  const db = new DatabaseSync(join(dataDir, 'nave.db'));
  const saved = JSON.parse((db.prepare("SELECT value FROM settings WHERE key = 'window'").get() as { value: string }).value) as { width: number; height: number };
  db.close();
  expect(saved).toMatchObject({ width: 1111, height: 703 });

  app = await launch(dataDir);
  await ready(app);
  const bounds = await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0]?.getBounds());
  expect(bounds).toMatchObject({ width: 1111, height: 703 });
  await app.close();
});
