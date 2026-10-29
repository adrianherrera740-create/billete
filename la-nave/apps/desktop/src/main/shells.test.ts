import { describe, expect, it } from 'vitest';
import { detectShells, parseWslList } from './shells';
import type { DetectDeps } from './shells';

const win = (present: string[], wsl: string | null = null, env: DetectDeps['env'] = {}): DetectDeps => ({
  platform: 'win32',
  env: { SystemRoot: 'C:\\Windows', ProgramFiles: 'C:\\Program Files', ...env },
  exists: (p) => present.includes(p),
  wslList: () => wsl
});

describe('parseWslList', () => {
  it('limpia NUL, BOM y retornos de carro, y oculta docker-desktop', () => {
    const raw = '\uFEFFUbuntu\r\nDebian\r\ndocker-desktop\r\ndocker-desktop-data\r\n\r\n';
    expect(parseWslList(raw)).toEqual(['Ubuntu', 'Debian']);
    expect(parseWslList('U\0b\0u\0n\0t\0u\0\r\n\0')).toEqual(['Ubuntu']);
  });
});

describe('detectShells en Windows (sistema de ficheros simulado)', () => {
  const ps = 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';
  const cmd = 'C:\\Windows\\System32\\cmd.exe';
  const wsl = 'C:\\Windows\\System32\\wsl.exe';

  it('detecta PowerShell, CMD, Git Bash y cada distribución de WSL', () => {
    const shells = detectShells(win([ps, cmd, 'C:\\Program Files\\Git\\bin\\bash.exe', wsl], 'Ubuntu\r\nDebian\r\n'));
    expect(shells.map((s) => s.id)).toEqual(['powershell', 'cmd', 'gitbash', 'wsl:Ubuntu', 'wsl:Debian']);
    expect(shells.find((s) => s.id === 'wsl:Debian')).toMatchObject({ file: wsl, args: ['-d', 'Debian'] });
    expect(shells.find((s) => s.id === 'gitbash')?.args).toEqual(['--login', '-i']);
  });

  it('lo que no está instalado simplemente no aparece', () => {
    expect(detectShells(win([cmd])).map((s) => s.id)).toEqual(['cmd']);
    expect(detectShells(win([]))).toEqual([]);
  });

  it('WSL instalado pero sin lista: ofrece el WSL por defecto', () => {
    expect(detectShells(win([wsl], null)).map((s) => s.id)).toEqual(['wsl']);
  });

  it('usa ComSpec y la carpeta de Git del usuario si están', () => {
    const shells = detectShells(win(['D:\\sys\\cmd.exe', 'C:\\Users\\yo\\AppData\\Local\\Programs\\Git\\bin\\bash.exe'], null, { ComSpec: 'D:\\sys\\cmd.exe', LOCALAPPDATA: 'C:\\Users\\yo\\AppData\\Local' }));
    expect(shells.map((s) => s.id)).toEqual(['cmd', 'gitbash']);
  });
});

describe('detectShells en Linux y macOS', () => {
  it('usa $SHELL y los de /bin sin repetir ids', () => {
    const present = ['/usr/bin/zsh', '/bin/bash', '/usr/bin/bash', '/bin/sh'];
    const shells = detectShells({ platform: 'linux', env: { SHELL: '/usr/bin/zsh' }, exists: (p) => present.includes(p), wslList: () => null });
    expect(shells.map((s) => s.id)).toEqual(['zsh', 'bash', 'sh']);
  });

  it('ignora un $SHELL relativo o inexistente', () => {
    const shells = detectShells({ platform: 'linux', env: { SHELL: 'bash' }, exists: () => false, wslList: () => null });
    expect(shells).toEqual([]);
  });
});
