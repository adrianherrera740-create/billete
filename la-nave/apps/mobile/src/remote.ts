import type { ChannelInput, ChannelName, ChannelOutputs, NaveApi } from '@nave/shared';

/** Llama a un canal y devuelve el dato; si el servidor responde con error, lanza con su mensaje (ya en español). */
export async function call<C extends ChannelName>(api: NaveApi, channel: C, input: ChannelInput<C>): Promise<ChannelOutputs[C]> {
  const res = await api.invoke(channel, input);
  if (!res.ok) throw new Error(res.error.message);
  return res.data;
}

export const message = (error: unknown): string => (error instanceof Error ? error.message : String(error));
