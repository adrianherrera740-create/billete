import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { basename, posix, win32 } from 'node:path';

export interface ShellInfo {
  id: string;
  label: string;
  file: string;
  args: string[];
}

export interface DetectDeps {
  platform: NodeJS.Platform;
  env: Record<string, string | undefined>;
  exists(path: string): boolean;
  /** Salida cruda de `wsl.exe -l -q` (UTF-16LE ya decodificada) o null si no se pudo ejecutar. */
  wslList(): string | null;
}

/** Nombres de distribución de WSL a partir de la salida de `wsl -l -q` (limpia NUL, BOM y retornos de carro). */
export function parseWslList(raw: string): string[] {
  return raw
    .replace(/\0/g, '')
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '' && !/^docker-desktop(-data)?$/i.test(line));
}

/**
 * Detecta los shells disponibles sin asumir que ninguno existe. Cada herramienta que falta
 * simplemente no aparece en la lista (degradación suave).
 */
export function detectShells(deps: DetectDeps): ShellInfo[] {
  const { platform, env, exists } = deps;
  const shells: ShellInfo[] = [];

  if (platform === 'win32') {
    const root = env['SystemRoot'] ?? env['SYSTEMROOT'] ?? 'C:\\Windows';
    const programFiles = env['ProgramFiles'] ?? 'C:\\Program Files';
    const programFilesX86 = env['ProgramFiles(x86)'] ?? 'C:\\Program Files (x86)';
    const localAppData = env['LOCALAPPDATA'];

    const powershell = win32.join(root, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
    if (exists(powershell)) shells.push({ id: 'powershell', label: 'Windows PowerShell', file: powershell, args: ['-NoLogo'] });

    const pwsh = win32.join(programFiles, 'PowerShell', '7', 'pwsh.exe');
    if (exists(pwsh)) shells.push({ id: 'pwsh', label: 'PowerShell 7', file: pwsh, args: ['-NoLogo'] });

    const cmd = env['ComSpec'] ?? win32.join(root, 'System32', 'cmd.exe');
    if (exists(cmd)) shells.push({ id: 'cmd', label: 'Símbolo del sistema (CMD)', file: cmd, args: [] });

    const gitBashCandidates = [
      win32.join(programFiles, 'Git', 'bin', 'bash.exe'),
      win32.join(programFilesX86, 'Git', 'bin', 'bash.exe'),
      ...(localAppData ? [win32.join(localAppData, 'Programs', 'Git', 'bin', 'bash.exe')] : [])
    ];
    const gitBash = gitBashCandidates.find((candidate) => exists(candidate));
    if (gitBash) shells.push({ id: 'gitbash', label: 'Git Bash', file: gitBash, args: ['--login', '-i'] });

    const wsl = win32.join(root, 'System32', 'wsl.exe');
    if (exists(wsl)) {
      const raw = deps.wslList();
      const distros = raw === null ? [] : parseWslList(raw);
      if (distros.length === 0) shells.push({ id: 'wsl', label: 'WSL', file: wsl, args: [] });
      for (const name of distros) shells.push({ id: `wsl:${name}`, label: `WSL: ${name}`, file: wsl, args: ['-d', name] });
    }
    return shells;
  }

  const seen = new Set<string>();
  const candidates = [env['SHELL'], '/bin/bash', '/usr/bin/bash', '/bin/zsh', '/usr/bin/zsh', '/bin/sh'];
  for (const file of candidates) {
    if (!file || !posix.isAbsolute(file) || seen.has(file) || !exists(file)) continue;
    seen.add(file);
    const name = basename(file);
    shells.push({ id: name === 'sh' ? 'sh' : name, label: name, file, args: [] });
  }
  // Dos rutas al mismo shell (/bin/bash y /usr/bin/bash) darían ids repetidos.
  return shells.filter((shell, i) => shells.findIndex((other) => other.id === shell.id) === i);
}

/** Dependencias reales (Windows, Linux o macOS). */
export function realDeps(): DetectDeps {
  return {
    platform: process.platform,
    env: process.env,
    exists: existsSync,
    wslList: () => {
      if (process.platform !== 'win32') return null;
      try {
        const out = execFileSync('wsl.exe', ['-l', '-q'], { timeout: 5000, windowsHide: true });
        return out.toString('utf16le');
      } catch {
        return null;
      }
    }
  };
}
