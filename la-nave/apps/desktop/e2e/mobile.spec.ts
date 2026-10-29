import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { _electron as electron, chromium, expect, test } from '@playwright/test';
import type { ElectronApplication, Page } from '@playwright/test';

test.use({ actionTimeout: 10_000 });

const launch = (dataDir: string): Promise<ElectronApplication> =>
  electron.launch({
    args: [join(__dirname, '../out/main/index.js'), ...(process.platform === 'linux' ? ['--no-sandbox'] : [])],
    env: { ...process.env, NAVE_NO_RELAUNCH: '1', NAVE_USER_DATA: dataDir }
  });

const MOBILE_UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36';

async function pairingUrl(page: Page): Promise<string> {
  await page.getByTestId('settings-btn').click();
  await page.getByTestId('mobile-enable').click();
  await expect(page.getByTestId('mobile-enable')).toBeChecked();
  await expect(page.getByTestId('mobile-state')).toContainText('127.0.0.1');
  await page.getByTestId('mobile-pair').click();
  await expect(page.getByTestId('mobile-qr')).toBeVisible();
  return page.getByTestId('mobile-pair-url').inputValue();
}

test('móvil: se empareja por QR, crea tareas y notas que aparecen en el PC, y al revocar deja de entrar', async () => {
  test.setTimeout(90_000);
  const dataDir = mkdtempSync(join(tmpdir(), 'nave-e2e-'));
  const app = await launch(dataDir);
  const desktop = await app.firstWindow();
  await expect(desktop.getByTestId('app')).toHaveAttribute('data-ready', 'true');
  await desktop.getByTestId('new-project-btn').click();
  await desktop.getByTestId('project-name-input').fill('Tienda');
  await desktop.getByTestId('create-project-btn').click();
  await expect(desktop.getByTestId('project-item')).toHaveCount(1);

  const url = await pairingUrl(desktop);
  expect(url).toMatch(/#[0-9a-f]{32}$/);

  const browser = await chromium.launch({ ...(process.env.NAVE_E2E_CHROMIUM ? { executablePath: process.env.NAVE_E2E_CHROMIUM } : {}), args: process.platform === 'linux' ? ['--no-sandbox'] : [] });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, userAgent: MOBILE_UA, isMobile: true, hasTouch: true });
    const phone = await context.newPage();

    // Sin emparejar no hay acceso.
    await phone.goto(new URL(url).origin);
    await expect(phone.getByTestId('gate-unpaired')).toBeVisible();

    // Emparejar: el código viaja en el fragmento y desaparece de la barra.
    await phone.goto(url);
    await expect(phone.getByTestId('mobile-app')).toBeVisible();
    expect(phone.url()).not.toContain('#');
    await expect(phone.getByTestId('project-card')).toContainText('Tienda');
    await phone.screenshot({ path: join(__dirname, '../../../docs/movil-resumen.png') });

    // Captura rápida a la bandeja.
    await phone.getByTestId('capture-text').fill('idea desde el móvil');
    await phone.getByTestId('capture-save').click();
    await expect(phone.getByTestId('capture-saved')).toBeVisible();

    // Tarea desde el móvil; el PC la ve sin recargar.
    await phone.getByTestId('tab-tasks').click();
    await phone.getByTestId('task-input').fill('Llamar al proveedor');
    await phone.getByTestId('task-add').click();
    await expect(phone.getByTestId('task')).toHaveCount(1);
    await expect(desktop.getByTestId('task').filter({ hasText: 'Llamar al proveedor' })).toHaveCount(1); // llega por el aviso data:changed, sin recargar
    await phone.getByTestId('task-status').click();
    await expect(phone.getByTestId('task-status')).toContainText('En curso');
    await phone.screenshot({ path: join(__dirname, '../../../docs/movil-tareas.png') });

    // La nota de la bandeja se ve en Notas.
    await phone.getByTestId('tab-notes').click();
    await expect(phone.getByTestId('note-body').first()).toHaveValue('idea desde el móvil');

    // Un segundo contexto sin token no entra a los canales.
    const anon = await browser.newContext();
    const denied = await anon.request.post(`${new URL(url).origin}/api/rpc/project:list`, { data: { includeArchived: false } });
    expect(denied.status()).toBe(401);
    await anon.close();

    // Los canales de gestión no se ejecutan desde el móvil aunque tenga token válido.
    const token = await phone.evaluate(() => Object.values(localStorage)[0] as string);
    const forbidden = await context.request.post(`${new URL(url).origin}/api/rpc/mobile:devices`, { headers: { authorization: `Bearer ${token}` }, data: {} });
    expect(forbidden.status()).toBe(403);

    // En el PC aparece el móvil y se revoca.
    await expect(desktop.getByTestId('mobile-device')).toHaveCount(1);
    await desktop.getByTestId('mobile-revoke').click();
    await expect(desktop.getByTestId('mobile-device')).toHaveCount(0);

    await phone.getByTestId('tab-tasks').click();
    await expect(phone.getByTestId('gate-revoked')).toBeVisible();
    await phone.screenshot({ path: join(__dirname, '../../../docs/movil-revocado.png') });
    await context.close();
  } finally {
    await browser.close();
    await app.close();
  }
});
