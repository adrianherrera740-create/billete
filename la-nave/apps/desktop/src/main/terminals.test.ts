import { describe, expect, it } from 'vitest';
import { EventBus, createLogger, createMemorySink } from '@nave/core';
import type { EventMap, Panel, Project, TerminalEvent } from '@nave/shared';
import { NaveError } from './projects';
import type { ShellInfo } from './shells';
import { TerminalManager } from './terminals';
import type { PtyLike, SpawnFn } from './terminals';

class FakePty implements PtyLike {
  pid = 4242;
  written: string[] = [];
  size = { cols: 0, rows: 0 };
  killed = false;
  private dataListeners: Array<(d: string) => void> = [];
  private exitListeners: Array<(e: { exitCode: number }) => void> = [];
  onData(l: (d: string) => void): void { this.dataListeners.push(l); }
  onExit(l: (e: { exitCode: number }) => void): void { this.exitListeners.push(l); }
  write(d: string): void { this.written.push(d); }
  resize(cols: number, rows: number): void { this.size = { cols, rows }; }
  kill(): void { this.killed = true; }
  output(d: string): void { this.dataListeners.forEach((l) => l(d)); }
  exit(code: number): void { this.exitListeners.forEach((l) => l({ exitCode: code })); }
}

const SHELLS: ShellInfo[] = [
  { id: 'powershell', label: 'Windows PowerShell', file: 'C:\\ps.exe', args: ['-NoLogo'] },
  { id: 'cmd', label: 'CMD', file: 'C:\\cmd.exe', args: [] }
];

function setup(options: { panel?: Partial<Panel>; rootPath?: string | null; cwdExists?: boolean; shells?: ShellInfo[]; spawnThrows?: boolean } = {}) {
  const ptys: FakePty[] = [];
  const calls: Array<{ file: string; args: string[]; cwd: string; env: Record<string, string> }> = [];
  const spawn: SpawnFn = (file, args, o) => {
    if (options.spawnThrows) throw new Error('ConPTY no disponible');
    calls.push({ file, args, cwd: o.cwd, env: o.env });
    const p = new FakePty();
    ptys.push(p);
    return p;
  };
  const panel: Panel = { id: 'p1', boardId: 'b', projectId: 'pr', kind: 'terminal', title: 'T', x: 0, y: 0, w: 600, h: 400, z: 1, config: {}, hostId: null, ...options.panel };
  const project = { id: 'pr', rootPath: options.rootPath === undefined ? 'C:\\Proyectos\\app' : options.rootPath } as Project;
  const bus = new EventBus<EventMap>();
  const busEvents: string[] = [];
  bus.on('terminal.process_started', () => busEvents.push('started'));
  bus.on('terminal.process_exited', (e) => busEvents.push(`exited:${e.exitCode}`));
  const sink = createMemorySink();
  const pushed: TerminalEvent[] = [];
  const manager = new TerminalManager({
    getPanel: (id) => { if (id !== panel.id) throw new NaveError('NOT_FOUND', 'no existe'); return panel; },
    getProject: () => project,
    shells: () => options.shells ?? SHELLS,
    spawn,
    emit: (e) => pushed.push(e),
    bus,
    log: createLogger('terminals', sink),
    env: { PATH: 'x', HOME: 'h', NAVE_USER_DATA: 'secreto', ELECTRON_RUN_AS_NODE: '1' },
    home: 'C:\\Users\\yo',
    cwdExists: () => options.cwdExists ?? true
  });
  return { manager, ptys, calls, busEvents, sink, pushed };
}

