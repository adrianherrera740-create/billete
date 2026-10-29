import { homedir } from 'node:os';
import type { EventBus, Logger } from '@nave/core';
import type { EventMap, Panel, Project, ShellOption, TerminalEvent, TerminalStarted } from '@nave/shared';
import { NaveError } from './projects';
import type { ClaudeLaunchResult } from './claude';
import type { ShellInfo } from './shells';

export interface PtyLike {
  readonly pid: number;
  onData(listener: (data: string) => void): unknown;
  onExit(listener: (event: { exitCode: number; signal?: number | undefined }) => void): unknown;
  write(data: string): void;
  resize(cols: number, rows: number): void;
  kill(): void;
}

export type SpawnFn = (
  file: string,
  args: string[],
  options: { name: string; cols: number; rows: number; cwd: string; env: Record<string, string> }
) => PtyLike;

export interface TerminalDeps {
  getPanel(id: string): Panel;
  getProject(id: string): Project;
  shells(): ShellInfo[];
  /** Datos de arranque para los paneles `claude`; sin esto, un panel de Claude no se puede abrir. */
  claude?(panel: Panel, resume: boolean): ClaudeLaunchResult;
  spawn: SpawnFn;
  emit(event: TerminalEvent): void;
  bus: EventBus<EventMap>;
  log: Logger;
  env?: Record<string, string | undefined>;
  home?: string;
  cwdExists?(path: string): boolean;
  /** Tamaño máximo de la salida que se conserva por terminal para repintarla. */
  bufferChars?: number;
}

interface Launch {
  id: string;
  label: string;
  file: string;
  args: string[];
  extraEnv: Record<string, string>;
}

interface Running {
  pty: PtyLike;
  shell: Launch;
  cwd: string;
  tail: string;
  end: number;
}

const BLOCKED_ENV = /^(NAVE_|ELECTRON_)/;

/**
 * Terminales reales. Reglas: el renderer solo manda el id del panel; el shell y la carpeta salen de la BD;
 * la salida NO pasa por el bus, Activity ni logs (solo el ciclo de vida).
 */
export class TerminalManager {
  private readonly running = new Map<string, Running>();

  constructor(private readonly deps: TerminalDeps) {}

  shellOptions(): ShellOption[] {
    return this.deps.shells().map(({ id, label }) => ({ id, label }));
  }

  isRunning(panelId: string): boolean {
    return this.running.has(panelId);
  }

  start(panelId: string, cols: number, rows: number, resume = false): TerminalStarted {
    const panel = this.deps.getPanel(panelId);
    if (panel.kind !== 'terminal' && panel.kind !== 'claude') throw new NaveError('VALIDATION', 'Este panel no es una terminal.');

    const existing = this.running.get(panelId);
    if (existing) {
      existing.pty.resize(cols, rows);
      return { running: true, replay: existing.tail, end: existing.end, shell: existing.shell.label, cwd: existing.cwd, notice: null };
    }

    const notices: string[] = [];
    let shell: Launch;
    if (panel.kind === 'claude') {
      const result = this.deps.claude?.(panel, resume);
      if (!result) throw new NaveError('VALIDATION', 'Claude Code no está disponible en esta versión de La Nave.');
      if ('unavailable' in result) return { running: false, replay: '', end: 0, shell: 'Claude Code', cwd: '', notice: result.unavailable };
      shell = result.launch;
    } else {
      const shells = this.deps.shells();
      const wanted = typeof panel.config['shell'] === 'string' ? panel.config['shell'] : null;
      const found = shells.find((s) => s.id === wanted) ?? shells[0];
      if (!found) {
        return { running: false, replay: '', end: 0, shell: '', cwd: '', notice: 'No se ha encontrado ningún shell en este equipo. Instala PowerShell, Git Bash o WSL.' };
      }
      if (wanted !== null && found.id !== wanted) notices.push(`El shell «${wanted}» ya no está disponible; se abrió ${found.label}.`);
      shell = { ...found, extraEnv: {} };
    }

    const home = this.deps.home ?? homedir();
    const root = this.deps.getProject(panel.projectId).rootPath;
    const exists = this.deps.cwdExists ?? (() => true);
    let cwd = home;
    if (root !== null && exists(root)) cwd = root;
    else if (root !== null) notices.push('La carpeta del proyecto no existe; se abrió en tu carpeta personal.');

    const env: Record<string, string> = {};
    for (const [key, value] of Object.entries(this.deps.env ?? process.env)) {
      if (value !== undefined && !BLOCKED_ENV.test(key)) env[key] = value;
    }
    Object.assign(env, shell.extraEnv);
    env['TERM'] = 'xterm-256color';
    env['COLORTERM'] = 'truecolor';

    let pty: PtyLike;
    try {
      pty = this.deps.spawn(shell.file, shell.args, { name: 'xterm-256color', cols, rows, cwd, env });
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      this.deps.log.warn('No se pudo abrir la terminal', { shell: shell.id, motivo: reason });
      return { running: false, replay: '', end: 0, shell: shell.label, cwd, notice: `No se pudo abrir ${shell.label}: ${reason}` };
    }

    const entry: Running = { pty, shell, cwd, tail: '', end: 0 };
    this.running.set(panelId, entry);
    const limit = this.deps.bufferChars ?? 200_000;
    pty.onData((data) => {
      entry.end += data.length;
      entry.tail = (entry.tail + data).slice(-limit);
      this.deps.emit({ type: 'data', panelId, data, end: entry.end });
    });
    pty.onExit(({ exitCode }) => {
      if (this.running.get(panelId) === entry) this.running.delete(panelId);
      this.deps.log.info('Terminal terminada', { panelId, exitCode });
      this.deps.bus.emit('terminal.process_exited', { panelId, exitCode });
      this.deps.emit({ type: 'exit', panelId, exitCode });
    });
    this.deps.log.info('Terminal iniciada', { panelId, shell: shell.id, pid: pty.pid });
    this.deps.bus.emit('terminal.process_started', { panelId, shell: shell.id });
    return { running: true, replay: '', end: 0, shell: shell.label, cwd, notice: notices.length > 0 ? notices.join(' ') : null };
  }

  private entry(panelId: string): Running {
    const entry = this.running.get(panelId);
    if (!entry) throw new NaveError('NOT_FOUND', 'La terminal no está en marcha. Ciérrala y ábrela de nuevo.');
    return entry;
  }

  input(panelId: string, data: string): null {
    this.entry(panelId).pty.write(data);
    return null;
  }

  resize(panelId: string, cols: number, rows: number): null {
    this.entry(panelId).pty.resize(cols, rows);
    return null;
  }

  kill(panelId: string): null {
    const entry = this.running.get(panelId);
    if (entry) {
      this.running.delete(panelId);
      entry.pty.kill();
      this.deps.bus.emit('terminal.process_exited', { panelId, exitCode: null });
    }
    return null;
  }

  killAll(): void {
    for (const panelId of [...this.running.keys()]) this.kill(panelId);
  }
}
