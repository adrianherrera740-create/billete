import { createHash, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import type { DatabaseSync } from 'node:sqlite';
import type { MobileDevice } from '@nave/shared';

export const sha256 = (text: string): string => createHash('sha256').update(text).digest('hex');

/**
 * Código de emparejamiento: aleatorio de 128 bits, de un solo uso, caduca a los 5 minutos y se invalida tras 5 intentos
 * fallidos. Solo existe en memoria y mientras la persona tiene el QR a la vista; nunca se guarda.
 */
export class Pairing {
  private current: { code: string; expiresAt: number; fails: number } | null = null;

  constructor(
    private readonly now: () => number = () => Date.now(),
    private readonly ttlMs = 5 * 60_000,
    private readonly maxFails = 5
  ) {}

  /** Genera un código nuevo (anula el anterior). */
  start(): { code: string; expiresAt: number } {
    this.current = { code: randomBytes(16).toString('hex'), expiresAt: this.now() + this.ttlMs, fails: 0 };
    return { code: this.current.code, expiresAt: this.current.expiresAt };
  }

  cancel(): void {
    this.current = null;
  }

  get active(): boolean {
    return this.current !== null && this.now() < this.current.expiresAt;
  }

  /** true solo con el código vigente y exacto; lo consume. Cualquier fallo cuenta y, al llegar al máximo, invalida el código. */
  consume(candidate: unknown): boolean {
    const current = this.current;
    if (!current) return false;
    if (this.now() >= current.expiresAt) {
      this.current = null;
      return false;
    }
    const given = Buffer.from(typeof candidate === 'string' ? candidate : '');
    const expected = Buffer.from(current.code);
    const ok = given.length === expected.length && timingSafeEqual(given, expected);
    if (ok) {
      this.current = null;
      return true;
    }
    current.fails += 1;
    if (current.fails >= this.maxFails) this.current = null;
    return false;
  }
}

interface DeviceRow {
  id: string;
  name: string;
  created_at: string;
  last_seen_at: string | null;
  revoked_at: string | null;
}

const toDevice = (r: DeviceRow): MobileDevice => ({ id: r.id, name: r.name, createdAt: r.created_at, lastSeenAt: r.last_seen_at, revokedAt: r.revoked_at });

/** Móviles emparejados. El token (256 bits) solo lo conoce el móvil; aquí se guarda únicamente su hash SHA-256. */
export class Devices {
  constructor(
    private readonly db: DatabaseSync,
    private readonly now: () => Date = () => new Date()
  ) {}

  add(name: string): { device: MobileDevice; token: string } {
    const token = randomBytes(32).toString('base64url');
    const id = randomUUID();
    // eslint-disable-next-line no-control-regex
    const clean = name.replace(/[\u0000-\u001f]/g, '').trim().slice(0, 40) || 'Móvil';
    this.db.prepare('INSERT INTO mobile_devices (id, name, token_hash, created_at) VALUES (?, ?, ?, ?)').run(id, clean, sha256(token), this.now().toISOString());
    return { device: this.get(id), token };
  }

  private get(id: string): MobileDevice {
    return toDevice(this.db.prepare('SELECT * FROM mobile_devices WHERE id = ?').get(id) as unknown as DeviceRow);
  }

  /** El dispositivo dueño de ese token, o null si no existe o está revocado. Anota la última vez que se vio (como mucho 1 vez por minuto). */
  authenticate(token: string): MobileDevice | null {
    if (typeof token !== 'string' || token.length < 20 || token.length > 200) return null;
    const row = this.db.prepare('SELECT * FROM mobile_devices WHERE token_hash = ?').get(sha256(token)) as unknown as DeviceRow | undefined;
    if (!row || row.revoked_at !== null) return null;
    const stamp = this.now();
    if (!row.last_seen_at || stamp.getTime() - Date.parse(row.last_seen_at) > 60_000) {
      this.db.prepare('UPDATE mobile_devices SET last_seen_at = ? WHERE id = ?').run(stamp.toISOString(), row.id);
      row.last_seen_at = stamp.toISOString();
    }
    return toDevice(row);
  }

  list(): MobileDevice[] {
    return (this.db.prepare('SELECT * FROM mobile_devices ORDER BY created_at DESC, id').all() as unknown as DeviceRow[]).map(toDevice);
  }

  /** Revoca un móvil: su token deja de valer en la siguiente petición. */
  revoke(id: string): boolean {
    const result = this.db.prepare('UPDATE mobile_devices SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL').run(this.now().toISOString(), id);
    return Number(result.changes) > 0;
  }
}

/** Límite de peticiones por clave en una ventana deslizante. */
export class RateLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly now: () => number = () => Date.now()
  ) {}

  allow(key: string): boolean {
    const t = this.now();
    const recent = (this.hits.get(key) ?? []).filter((h) => t - h < this.windowMs);
    if (recent.length >= this.limit) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(t);
    this.hits.set(key, recent);
    return true;
  }
}
