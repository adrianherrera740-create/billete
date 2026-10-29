import { contextBridge, ipcRenderer } from 'electron';
import { CHANNELS, createApi } from '@nave/shared';
import type { ChannelName, Result } from '@nave/shared';

// El preload solo deja pasar canales declarados en @nave/shared; main vuelve a validar cada entrada.
const api = createApi(process.platform, async (channel: ChannelName, input: unknown) => {
  if (!(channel in CHANNELS)) throw new Error(`Canal desconocido: ${String(channel)}`);
  return (await ipcRenderer.invoke(channel, input)) as Result<unknown>;
});

contextBridge.exposeInMainWorld('nave', api);
