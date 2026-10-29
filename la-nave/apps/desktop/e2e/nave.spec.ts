import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
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

async function createProject(page: Page, name: string): Promise<void> {
  await page.getByTestId('new-project-btn').click();
  await page.getByTestId('project-name-input').fill(name);
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
