import { join } from 'node:path';
import { _electron as electron, expect, test } from '@playwright/test';

test('la app arranca y muestra La Nave', async () => {
  const app = await electron.launch({
    args: [join(__dirname, '../out/main/index.js'), ...(process.platform === 'linux' ? ['--no-sandbox'] : [])],
    env: { ...process.env, NAVE_NO_RELAUNCH: '1' }
  });
  const win = await app.firstWindow();
  await expect(win.getByTestId('app-name')).toHaveText('La Nave');
  await expect(win.getByTestId('phase')).toContainText('F0');
  expect(await win.evaluate(() => typeof (globalThis as { nave?: unknown }).nave)).toBe('object');
  // El renderer no tiene Node.
  expect(await win.evaluate(() => typeof (globalThis as { require?: unknown }).require)).toBe('undefined');
  await app.close();
});
