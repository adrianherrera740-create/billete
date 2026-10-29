import { describe, expect, it, vi } from 'vitest';
import { filterCommands, listCommands, normalize, registerCommand } from './commands';
import type { Command } from './commands';

const cmd = (id: string, title: string, keywords?: string): Command => ({ id, title, ...(keywords ? { keywords } : {}), run: () => undefined });

describe('registro de comandos (extensible)', () => {
  it('registra, sustituye por id y se puede quitar', () => {
    const off = registerCommand(cmd('t:a', 'Primero'));
    registerCommand(cmd('t:a', 'Segundo'));
    expect(listCommands().filter((c) => c.id === 't:a').map((c) => c.title)).toEqual(['Segundo']);
    off(); // el registro ya es otro: no debe borrar al nuevo
    expect(listCommands().some((c) => c.id === 't:a')).toBe(true);
    const off2 = registerCommand(cmd('t:b', 'Otro'));
    off2();
    expect(listCommands().some((c) => c.id === 't:b')).toBe(false);
  });

  it('un módulo nuevo añade su comando y se ejecuta', async () => {
    const run = vi.fn();
    const off = registerCommand({ id: 't:ext', title: 'Comando de un módulo futuro', run });
    await listCommands().find((c) => c.id === 't:ext')?.run();
    expect(run).toHaveBeenCalledTimes(1);
    off();
  });
});

describe('filterCommands', () => {
  const all = [cmd('1', 'Añadir terminal', 'shell consola'), cmd('2', 'Nuevo proyecto'), cmd('3', 'Abrir el Brain', 'conocimiento'), cmd('4', 'Terminar sesión de Claude')];

  it('ignora mayúsculas y acentos y exige todas las palabras', () => {
    expect(filterCommands(all, 'ANADIR TERMINAL').map((c) => c.id)).toEqual(['1']);
    expect(filterCommands(all, 'nuevo proy').map((c) => c.id)).toEqual(['2']);
    expect(filterCommands(all, 'terminal nuevo')).toEqual([]);
  });

  it('busca también en las palabras clave y ordena primero los que empiezan por la consulta', () => {
    expect(filterCommands(all, 'consola').map((c) => c.id)).toEqual(['1']);
    expect(filterCommands(all, 'term').map((c) => c.id)).toEqual(['4', '1']);
  });

  it('una consulta vacía devuelve todo; normalize quita acentos', () => {
    expect(filterCommands(all, '   ')).toHaveLength(4);
    expect(normalize('Térmínal ÑANDÚ')).toBe('terminal nandu');
  });
});
