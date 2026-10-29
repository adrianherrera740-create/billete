type Handler = (payload: unknown) => void;

/** Bus de eventos tipado. Un manejador que falla no afecta a los demás ni a quien emite. */
export class EventBus<M extends object> {
  private readonly handlers = new Map<PropertyKey, Set<Handler>>();

  constructor(private readonly onError: (event: string, error: unknown) => void = () => undefined) {}

  on<K extends keyof M>(event: K, handler: (payload: M[K]) => void): () => void {
    const set = this.handlers.get(event) ?? new Set<Handler>();
    const wrapped = handler as Handler;
    set.add(wrapped);
    this.handlers.set(event, set);
    return () => {
      set.delete(wrapped);
    };
  }

  once<K extends keyof M>(event: K, handler: (payload: M[K]) => void): () => void {
    const off = this.on(event, (payload) => {
      off();
      handler(payload);
    });
    return off;
  }

  emit<K extends keyof M>(event: K, payload: M[K]): void {
    const set = this.handlers.get(event);
    if (!set) return;
    for (const handler of [...set]) {
      try {
        handler(payload);
      } catch (error) {
        this.onError(String(event), error);
      }
    }
  }

  listenerCount<K extends keyof M>(event: K): number {
    return this.handlers.get(event)?.size ?? 0;
  }
}
