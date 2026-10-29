import type { DatabaseSync } from 'node:sqlite';
import type { EventBus, Logger } from '@nave/core';
import type { EventMap, MobileDevice, MobileStatus, PairingInfo } from '@nave/shared';
import type { Handlers } from '../handlers';
import { NaveError } from '../projects';
import type { SettingsStore } from '../settings';
import { Devices, Pairing, RateLimiter } from './auth';
import { MobileServer } from './server';
import type { Tailscale } from './tailscale';

export const DEFAULT_MOBILE_PORT = 47831;

export interface MobileServiceDeps {
  db: DatabaseSync;
  bus: EventBus<EventMap>;
  settings: SettingsStore;
  log: Logger;
  tailscale: Tailscale;
  staticDir: string | null;
  /** Los manejadores se piden al usarlos porque se construyen después que este servicio. */
  handlers(): Handlers;
  onError(error: unknown): void;
  now?: () => number;
}

/** Une todo el acceso móvil: activar o apagar, puerto estable, emparejar, publicar con Tailscale y gestionar móviles. */
export class MobileService {
  readonly pairing: Pairing;
  readonly devices: Devices;
  private server: MobileServer | undefined;
  private tailnetName: string | null = null;

  constructor(private readonly deps: MobileServiceDeps) {
    this.pairing = new Pairing(deps.now);
    this.devices = new Devices(deps.db);
  }

  get enabled(): boolean {
    return this.deps.settings.raw('mobile.enabled') === true;
  }

  private get published(): boolean {
    return this.deps.settings.raw('mobile.published') === true;
  }

  private preferredPort(): number {
    const saved = this.deps.settings.raw('mobile.port');
    return typeof saved === 'number' && Number.isInteger(saved) && saved >= 1024 && saved <= 65535 ? saved : DEFAULT_MOBILE_PORT;
  }

  /** Arranca el servidor si estaba activado. Un fallo no impide que La Nave arranque: se registra y se explica en Ajustes. */
  async autostart(): Promise<void> {
    if (!this.enabled) return;
    try {
      await this.startServer();
    } catch (error) {
      this.deps.onError(error);
    }
  }

  private async startServer(): Promise<void> {
    if (this.server?.running) return;
    const server = new MobileServer({
      handlers: this.deps.handlers(),
      devices: this.devices,
      pairing: this.pairing,
      staticDir: this.deps.staticDir,
      extraHosts: () => (this.tailnetName ? [this.tailnetName] : []),
      log: this.deps.log,
      onError: this.deps.onError,
      onPaired: (device) => this.notifyPaired(device.id),
      pairLimiter: new RateLimiter(10, 60_000),
      deviceLimiter: new RateLimiter(120, 60_000)
    });
    const preferred = this.preferredPort();
    let port: number;
    try {
      port = await server.start(preferred);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EADDRINUSE') throw error;
      port = await server.start(0); // el puerto habitual está ocupado: uno libre; hay que volver a publicar
      this.deps.settings.setRaw('mobile.published', false);
    }
    if (port !== preferred) this.deps.settings.setRaw('mobile.port', port);
    this.server = server;
    this.deps.log.info('Acceso móvil activado', { puerto: port });
  }

  async setEnabled(enabled: boolean): Promise<MobileStatus> {
    this.deps.settings.setRaw('mobile.enabled', enabled);
    if (enabled) await this.startServer();
    else {
      this.pairing.cancel();
      await this.server?.stop();
      this.server = undefined;
      this.deps.log.info('Acceso móvil desactivado');
    }
    return this.status();
  }

  async stop(): Promise<void> {
    await this.server?.stop();
    this.server = undefined;
  }

  async status(): Promise<MobileStatus> {
    const tailscale = await this.deps.tailscale.status();
    this.tailnetName = tailscale.dnsName;
    const running = this.server?.running === true;
    const port = running ? (this.server?.port ?? null) : null;
    return {
      enabled: this.enabled,
      running,
      port,
      localUrl: port ? `http://127.0.0.1:${port}` : null,
      publicUrl: running && this.published && tailscale.dnsName ? `https://${tailscale.dnsName}` : null,
      tailscale
    };
  }

  /** Código nuevo y dirección para el QR. Si ya se publicó con Tailscale, la dirección es la del móvil; si no, solo vale en este PC. */
  async startPairing(): Promise<PairingInfo> {
    const status = await this.status();
    if (!status.running) throw new NaveError('VALIDATION', 'Activa primero el acceso desde el móvil en Ajustes.');
    const { code, expiresAt } = this.pairing.start();
    const base = status.publicUrl ?? status.localUrl ?? '';
    return { url: `${base}/#${code}`, expiresAt: new Date(expiresAt).toISOString(), via: status.publicUrl ? 'tailscale' : 'local' };
  }

  listDevices(): MobileDevice[] {
    return this.devices.list();
  }

  revoke(id: string): null {
    if (!this.devices.revoke(id)) throw new NaveError('NOT_FOUND', 'Ese móvil ya no está emparejado.');
    this.deps.bus.emit('mobile.revoked', { deviceId: id });
    return null;
  }

  /** Publica el servidor local con Tailscale Serve. Solo se marca como publicado si el comando termina bien. */
  async publish(): Promise<{ ok: boolean; output: string }> {
    const status = await this.status();
    if (!status.running || status.port === null) throw new NaveError('VALIDATION', 'Activa primero el acceso desde el móvil en Ajustes.');
    const result = await this.deps.tailscale.publish(status.port);
    if (result.ok) this.deps.settings.setRaw('mobile.published', true);
    return result;
  }

  /** Lo llama el servidor cuando un móvil se empareja, para avisar a la ventana del PC. */
  notifyPaired(deviceId: string): void {
    this.deps.bus.emit('mobile.paired', { deviceId });
  }
}
