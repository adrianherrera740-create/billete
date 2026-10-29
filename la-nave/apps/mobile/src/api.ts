import { createApi } from '@nave/shared';
import type { ErrorCode, NaveApi, Result } from '@nave/shared';

const TOKEN_KEY = 'nave.token';

/** El almacenamiento del navegador puede fallar (modo privado, sin permisos): nunca debe romper la app. */
export const tokenStore = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* sin almacenamiento: tendrá que emparejarse de nuevo cada vez */
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* nada que borrar */
    }
  }
};

const failure = (code: ErrorCode, message: string): Result<never> => ({ ok: false, error: { code, message } });

export interface Callbacks {
  /** El servidor dijo que este móvil ya no está emparejado (401). */
  onUnauthorized(): void;
  offlineMessage: string;
}

/** Transporte por red: la misma API que usa el escritorio, pero con fetch y el token de este móvil. */
export function createMobileApi(callbacks: Callbacks, fetcher: typeof fetch = fetch): NaveApi {
  return createApi('mobile', async (channel, input) => {
    const token = tokenStore.get();
    let response: Response;
    try {
      response = await fetcher(`/api/rpc/${channel}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: input === undefined ? '' : JSON.stringify(input)
      });
    } catch {
      return failure('INTERNAL', callbacks.offlineMessage);
    }
    if (response.status === 401) {
      tokenStore.clear();
      callbacks.onUnauthorized();
    }
    try {
      return (await response.json()) as Result<unknown>;
    } catch {
      return failure('INTERNAL', callbacks.offlineMessage);
    }
  });
}

export type PairOutcome = { ok: true } | { ok: false; message: string };

/** Canjea el código del QR por el token de este móvil. */
export async function pair(code: string, name: string, fallbackMessage: string, fetcher: typeof fetch = fetch): Promise<PairOutcome> {
  try {
    const response = await fetcher('/api/pair', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, name }) });
    const body = (await response.json()) as { ok?: boolean; data?: { token?: unknown }; error?: { message?: string } };
    if (response.ok && body.ok && typeof body.data?.token === 'string') {
      tokenStore.set(body.data.token);
      return { ok: true };
    }
    return { ok: false, message: body.error?.message ?? fallbackMessage };
  } catch {
    return { ok: false, message: fallbackMessage };
  }
}

/** Nombre legible del móvil a partir del navegador (el servidor lo limpia y lo acota). */
export function deviceName(ua: string = navigator.userAgent): string {
  if (/iPhone/i.test(ua)) return 'iPhone';
  if (/iPad/i.test(ua)) return 'iPad';
  if (/Android/i.test(ua)) return 'Android';
  return 'Móvil';
}

/** El código del QR viaja en el fragmento (#): el navegador no lo envía al servidor ni a ningún registro. */
export function codeFromHash(hash: string): string | null {
  const code = hash.replace(/^#/, '');
  return /^[0-9a-f]{32}$/.test(code) ? code : null;
}
