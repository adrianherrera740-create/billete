import { join } from 'node:path';
import { app, BrowserWindow, shell } from 'electron';
import { APP_NAME } from '@nave/shared';
import { handlersFor, registerIpc } from './ipc';
import { startCore } from './nave';
import type { NaveCore } from './nave';

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    show: false,
    title: APP_NAME,
    backgroundColor: '#0b0f17',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.once('ready-to-show', () => win.show());

  // Ninguna ventana nueva dentro de la app: los enlaces http(s) salen al navegador del sistema.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//.test(url)) void shell.openExternal(url);
    return { action: 'deny' };
  });

  const devUrl = process.env['ELECTRON_RENDERER_URL'];
  if (devUrl) void win.loadURL(devUrl);
  else void win.loadFile(join(__dirname, '../renderer/index.html'));
  return win;
}

let core: NaveCore | undefined;

/** Solo se atienden peticiones que vienen de nuestra propia página (archivo local o servidor de desarrollo). */
function isOwnPage(event: unknown): boolean {
  const url = (event as { senderFrame?: { url?: string } }).senderFrame?.url ?? '';
  const dev = process.env['ELECTRON_RENDERER_URL'];
  return dev ? url.startsWith(dev) : url.startsWith('file://');
}

void app.whenReady().then(() => {
  // NAVE_USER_DATA permite aislar los datos (tests e2e) sin tocar los reales.
  core = startCore(process.env['NAVE_USER_DATA'] ?? app.getPath('userData'), app.getVersion());
  registerIpc(
    handlersFor(core.projects),
    (error) => core?.log.app.error('Fallo interno en un canal IPC', error),
    undefined,
    isOwnPage
  );
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  core?.close();
  core = undefined;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
