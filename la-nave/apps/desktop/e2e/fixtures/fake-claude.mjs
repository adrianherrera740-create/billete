#!/usr/bin/env node
// Falso `claude` para los e2e (NAVE_CLAUDE_BIN). Imita lo justo del real: lee --settings, usa --session-id / --resume,
// ejecuta los hooks que La Nave le configuró (con el JSON por stdin, como hace Claude Code) y escribe un historial .jsonl.
import { spawnSync } from 'node:child_process';
import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline';

const args = process.argv.slice(2);
const value = (flag) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined);
const settings = JSON.parse(readFileSync(value('--settings'), 'utf8'));
const resumed = args.includes('--resume');
const sessionId = value('--resume') ?? value('--session-id');
const dir = join(homedir(), '.claude', 'projects', 'fake');
mkdirSync(dir, { recursive: true });
const transcript = join(dir, `${sessionId}.jsonl`);

function hook(event, extra = {}) {
  const command = settings.hooks?.[event]?.[0]?.hooks?.[0]?.command;
  if (!command) return;
  const payload = JSON.stringify({ hook_event_name: event, session_id: sessionId, transcript_path: transcript, ...extra });
  spawnSync('sh', ['-c', command], { input: payload, env: process.env, timeout: 5000 });
}
const log = (type, role, content) => appendFileSync(transcript, JSON.stringify({ type, message: { role, content } }) + '\n');

console.log(`FAKE-CLAUDE listo mode=${resumed ? 'resume' : 'new'} session=${sessionId}`);
hook('SessionStart');

const rl = createInterface({ input: process.stdin });
rl.on('line', (line) => {
  // Un pegado con bracketed paste llega con marcas ESC[200~ ... ESC[201~: se quitan, como haría el terminal de Claude.
  // eslint-disable-next-line no-control-regex
  const text = line.replace(/\x1b\[20[01]~/g, '').trim();
  if (!text) return;
  if (text === 'exit') {
    hook('SessionEnd');
    process.exit(0);
  }
  hook('UserPromptSubmit', { prompt: text });
  log('user', 'user', text);
  setTimeout(() => {
    console.log(`eco: ${text}`);
    log('assistant', 'assistant', [{ type: 'text', text: `eco: ${text}` }]);
    hook('Stop');
  }, 1500);
});
