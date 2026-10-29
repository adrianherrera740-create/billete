import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { app, BrowserWindow, Menu, nativeTheme, Notification, screen, shell } from 'electron';
import { spawn as ptySpawn } from 'node-pty';
import { APP_NAME } from '@nave/shared';
import type { ClaudeState, Theme } from '@nave/shared';
import { ClaudeService } from './claude';
import { handlersFor, registerIpc } from './ipc';
import { startCore } from './nave';
import { createNotifier } from './notifier';
import { detectShells, realDeps } from './shells';
import { TerminalManager } from './terminals';
import { restoreBounds, trackWindowState } from './windowState';
import type { NaveCore } from './nave';

const isDark = (theme: Theme): boolean => (theme === 'system' ? nativeTheme.shouldUseDarkColors : theme === 'dark');

function createWindow(current: NaveCore): BrowserWindow {
  // Posición y tamaño de la última vez, si siguen siendo alcanzables en alguna pantalla.
  const state = restoreBounds(
    current.settings.raw('window'),
    screen.getAllDisplays().map((d) => d.workArea),
    { width: 1280, height: 800 }
  );
  const win = new BrowserWindow({
    width: state.width,
    height: state.height,
    ...(state.x !== undefined && state.y !== undefined ? { x: state.x, y: state.y } : {}),
    minWidth: 960,
    minHeight: 600,
    show: false,
    title: APP_NAME,
    backgroundColor: isDark(current.settings.get().theme) ? '#0b0f17' : '#f4f6fb',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  if (state.maximized) win.maximize();
  trackWindowState(win, (saved) => current.settings.setRaw('window', saved));
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

// Un fallo inesperado se registra en vez de abrir un diálogo de error que podría bloquear el cierre de la app.
process.on('uncaughtException', (error) => core?.log.app.error('Excepción no controlada en el proceso principal', error));
process.on('unhandledRejection', (reason) => core?.log.app.error('Promesa rechazada sin tratar', reason));
let terminals: TerminalManager | undefined;
let claude: ClaudeService | undefined;

/** Solo se atienden peticiones que vienen de nuestra propia página (archivo local o servidor de desarrollo). */
function isOwnPage(event: unknown): boolean {
  const url = (event as { senderFrame?: { url?: string } }).senderFrame?.url ?? '';
  const dev = process.env['ELECTRON_RENDERER_URL'];
  return dev ? url.startsWith(dev) : url.startsWith('file://');
}

void app.whenReady().then(async () => {
  // NAVE_USER_DATA permite aislar los datos (tests e2e) sin tocar los reales.
  core = startCore(process.env['NAVE_USER_DATA'] ?? app.getPath('userData'), app.getVersion());
  const current = core;
  // En producción no hay barra de menús (evita atajos accidentales como recargar); en desarrollo se mantiene.
  if (!process.env['ELECTRON_RENDERER_URL']) Menu.setApplicationMenu(null);
  nativeTheme.themeSource = current.settings.get().theme;
  current.bus.on('settings.changed', ({ key }) => {
    if (key === 'theme') nativeTheme.themeSource = current.settings.get().theme;
  });
  const shells = detectShells(realDeps());
  const claudeService = new ClaudeService({
    db: current.db,
    bus: current.bus,
    log: current.log.app,
    dataDir: current.paths.dataDir,
    home: homedir(),
    env: process.env,
    platform: process.platform,
    exists: existsSync,
    emit: (event) => {
      for (const win of BrowserWindow.getAllWindows()) win.webContents.send('claude:event', event);
    },
    getPanel: (id) => current.projects.panel(id)
  });
  await claudeService.start();
  claude = claudeService;
  const manager = new TerminalManager({
    getPanel: (id) => current.projects.panel(id),
    getProject: (id) => current.projects.get(id),
    shells: () => shells,
    claude: claudeService.launch,
    spawn: (file, args, options) => ptySpawn(file, args, options),
    emit: (event) => {
      for (const win of BrowserWindow.getAllWindows()) win.webContents.send('terminal:event', event);
    },
    bus: current.bus,
    log: current.log.terminals,
    cwdExists: existsSync
  });
  terminals = manager;
  current.bus.on('board.panel_removed', ({ panelId }) => manager.kill(panelId));
  current.bus.on('terminal.process_exited', ({ panelId }) => claudeService.markEnded(panelId));
  const notifier = createNotifier({
    enabled: () => current.settings.get().notifications && Notification.isSupported(),
    anyWindowFocused: () => BrowserWindow.getAllWindows().some((w) => w.isFocused()),
    describe: (panelId) => {
      try {
        const panel = current.projects.panel(panelId);
        return { panel: panel.title, project: current.projects.get(panel.projectId).name };
      } catch {
        return null;
      }
    },
    show: ({ title, body }) => {
      const notification = new Notification({ title, body });
      notification.on('click', () => {
        const win = BrowserWindow.getAllWindows()[0];
        if (win) {
          if (win.isMinimized()) win.restore();
          win.focus();
        }
      });
      notification.show();
    },
    now: () => Date.now()
  });
  current.bus.on('claude.session_state_changed', ({ panelId, state }) => notifier.onState(panelId, state as ClaudeState));
  registerIpc(
    handlersFor({ projects: current.projects, terminals: manager, claude: claudeService, tasks: current.tasks, brain: current.brain, settings: current.settings, overview: current.overview, search: current.search }),
    (error) => core?.log.app.error('Fallo interno en un canal IPC', error),
    undefined,
    isOwnPage
  );
  createWindow(current);
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(current);
  });
});

app.on('before-quit', () => {
  terminals?.killAll();
  void claude?.stop();
  core?.close();
  core = undefined;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
