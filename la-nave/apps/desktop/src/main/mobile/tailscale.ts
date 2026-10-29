import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { delimiter, join } from 'node:path';

export interface TailscaleStatus {
  installed: boolean;
  running: boolean;
  /** Nombre del equipo en la red privada (sin el punto final), p. ej. `mi-pc.tail1234.ts.net`. */
  dnsName: string | null;
}

export interface TailscaleDeps {
  platform: NodeJS.Platform;
  env: Record<string, string | undefined>;
  exists(path: string): boolean;
  exec(file: string, args: string[]): Promise<{ stdout: string; stderr: string }>;
}

/**
 * Integración mínima con el CLI de Tailscale: detecta si está, lee el nombre del equipo y publica el servidor con
 * `tailscale serve` (HTTPS dentro de la red privada; NUNCA `funnel`, que lo abriría a internet).
 * NO verificado con un Tailscale real: ver ADR-002.
 */
export class Tailscale {
  constructor(private readonly deps: TailscaleDeps) {}

  findBinary(): string | null {
    const names = this.deps.platform === 'win32' ? ['tailscale.exe'] : ['tailscale'];
    for (const dir of (this.deps.env['PATH'] ?? '').split(delimiter)) {
      if (!dir) continue;
      for (const name of names) {
        const candidate = join(dir, name);
        if (this.deps.exists(candidate)) return candidate;
      }
    }
    const known = this.deps.platform === 'win32' ? [join(this.deps.env['ProgramFiles'] ?? 'C:\\Program Files', 'Tailscale', 'tailscale.exe')] : this.deps.platform === 'darwin' ? ['/Applications/Tailscale.app/Contents/MacOS/Tailscale'] : [];
    return known.find((p) => this.deps.exists(p)) ?? null;
  }

  async status(): Promise<TailscaleStatus> {
    const bin = this.findBinary();
    if (!bin) return { installed: false, running: false, dnsName: null };
    try {
      const { stdout } = await this.deps.exec(bin, ['status', '--json']);
      return parseStatus(stdout);
    } catch {
      return { installed: true, running: false, dnsName: null };
    }
  }

  /** Argumentos EXACTOS que se ejecutan (sin shell): el único dato variable es el puerto, que es un entero. */
  serveArgs(port: number): string[] {
    if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Puerto no válido');
    return ['serve', '--bg', `http://127.0.0.1:${port}`];
  }

  async publish(port: number): Promise<{ ok: boolean; output: string }> {
    const bin = this.findBinary();
    if (!bin) return { ok: false, output: 'Tailscale no está instalado en este equipo. Instálalo desde tailscale.com e inicia sesión.' };
    try {
      const { stdout, stderr } = await this.deps.exec(bin, this.serveArgs(port));
      return { ok: true, output: `${stdout}${stderr}`.trim() };
    } catch (error) {
      const e = error as { stdout?: string; stderr?: string; message?: string };
      return { ok: false, output: `${e.stderr ?? ''}${e.stdout ?? ''}`.trim() || e.message || 'No se pudo publicar con Tailscale.' };
    }
  }
}

/** Lee `tailscale status --json` de forma tolerante: si falta algo, se asume lo más prudente. */
export function parseStatus(json: string): TailscaleStatus {
  try {
    const data = JSON.parse(json) as { BackendState?: unknown; Self?: { DNSName?: unknown } };
    const dns = typeof data.Self?.DNSName === 'string' ? data.Self.DNSName.replace(/\.$/, '').toLowerCase() : null;
    const valid = dns !== null && /^[a-z0-9.-]{1,253}$/.test(dns) ? dns : null;
    return { installed: true, running: data.BackendState === 'Running', dnsName: valid };
  } catch {
    return { installed: true, running: false, dnsName: null };
  }
}

export function realTailscaleDeps(): TailscaleDeps {
  return {
    platform: process.platform,
    env: process.env,
    exists: existsSync,
    exec: (file, args) =>
      new Promise((resolve, reject) => {
        execFile(file, args, { timeout: 15_000, windowsHide: true }, (error, stdout, stderr) => (error ? reject(Object.assign(error, { stdout, stderr })) : resolve({ stdout, stderr })));
      })
  };
}
