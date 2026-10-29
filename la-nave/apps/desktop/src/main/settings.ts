import type { DatabaseSync } from 'node:sqlite';
import type { EventBus } from '@nave/core';
import { DEFAULT_SETTINGS, THEMES } from '@nave/shared';
import type { ChannelInput, EventMap, Settings } from '@nave/shared';

function parse(text: string | undefined): unknown {
  if (text === undefined) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

/** Ajustes en la tabla `settings`. Lo que haya guardado y no sea válido se ignora y se usa el valor por defecto. */
export class SettingsStore {
  constructor(
    private readonly db: DatabaseSync,
    private readonly bus: EventBus<EventMap>,
    private readonly now: () => Date = () => new Date()
  ) {}

  /** Valor crudo (para claves internas como el estado de la ventana, que no pasan por `parseSettingsPatch`). */
  raw(key: string): unknown {
    const row = this.db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as unknown as { value: string } | undefined;
    return parse(row?.value);
  }

  setRaw(key: string, value: unknown): void {
    this.db
      .prepare('INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at')
      .run(key, JSON.stringify(value), this.now().toISOString());
  }

  get(): Settings {
    const theme = this.raw('theme');
    const notifications = this.raw('notifications');
    const sideOpen = this.raw('sideOpen');
    return {
      theme: (THEMES as readonly unknown[]).includes(theme) ? (theme as Settings['theme']) : DEFAULT_SETTINGS.theme,
      notifications: typeof notifications === 'boolean' ? notifications : DEFAULT_SETTINGS.notifications,
      sideOpen: typeof sideOpen === 'boolean' ? sideOpen : DEFAULT_SETTINGS.sideOpen
    };
  }

  update(patch: ChannelInput<'settings:update'>): Settings {
    for (const [key, value] of Object.entries(patch)) {
      this.setRaw(key, value);
      this.bus.emit('settings.changed', { key });
    }
    return this.get();
  }
}
