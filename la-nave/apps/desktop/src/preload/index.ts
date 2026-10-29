import { contextBridge, ipcRenderer } from 'electron';
import { CHANNELS, createApi } from '@nave/shared';
import type { ChannelName, ClaudeEvent, Result, TerminalEvent } from '@nave/shared';

// El preload solo deja pasar canales declarados en @nave/shared; main vuelve a validar cada entrada.
const api = createApi(
  process.platform,
  async (channel: ChannelName, input: unknown) => {
    if (!(channel in CHANNELS)) throw new Error(`Canal desconocido: ${String(channel)}`);
    return (await ipcRenderer.invoke(channel, input)) as Result<unknown>;
  },
  (handler) => {
    const listener = (_event: unknown, payload: TerminalEvent): void => handler(payload);
    ipcRenderer.on('terminal:event', listener);
    return () => {
      ipcRenderer.removeListener('terminal:event', listener);
    };
  },
  (handler) => {
    const listener = (_event: unknown, payload: ClaudeEvent): void => handler(payload);
    ipcRenderer.on('claude:event', listener);
    return () => {
      ipcRenderer.removeListener('claude:event', listener);
    };
  }
);

contextBridge.exposeInMainWorld('nave', api);
