# Usar este proyecto con Free Claude Code (FCC)

FCC (https://github.com/alishahryar1/free-claude-code) es un proxy local que te deja usar Claude Code y otros agentes con modelos gratuitos o de otros proveedores. No sustituye a este repo: el repo es el proyecto y el cerebro; FCC es el motor que lo ejecuta en tu ordenador. Lo que sigue sale del README de FCC. No he ejecutado FCC ni revisado el código de su instalador: léelo antes de ejecutarlo, y no pegues claves en archivos del repo.

## 1. Instalar y configurar FCC (según su README)
- macOS/Linux: `curl -fsSL "https://raw.githubusercontent.com/Alishahryar1/free-claude-code/main/scripts/install.sh" | sh`
- Windows PowerShell: `& ([scriptblock]::Create((irm "https://raw.githubusercontent.com/Alishahryar1/free-claude-code/main/scripts/install.ps1")))`
- Arranca FCC (Windows/macOS: abrir "Free Claude Code"; Linux: `fcc-server` y dejar la terminal abierta). En la interfaz Admin añade la clave de un proveedor (el README usa NVIDIA NIM: https://build.nvidia.com/settings/api-keys), elige un modelo que soporte herramientas y pulsa Apply.

## 2. Traer el proyecto y su cerebro
```
git clone https://github.com/adrianherrera740-create/billete
cd billete
git checkout claude/limpiar-repositorio-o2fihp
```
Antes de trabajar: `git pull`. Al terminar: `git add -A && git commit -m "..." && git push`. Así el cerebro es el mismo en la nube y en tu ordenador.

## 3. Arrancar el agente dentro de la carpeta del proyecto
- Claude Code con FCC: `fcc-claude`. Lee solo `CLAUDE.md`, `.claude/agents/` y `.claude/skills/`, y el hook de `.claude/settings.json` imprime `cerebro/estado.md` y `cerebro/aprendizajes.md` al abrir la sesión.
- Otros agentes (`fcc-codex`, `fcc-aider`, `fcc-opencode`, `fcc-cline`, `fcc-pi`, `fcc-hermes`...): leen `AGENTS.md`, que les manda abrir el cerebro.
- Primer mensaje recomendado: `Lee cerebro/README.md y cerebro/estado.md y dime en 5 líneas dónde estamos y cuál es el siguiente paso.` Si lo contesta bien, la memoria funciona.
- Para arrancar una ronda completa, pega la misión como en la oficina: `Eres el director. Sigue .claude/agents/director.md. Misión: Modo A (problema primero). Idea: <tu idea>.`

## 4. Qué cambia respecto a la nube (no verificado)
- **Modelos:** los gratuitos son menos fiables que Claude para coordinar 28 agentes. Usa el mejor modelo con herramientas que tengas y lanza rondas pequeñas (un modo, pocos productos).
- **Búsqueda web:** la herramienta WebSearch de Claude Code es del servidor de Anthropic; con otros modelos puede no funcionar. Pruébala con una búsqueda sencilla. Si no va, pega tú los datos o usa el barrido de AliExpress.
- **Barrido de AliExpress:** necesita Node y Playwright: `npm install -g playwright && npx playwright install chromium`, y desde `.claude/skills/proveedor-es/scripts/`: `node aliexpress_es.js "término 1" "término 2"`. Desde tu casa puede evitar los bloqueos de la nube (fichas y otros proveedores): no verificado.
- **Subagentes:** el director lanza agentes con la herramienta Agent de Claude Code. Los demás harness no los tienen: cada rol de `.claude/agents/*.md` se ejecuta leyendo su archivo, uno detrás de otro.
- **Oficina pixel-art:** funciona con claude.ai (botón de sesión real). En local solo vale como visor del flujo o para copiar la orden del director.

## 5. Privacidad
Lo que escribas llega al proveedor del modelo que elijas. No guardes en el repo claves, datos fiscales ni datos personales.
