import { describe, expect, it } from 'vitest';
import { REDACTED, redactDeep, redactSecrets } from './redact';

// Secretos falsos construidos en tiempo de ejecución para no dejar patrones reales en el repositorio.
const fake = {
  anthropic: 'sk-ant-' + 'a1'.repeat(20),
  openai: 'sk-' + 'Zz9'.repeat(10),
  github: 'ghp_' + 'A1'.repeat(15),
  githubPat: 'github_pat_' + 'B2'.repeat(15),
  aws: 'AKIA' + 'ABCDEFGH12345678'.slice(0, 16),
  jwt: ['eyJ' + 'h'.repeat(12), 'p'.repeat(12), 's'.repeat(12)].join('.')
};

describe('redactSecrets (seguridad)', () => {
  it.each(Object.entries(fake))('oculta %s', (_name, secret) => {
    const out = redactSecrets(`antes ${secret} después`);
    expect(out).not.toContain(secret);
    expect(out).toContain(REDACTED);
    expect(out.startsWith('antes ')).toBe(true);
  });

  it('oculta el valor de token=, password: y Authorization Bearer', () => {
    const text = 'api_key=supersecreto123 password: "hunter22" Authorization: Bearer abcdefgh12345678';
    const out = redactSecrets(text);
    for (const leak of ['supersecreto123', 'hunter22', 'abcdefgh12345678']) expect(out).not.toContain(leak);
  });

  it('oculta la contraseña dentro de una URL y los bloques de clave privada', () => {
    const url = redactSecrets('git clone https://usuario:miclave@host.example/repo.git');
    expect(url).toContain('https://usuario:' + REDACTED + '@host.example');
    const key = '-----BEGIN OPENSSH PRIVATE KEY-----\nabcDEF\n-----END OPENSSH PRIVATE KEY-----';
    expect(redactSecrets(`x ${key} y`)).toBe(`x ${REDACTED} y`);
  });

  it('no toca texto normal', () => {
    expect(redactSecrets('Abrir el proyecto La Nave en C:\\Users\\yo')).toBe('Abrir el proyecto La Nave en C:\\Users\\yo');
  });
});

describe('redactDeep', () => {
  it('oculta claves sensibles y textos anidados, y soporta ciclos', () => {
    const obj: Record<string, unknown> = { user: 'yo', token: 'x', nested: { note: `clave ${fake.openai}` }, list: [fake.github] };
    obj['self'] = obj;
    const out = redactDeep(obj) as Record<string, unknown>;
    expect(out['token']).toBe(REDACTED);
    expect(JSON.stringify(out)).not.toContain(fake.openai);
    expect(JSON.stringify(out)).not.toContain(fake.github);
    expect(out['self']).toBe('[CIRCULAR]');
    expect(out['user']).toBe('yo');
  });

  it('redacta el mensaje y la traza de un Error', () => {
    const out = redactDeep(new Error(`fallo con ${fake.anthropic}`)) as { message: string; stack: string };
    expect(out.message).not.toContain(fake.anthropic);
    expect(out.stack).not.toContain(fake.anthropic);
  });
});
