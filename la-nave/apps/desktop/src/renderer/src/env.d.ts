/// <reference types="vite/client" />
import type { NaveApi } from '@nave/shared';

declare global {
  interface Window {
    readonly nave: NaveApi;
  }
}
