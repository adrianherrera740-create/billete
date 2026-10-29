import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { _electron as electron, expect, test } from '@playwright/test';

test('la app arranca, crea su BD y muestra La Nave', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'nave-e2e-'));
  const app = await electron.launch({
    args: [join(__dirname, '../out/main/index.js'), ...(process.platform === 'linux' ? ['--no-sandbox'] : [])],
    env: { ...process.env, NAVE_NO_RELAUNCH: '1', NAVE_USER_DATA: dataDir }
  });
  const win = await app.firstWindow();
  await expect(win.getByTestId('app-name')).toHaveText('La Nave');
  await expect(win.getByTestId('phase')).toContainText('F0');
  expect(await win.evaluate(() => typeof (globalThis as { nave?: unknown }).nave)).toBe('object');
  // El renderer no tiene Node.
  expect(await win.evaluate(() => typeof (globalThis as { require?: unknown }).require)).toBe('undefined');
  await app.close();
  expect(existsSync(join(dataDir, 'nave.db'))).toBe(true);
  expect(readFileSync(join(dataDir, 'logs', 'app.log'), 'utf8')).toContain('Arranque del núcleo');
});
