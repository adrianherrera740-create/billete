import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'electron-vite';

// Los paquetes del workspace son TypeScript sin compilar: se empaquetan dentro del bundle de main.
const workspaceDeps = ['@nave/shared', '@nave/core', '@nave/db'];

export default defineConfig({
  main: {
    build: { externalizeDeps: { exclude: workspaceDeps } }
  },
  preload: {
    // Con sandbox activo el preload debe ser un único archivo autocontenido.
    build: { externalizeDeps: false }
  },
  renderer: {
    plugins: [react()],
    resolve: { alias: { '@renderer': resolve(__dirname, 'src/renderer/src') } }
  }
});
