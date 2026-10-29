import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { migrate, openDatabase } from '@nave/db';
import { Devices, Pairing, RateLimiter, sha256 } from './auth';

describe('Pairing (código de emparejamiento)', () => {
  it('es de 128 bits, de un solo uso y distinto cada vez', () => {
    const p = new Pairing();
    const a = p.start();
    expect(a.code).toMatch(/^[0-9a-f]{32}$/);
    expect(p.consume(a.code)).toBe(true);
    expect(p.consume(a.code)).toBe(false); // ya se usó
    expect(p.start().code).not.toBe(a.code);
  });

  it('caduca a los 5 minutos', () => {
    let t = 1_000;
    const p = new Pairing(() => t);
    const { code } = p.start();
    t += 5 * 60_000 - 1;
    expect(p.active).toBe(true);
    t += 2;
    expect(p.active).toBe(false);
    expect(p.consume(code)).toBe(false);
  });

  it('SEGURIDAD: tras 5 intentos fallidos el código se invalida aunque luego se acierte', () => {
    const p = new Pairing();
    const { code } = p.start();
    for (let i = 0; i < 4; i++) expect(p.consume('x'.repeat(32))).toBe(false);
    expect(p.active).toBe(true);
    expect(p.consume('y'.repeat(32))).toBe(false); // el 5.º fallo lo anula
    expect(p.active).toBe(false);
    expect(p.consume(code)).toBe(false);
  });

  it('rechaza entradas que no son texto, vacías o de otra longitud, y un código nuevo anula el anterior', () => {
    const p = new Pairing();
    const first = p.start();
    for (const bad of [undefined, null, 5, {}, '', 'abc', first.code + '0']) expect(p.consume(bad)).toBe(false);
    const second = p.start();
    expect(p.consume(first.code)).toBe(false);
    expect(p.consume(second.code)).toBe(true);
  });
});

function devices() {
  const db = openDatabase(join(mkdtempSync(join(tmpdir(), 'nave-dev-')), 'nave.db'));
  migrate(db);
  let t = Date.UTC(2026, 9, 29, 10, 0, 0);
  const now = () => new Date(t);
  return { db, devices: new Devices(db, now), advance: (ms: number) => (t += ms) };
}

describe('Devices (móviles emparejados)', () => {
  it('SEGURIDAD: el token tiene 256 bits y en la BD solo está su hash', () => {
    const { db, devices: d } = devices();
    const { device, token } = d.add('Mi móvil');
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    const row = db.prepare('SELECT token_hash FROM mobile_devices').get() as { token_hash: string };
    expect(row.token_hash).toBe(sha256(token));
    expect(row.token_hash).not.toContain(token);
    expect(JSON.stringify(db.prepare('SELECT * FROM mobile_devices').all())).not.toContain(token);
    expect(device).toMatchObject({ name: 'Mi móvil', revokedAt: null, lastSeenAt: null });
  });

  it('autentica con el token correcto y no con otros', () => {
    const { devices: d } = devices();
    const { device, token } = d.add('A');
    expect(d.authenticate(token)?.id).toBe(device.id);
    for (const bad of ['', 'corto', token + 'x', token.slice(0, -1) + (token.endsWith('A') ? 'B' : 'A'), 'x'.repeat(500)]) expect(d.authenticate(bad)).toBeNull();
    expect(d.authenticate(undefined as unknown as string)).toBeNull();
  });

  it('revocar corta el acceso al instante y no se puede revocar dos veces', () => {
    const { devices: d } = devices();
    const { device, token } = d.add('A');
    expect(d.revoke(device.id)).toBe(true);
    expect(d.authenticate(token)).toBeNull();
    expect(d.revoke(device.id)).toBe(false);
    expect(d.list()[0]?.revokedAt).not.toBeNull();
  });

  it('anota la última vez vista, como mucho una vez por minuto', () => {
    const { db, devices: d, advance } = devices();
    const { token } = d.add('A');
    d.authenticate(token);
    const first = (db.prepare('SELECT last_seen_at AS t FROM mobile_devices').get() as { t: string }).t;
    advance(30_000);
    d.authenticate(token);
    expect((db.prepare('SELECT last_seen_at AS t FROM mobile_devices').get() as { t: string }).t).toBe(first);
    advance(40_000);
    d.authenticate(token);
    expect((db.prepare('SELECT last_seen_at AS t FROM mobile_devices').get() as { t: string }).t).not.toBe(first);
  });

  it('limpia el nombre: sin caracteres de control, con tope y con valor por defecto', () => {
    const { devices: d } = devices();
    expect(d.add('  Pixel\u0007 9  ').device.name).toBe('Pixel 9');
    expect(d.add('x'.repeat(100)).device.name).toHaveLength(40);
    expect(d.add('   ').device.name).toBe('Móvil');
  });
});

describe('RateLimiter', () => {
  it('permite N por ventana, bloquea el exceso y se recupera; cada clave va aparte', () => {
    let t = 0;
    const r = new RateLimiter(3, 1000, () => t);
    expect([r.allow('a'), r.allow('a'), r.allow('a'), r.allow('a')]).toEqual([true, true, true, false]);
    expect(r.allow('b')).toBe(true);
    t += 1001;
    expect(r.allow('a')).toBe(true);
  });
});
