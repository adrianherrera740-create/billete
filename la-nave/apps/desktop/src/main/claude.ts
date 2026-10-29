import { randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { closeSync, existsSync, lstatSync, mkdirSync, openSync, readFileSync, readSync, readdirSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import { delimiter, join, sep } from 'node:path';
import type { DatabaseSync } from 'node:sqlite';
import { redactSecrets } from '@nave/core';
import type { EventBus, Logger } from '@nave/core';
import type { ClaudeEvent, ClaudeState, ClaudeStatus, EventMap, HistoryEntry, Panel } from '@nave/shared';
import { NaveError } from './projects';

/** Los hooks solo OBSERVAN: este es el conjunto cerrado de eventos que se escuchan. */
export const HOOK_EVENTS = ['SessionStart', 'UserPromptSubmit', 'Notification', 'Stop', 'SessionEnd'] as const;
export type HookEvent = (typeof HOOK_EVENTS)[number];

export const STATE_BY_EVENT: Record<HookEvent, ClaudeState> = {
  SessionStart: 'idle',
  UserPromptSubmit: 'working',
  Notification: 'waiting',
  Stop: 'idle',
  SessionEnd: 'ended'
};

/** Nunca se pasa ninguna de estas opciones a `claude`, venga de donde venga. */
export const FORBIDDEN_ARGS = ['--dangerously-skip-permissions', '--allow-dangerously-skip-permissions'];

const ID = /^[A-Za-z0-9-]{8,64}$/;
const MAX_BODY = 256 * 1024;

export interface HookPayload {
  event: HookEvent;
  sessionId: string | null;
  transcriptPath: string | null;
}

/**
 * Servidor local que recibe los hooks de Claude. Solo 127.0.0.1, token obligatorio en cabecera,
 * sin CORS: rechaza cualquier petición con `Origin` (un navegador) o con un `Host` que no sea el nuestro.
 */
export class HookServer {
  readonly token = randomBytes(32).toString('hex');
  port = 0;
  private server: Server | undefined;

  constructor(
    private readonly isKnownPanel: (panelId: string) => boolean,
    private readonly onHook: (panelId: string, payload: HookPayload) => void
  ) {}

  async start(): Promise<number> {
    const server = createServer((req, res) => this.handle(req, res));
    this.server = server;
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    const address = server.address();
    this.port = typeof address === 'object' && address ? address.port : 0;
    return this.port;
  }

  stop(): Promise<void> {
    const server = this.server;
    this.server = undefined;
    if (!server) return Promise.resolve();
    return new Promise((resolve) => {
      server.close(() => resolve());
      server.closeAllConnections();
    });
  }

  private tokenOk(header: string | undefined): boolean {
    const expected = Buffer.from(`Bearer ${this.token}`);
    const given = Buffer.from(header ?? '');
    return given.length === expected.length && timingSafeEqual(given, expected);
  }

  private reply(res: ServerResponse, status: number): void {
    res.writeHead(status, { 'Cache-Control': 'no-store' });
    res.end();
  }

  private handle(req: IncomingMessage, res: ServerResponse): void {
    if (req.headers.origin !== undefined) return this.reply(res, 403);
    if (req.headers.host !== `127.0.0.1:${this.port}`) return this.reply(res, 403);
    const match = /^\/hook\/([A-Za-z0-9-]{1,64})$/.exec(req.url ?? '');
    if (req.method !== 'POST' || !match) return this.reply(res, 404);
    if (!this.tokenOk(req.headers.authorization)) return this.reply(res, 401);
    const panelId = match[1] ?? '';
    if (!this.isKnownPanel(panelId)) return this.reply(res, 404);

    const chunks: Buffer[] = [];
    let size = 0;
    let tooBig = false;
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        tooBig = true;
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('close', () => {
      if (tooBig && !res.writableEnded) this.reply(res, 413);
    });
    req.on('end', () => {
      let body: unknown;
      try {
        body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      } catch {
        return this.reply(res, 400);
      }
      const data = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>;
      const event = data['hook_event_name'];
      if (typeof event !== 'string' || !(HOOK_EVENTS as readonly string[]).includes(event)) return this.reply(res, 400);
      const sessionId = typeof data['session_id'] === 'string' && ID.test(data['session_id']) ? data['session_id'] : null;
      const transcriptPath = typeof data['transcript_path'] === 'string' && data['transcript_path'].length <= 500 ? data['transcript_path'] : null;
      this.onHook(panelId, { event: event as HookEvent, sessionId, transcriptPath });
      this.reply(res, 204);
    });
  }
}

export interface ClaudeLaunch {
  file: string;
  args: string[];
  label: string;
  id: string;
  extraEnv: Record<string, string>;
}
export type ClaudeLaunchResult = { launch: ClaudeLaunch } | { unavailable: string };

export interface ClaudeDeps {
  db: DatabaseSync;
  bus: EventBus<EventMap>;
  log: Logger;
  dataDir: string;
  home: string;
  env: Record<string, string | undefined>;
  platform: NodeJS.Platform;
  exists(path: string): boolean;
  emit(event: ClaudeEvent): void;
  getPanel(id: string): Panel;
}

interface SessionRow {
  session_id: string;
  state: string;
  transcript_path: string | null;
}

const MISSING =
  'No se ha encontrado Claude Code («claude») en este equipo. Instálalo desde https://code.claude.com/docs y reinicia La Nave.';

export class ClaudeService {
  readonly hooks: HookServer;

  constructor(private readonly deps: ClaudeDeps) {
    this.hooks = new HookServer(
      (panelId) => {
        try {
          return this.deps.getPanel(panelId).kind === 'claude';
        } catch {
          return false;
        }
      },
      (panelId, payload) => this.handleHook(panelId, payload)
    );
  }

  async start(): Promise<void> {
    await this.hooks.start();
  }

  async stop(): Promise<void> {
    await this.hooks.stop();
  }

  /** `NAVE_CLAUDE_BIN` (para pruebas) o el primer `claude` del PATH. */
  findBinary(): string | null {
    const forced = this.deps.env['NAVE_CLAUDE_BIN'];
    if (forced) return this.deps.exists(forced) ? forced : null;
    const names = this.deps.platform === 'win32' ? ['claude.exe', 'claude.cmd', 'claude.bat'] : ['claude'];
    for (const dir of (this.deps.env['PATH'] ?? '').split(delimiter)) {
      if (!dir) continue;
      for (const name of names) {
        const candidate = join(dir, name);
        if (this.deps.exists(candidate)) return candidate;
      }
    }
    return null;
  }

  private session(panelId: string): SessionRow | null {
    return (this.deps.db.prepare('SELECT session_id, state, transcript_path FROM claude_sessions WHERE panel_id = ?').get(panelId) as unknown as SessionRow | undefined) ?? null;
  }

  private save(panelId: string, sessionId: string, state: ClaudeState, transcriptPath: string | null): void {
    this.deps.db
      .prepare(
        `INSERT INTO claude_sessions (panel_id, session_id, state, transcript_path, updated_at) VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(panel_id) DO UPDATE SET session_id = excluded.session_id, state = excluded.state,
           transcript_path = COALESCE(excluded.transcript_path, claude_sessions.transcript_path), updated_at = excluded.updated_at`
      )
      .run(panelId, sessionId, state, transcriptPath, new Date().toISOString());
  }

  private publish(panelId: string, state: ClaudeState, sessionId: string | null): void {
    this.deps.bus.emit('claude.session_state_changed', { panelId, state });
    this.deps.emit({ type: 'claude-state', panelId, state, sessionId });
  }

  /** Datos de arranque del `claude` real para un panel. Nunca lleva opciones que salten permisos. */
  launch = (panel: Panel, resume: boolean): ClaudeLaunchResult => {
    const bin = this.findBinary();
    if (!bin) return { unavailable: MISSING };
    const previous = this.session(panel.id);
    if (resume && !previous) return { unavailable: 'No hay una sesión anterior de este panel que reanudar.' };
    const sessionId = resume && previous ? previous.session_id : randomUUID();

    const dir = join(this.deps.dataDir, 'claude');
    mkdirSync(dir, { recursive: true });
    const settingsPath = join(dir, `settings-${panel.id}.json`);
    // El token NO va en este archivo ni en la línea de comandos: el hook lo lee de la variable de entorno del proceso.
    const command = `curl -s -m 3 -o /dev/null -X POST -H "Authorization: Bearer $NAVE_HOOK_TOKEN" -H "Content-Type: application/json" --data-binary @- http://127.0.0.1:${this.hooks.port}/hook/${panel.id} || true`;
    const hooks = Object.fromEntries(HOOK_EVENTS.map((event) => [event, [{ hooks: [{ type: 'command', command }] }]]));
    writeFileSync(settingsPath, JSON.stringify({ hooks }, null, 2), 'utf8');

    const args = ['--settings', settingsPath, resume ? '--resume' : '--session-id', sessionId];
    if (args.some((arg) => FORBIDDEN_ARGS.includes(arg))) throw new Error('Opción de Claude no permitida');
    let file = bin;
    let finalArgs = args;
    if (this.deps.platform === 'win32' && /\.(cmd|bat)$/i.test(bin)) {
      file = this.deps.env['ComSpec'] ?? 'cmd.exe';
      finalArgs = ['/c', bin, ...args];
    }
    this.save(panel.id, sessionId, 'unknown', null);
    this.publish(panel.id, 'unknown', sessionId);
    return { launch: { file, args: finalArgs, label: resume ? 'Claude Code (reanudada)' : 'Claude Code', id: 'claude', extraEnv: { NAVE_HOOK_TOKEN: this.hooks.token, NAVE_PANEL_ID: panel.id } } };
  };

  private handleHook(panelId: string, payload: HookPayload): void {
    const current = this.session(panelId);
    const sessionId = payload.sessionId ?? current?.session_id ?? null;
    if (!sessionId) return;
    const state = STATE_BY_EVENT[payload.event];
    const unchanged = current?.state === state && current.session_id === sessionId;
    this.save(panelId, sessionId, state, payload.transcriptPath);
    if (unchanged) return; // la ruta del historial se actualiza, pero no se avisa de un estado que no cambió
    // El contenido de los hooks (prompts, herramientas) no se registra: solo el nombre del evento.
    this.deps.log.info('Hook de Claude', { panelId, evento: payload.event, estado: state });
    this.publish(panelId, state, sessionId);
  }

  /** Cuando el proceso termina (cierre, error), la sesión queda como terminada aunque no llegue SessionEnd. */
  markEnded(panelId: string): void {
    const current = this.session(panelId);
    if (!current || current.state === 'ended') return;
    this.save(panelId, current.session_id, 'ended', null);
    this.publish(panelId, 'ended', current.session_id);
  }

  status(panelId: string, running: boolean): ClaudeStatus {
    const current = this.session(panelId);
    const available = this.findBinary() !== null;
    return {
      panelId,
      state: (current?.state as ClaudeState | undefined) ?? 'unknown',
      sessionId: current?.session_id ?? null,
      available,
      running,
      notice: available ? null : MISSING
    };
  }

  /** Historial de la sesión en SOLO LECTURA, dentro de ~/.claude/projects y sin seguir enlaces simbólicos. */
  history(panelId: string): HistoryEntry[] {
    const current = this.session(panelId);
    if (!current) return [];
    const root = join(this.deps.home, '.claude', 'projects');
    if (!this.deps.exists(root)) return [];
    const realRoot = realpathSync(root);
    const path = current.transcript_path ?? this.findTranscript(realRoot, current.session_id);
    if (!path) return [];
    let real: string;
    try {
      if (lstatSync(path).isSymbolicLink()) throw new Error('enlace simbólico');
      real = realpathSync(path);
    } catch {
      return [];
    }
    if (!real.startsWith(realRoot + sep) || !real.endsWith('.jsonl')) {
      throw new NaveError('VALIDATION', 'El historial de esta sesión está fuera de la carpeta de Claude y no se abre.');
    }
    return parseTranscript(readTail(real, 5 * 1024 * 1024));
  }

  private findTranscript(realRoot: string, sessionId: string): string | null {
    if (!ID.test(sessionId)) return null;
    for (const folder of readdirSync(realRoot)) {
      const candidate = join(realRoot, folder, `${sessionId}.jsonl`);
      if (existsSync(candidate)) return candidate;
    }
    return null;
  }
}

function readTail(path: string, maxBytes: number): string {
  const size = statSync(path).size;
  if (size <= maxBytes) return readFileSync(path, 'utf8');
  const fd = openSync(path, 'r');
  try {
    const buffer = Buffer.alloc(maxBytes);
    readSync(fd, buffer, 0, maxBytes, size - maxBytes);
    const text = buffer.toString('utf8');
    return text.slice(text.indexOf('\n') + 1); // la primera línea puede estar cortada
  } finally {
    closeSync(fd);
  }
}

/** Lector tolerante del .jsonl de Claude: ignora líneas rotas y tipos que no conoce. Últimos 50 mensajes con texto. */
export function parseTranscript(text: string, limit = 50, maxChars = 2000): HistoryEntry[] {
  const entries: HistoryEntry[] = [];
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    let row: unknown;
    try {
      row = JSON.parse(line);
    } catch {
      continue;
    }
    if (typeof row !== 'object' || row === null) continue;
    const record = row as { type?: unknown; message?: { role?: unknown; content?: unknown } };
    if (record.type !== 'user' && record.type !== 'assistant') continue;
    const content = record.message?.content;
    let body = '';
    if (typeof content === 'string') body = content;
    else if (Array.isArray(content)) {
      body = content
        .map((block) => (typeof block === 'object' && block !== null && (block as { type?: unknown }).type === 'text' ? String((block as { text?: unknown }).text ?? '') : ''))
        .filter(Boolean)
        .join('\n');
    }
    body = body.trim();
    if (!body) continue;
    entries.push({ role: record.type, text: redactSecrets(body.length > maxChars ? `${body.slice(0, maxChars)}…` : body) });
  }
  return entries.slice(-limit);
}
