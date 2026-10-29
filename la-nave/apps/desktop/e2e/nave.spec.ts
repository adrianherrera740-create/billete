import { existsSync, mkdtempSync, readFileSync, realpathSync } from 'node:fs';
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
