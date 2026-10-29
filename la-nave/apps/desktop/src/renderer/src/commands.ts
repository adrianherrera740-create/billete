/** Registro de comandos de la paleta (Ctrl+Shift+P). Es extensible: cualquier módulo puede registrar los suyos. */
export interface Command {
  id: string;
  title: string;
  /** Palabras extra por las que se puede encontrar el comando. */
  keywords?: string;
  run(): void | Promise<void>;
}

const registry = new Map<string, Command>();

/** Registra un comando y devuelve la función para quitarlo. Un id repetido sustituye al anterior. */
export function registerCommand(command: Command): () => void {
  registry.set(command.id, command);
  return () => {
    if (registry.get(command.id) === command) registry.delete(command.id);
  };
}

export function listCommands(): Command[] {
  return [...registry.values()];
}

/** Minúsculas y sin acentos, para que «terminal» encuentre «Térmínal» y «anadir» encuentre «Añadir». */
export function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/** Todas las palabras de la consulta deben aparecer; primero los títulos que empiezan por la consulta. */
export function filterCommands(commands: Command[], query: string): Command[] {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return commands;
  const scored: Array<{ command: Command; score: number }> = [];
  for (const command of commands) {
    const title = normalize(command.title);
    const haystack = `${title} ${normalize(command.keywords ?? '')}`;
    if (!words.every((w) => haystack.includes(w))) continue;
    scored.push({ command, score: title.startsWith(words[0] ?? '') ? 0 : title.includes(words[0] ?? '') ? 1 : 2 });
  }
  return scored.sort((a, b) => a.score - b.score).map((s) => s.command);
}
