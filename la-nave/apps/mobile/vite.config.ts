import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// La web del móvil se compila dentro de la app de escritorio (out/mobile), que es quien la sirve.
export default defineConfig({
  root: resolve(import.meta.dirname, 'src'),
  publicDir: resolve(import.meta.dirname, 'public'),
  plugins: [react()],
  build: { outDir: resolve(import.meta.dirname, '../desktop/out/mobile'), emptyOutDir: true }
});
