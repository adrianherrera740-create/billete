export const REDACTED = '[REDACTED]';

const SENSITIVE_KEY = /(token|secret|password|passwd|pwd|api[_-]?key|authorization|private[_-]?key|credential|cookie)/i;

const PATTERNS: Array<[RegExp, string]> = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, REDACTED],
  [/\bsk-ant-[A-Za-z0-9_-]{8,}/g, REDACTED],
  [/\bsk-[A-Za-z0-9_-]{16,}/g, REDACTED],
  [/\bgithub_pat_[A-Za-z0-9_]{20,}/g, REDACTED],
  [/\bgh[pousr]_[A-Za-z0-9]{20,}/g, REDACTED],
  [/\bAKIA[0-9A-Z]{16}\b/g, REDACTED],
  [/\bxox[abprs]-[A-Za-z0-9-]{10,}/g, REDACTED],
  [/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g, REDACTED],
  [/(\bBearer\s+)[A-Za-z0-9._~+/=-]{8,}/gi, `$1${REDACTED}`],
  [
    /(\b(?:token|secret|password|passwd|pwd|api[_-]?key|apikey|authorization|auth[_-]?token|access[_-]?key|private[_-]?key)\b["']?\s*[:=]\s*["']?)([^\s"',;&]+)/gi,
    `$1${REDACTED}`
  ],
  [/(\b[a-z][a-z0-9+.-]*:\/\/[^\s:/@]+:)([^\s@/]+)(@)/gi, `$1${REDACTED}$3`]
];

/** Todo lo que sale de main (logs, Activity, IPC) pasa por aquí. */
export function redactSecrets(text: string): string {
  let out = text;
  for (const [pattern, replacement] of PATTERNS) out = out.replace(pattern, replacement);
  return out;
}

/** Versión para objetos: redacta valores de claves sensibles y los textos dentro de cualquier estructura. */
export function redactDeep(value: unknown, depth = 0, seen = new WeakSet<object>()): unknown {
  if (typeof value === 'string') return redactSecrets(value);
  if (value === null || typeof value !== 'object') return value;
  if (depth >= 8) return '[TRUNCATED]';
  if (seen.has(value)) return '[CIRCULAR]';
  seen.add(value);
  if (value instanceof Error) {
    return { name: value.name, message: redactSecrets(value.message), stack: redactSecrets(value.stack ?? '') };
  }
  if (Array.isArray(value)) return value.map((item) => redactDeep(item, depth + 1, seen));
  const out: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    out[key] = SENSITIVE_KEY.test(key) ? REDACTED : redactDeep(item, depth + 1, seen);
  }
  return out;
}
