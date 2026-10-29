import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { _electron as electron, expect, test } from '@playwright/test';

// Prueba la aplicación EMPAQUETADA (la que lleva el instalador), no el código de desarrollo:
//   npm run dist:dir -w @nave/desktop
//   NAVE_E2E_EXECUTABLE=apps/desktop/release/linux-unpacked/la-nave xvfb-run -a npm run test:e2e:packaged
const executable = process.env['NAVE_E2E_EXECUTABLE'];

type Bridge = { nave: { invoke(channel: string, input: unknown): Promise<unknown> } };

test('@packaged la app empaquetada arranca, guarda datos y abre una terminal real (node-pty fuera del asar)', async () => {
  test.skip(!executable, 'Define NAVE_E2E_EXECUTABLE con la ruta del ejecutable empaquetado');
  const dataDir = mkdtempSync(join(tmpdir(), 'nave-pkg-'));
  const app = await electron.launch({
    executablePath: executable as string,
    args: process.platform === 'linux' ? ['--no-sandbox'] : [],
    env: { ...process.env, NAVE_NO_RELAUNCH: '1', NAVE_USER_DATA: dataDir }
  });
  expect(await app.evaluate(({ app: electronApp }) => electronApp.isPackaged)).toBe(true);
  const page = await app.firstWindow();
  await expect(page.getByTestId('app')).toHaveAttribute('data-ready', 'true');

  await page.getByTestId('new-project-btn').click();
  await page.getByTestId('project-name-input').fill('Empaquetada');
  await page.getByTestId('create-project-btn').click();
  await page.getByTestId('add-terminal-btn').click();
  await expect(page.getByTestId('terminal')).toBeVisible();
  const panelId = (await page.getByTestId('panel').getAttribute('data-panel-id')) ?? '';
  await page.locator('.xterm-helper-textarea').focus();
  await page.keyboard.type(process.platform === 'win32' ? 'echo "hola-$(20+22)"\r' : 'echo hola-$((20+22))\n');
  await expect
    .poll(
      () =>
        page.evaluate(async (id) => {
          const res = (await (globalThis as unknown as Bridge).nave.invoke('terminal:start', { panelId: id, cols: 80, rows: 24 })) as { data?: { replay: string } };
          return res.data?.replay ?? '';
        }, panelId),
      { timeout: 15_000 }
    )
    .toContain('hola-42');
  await app.close();
});
