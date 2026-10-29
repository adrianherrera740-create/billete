import { contextBridge } from 'electron';
import type { NaveApi } from '@nave/shared';

// F0: superficie mínima. Los canales IPC reales llegan en F1/F2 desde @nave/shared.
const api: NaveApi = { platform: process.platform };
contextBridge.exposeInMainWorld('nave', api);