describe('TerminalManager', () => {
  it('abre el shell elegido en el panel, en la carpeta del proyecto, con entorno limpio', () => {
    const { manager, calls, busEvents } = setup({ panel: { config: { shell: 'cmd' } } });
    const res = manager.start('p1', 100, 30);
    expect(res).toMatchObject({ running: true, shell: 'CMD', cwd: 'C:\\Proyectos\\app', notice: null });
    expect(calls[0]).toMatchObject({ file: 'C:\\cmd.exe', cwd: 'C:\\Proyectos\\app' });
    expect(calls[0]?.env['TERM']).toBe('xterm-256color');
    expect(calls[0]?.env['NAVE_USER_DATA']).toBeUndefined();
    expect(calls[0]?.env['ELECTRON_RUN_AS_NODE']).toBeUndefined();
    expect(calls[0]?.env['PATH']).toBe('x');
    expect(busEvents).toEqual(['started']);
  });

  it('shell desconocido: usa el primero y avisa; carpeta inexistente: usa la personal y avisa', () => {
    const { manager, calls } = setup({ panel: { config: { shell: 'fish' } }, cwdExists: false });
    const res = manager.start('p1', 80, 24);
    expect(calls[0]?.file).toBe('C:\\ps.exe');
    expect(calls[0]?.cwd).toBe('C:\\Users\\yo');
    expect(res.notice).toContain('«fish» ya no está disponible');
    expect(res.notice).toContain('carpeta del proyecto no existe');
  });

  it('un panel que no es terminal se rechaza', () => {
    const { manager } = setup({ panel: { kind: 'sticky' } });
    expect(() => manager.start('p1', 80, 24)).toThrow(/no es una terminal/);
  });

  it('sin ningún shell o si el spawn falla devuelve un aviso claro, sin lanzar', () => {
    expect(setup({ shells: [] }).manager.start('p1', 80, 24)).toMatchObject({ running: false, notice: expect.stringContaining('ningún shell') });
    const failing = setup({ spawnThrows: true }).manager.start('p1', 80, 24);
    expect(failing).toMatchObject({ running: false, notice: expect.stringContaining('ConPTY no disponible') });
  });

  it('entrada, tamaño y cierre; escribir en una terminal parada da un error claro', () => {
    const { manager, ptys, busEvents } = setup();
    manager.start('p1', 80, 24);
    manager.input('p1', 'dir\r');
    manager.resize('p1', 120, 40);
    expect(ptys[0]?.written).toEqual(['dir\r']);
    expect(ptys[0]?.size).toEqual({ cols: 120, rows: 40 });
    manager.kill('p1');
    expect(ptys[0]?.killed).toBe(true);
    expect(busEvents).toEqual(['started', 'exited:null']);
    expect(() => manager.input('p1', 'x')).toThrow(/no está en marcha/);
  });

  it('SEGURIDAD: la salida de la terminal no llega a logs ni al bus; solo al renderer', () => {
    const { manager, ptys, sink, busEvents, pushed } = setup();
    manager.start('p1', 80, 24);
    ptys[0]?.output('password: hunter2-SECRETO\r\n');
    expect(sink.lines.join('\n')).not.toContain('hunter2');
    expect(busEvents.join()).not.toContain('hunter2');
    expect(pushed).toEqual([{ type: 'data', panelId: 'p1', data: 'password: hunter2-SECRETO\r\n', end: 27 }]);
  });

  it('volver a abrir un panel en marcha devuelve la salida acumulada y su desplazamiento', () => {
    const { manager, ptys, calls } = setup();
    manager.start('p1', 80, 24);
    ptys[0]?.output('hola ');
    ptys[0]?.output('mundo');
    const again = manager.start('p1', 90, 30);
    expect(again).toMatchObject({ running: true, replay: 'hola mundo', end: 10 });
    expect(calls).toHaveLength(1);
    expect(ptys[0]?.size).toEqual({ cols: 90, rows: 30 });
  });

  it('el búfer conserva solo el final de la salida', () => {
    const { manager, ptys } = setup();
    manager.start('p1', 80, 24);
    ptys[0]?.output('x'.repeat(250_000));
    const res = manager.start('p1', 80, 24);
    expect(res.replay.length).toBe(200_000);
    expect(res.end).toBe(250_000);
  });

  it('al terminar el proceso se avisa, se libera y se puede volver a arrancar', () => {
    const { manager, ptys, busEvents, pushed } = setup();
    manager.start('p1', 80, 24);
    ptys[0]?.exit(3);
    expect(manager.isRunning('p1')).toBe(false);
    expect(pushed.at(-1)).toEqual({ type: 'exit', panelId: 'p1', exitCode: 3 });
    expect(busEvents).toEqual(['started', 'exited:3']);
    expect(manager.start('p1', 80, 24).running).toBe(true);
    expect(ptys).toHaveLength(2);
  });

  it('killAll cierra todas', () => {
    const { manager, ptys } = setup();
    manager.start('p1', 80, 24);
    manager.killAll();
    expect(ptys[0]?.killed).toBe(true);
    expect(manager.isRunning('p1')).toBe(false);
  });
});
