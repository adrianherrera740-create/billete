# Proxy de continuidad: Claude -> Ollama local -> segundo modelo local

Cadena ordenada. Si un proveedor devuelve límite (429), error de servidor (5xx, 529)
o no conecta, se aparta `cooldown` segundos y se prueba el siguiente. Pasado ese
tiempo vuelve a probarse el primero (Claude).

## Añadir otro modelo local (paso a paso)
1. `ollama pull NOMBRE_DEL_MODELO` y comprueba con `ollama list`.
2. Prueba que responde en formato Anthropic:
   `curl http://127.0.0.1:11434/v1/messages -H "content-type: application/json" -H "anthropic-version: 2023-06-01" -d '{"model":"NOMBRE","max_tokens":16,"messages":[{"role":"user","content":"hola"}]}'`
   Si da 404 o error, esa versión de Ollama no acepta ese formato (no verificado).
3. Añade un bloque en `config.json` con el mismo `base_url` y `"models": {"*": "NOMBRE"}`.
   El orden de la lista es el orden de preferencia.

Un modelo local no tiene "límite" de uso: lo que falla es memoria, contexto o tiempo.
Pon como segundo uno más pequeño que el primero para que quepa en tu RAM.

## Uso
1. `cp config.example.json config.json` y rellena los modelos.
2. `export ANTHROPIC_API_KEY=...` (nunca en el repo).
3. `python proxy.py`
4. `ANTHROPIC_BASE_URL=http://127.0.0.1:8787 claude`

Sin verificar contra Anthropic ni Ollama reales; probado solo con servidores falsos.

## Prueba con dos cuentas de Ollama (una de cada persona)
Cadena: Claude -> Ollama cuenta 1 -> Ollama cuenta 2. Cada persona exporta SU clave
(`OLLAMA_API_KEY_1`, `OLLAMA_API_KEY_2`) en su entorno; nunca en el repo ni en `config.json`.
Comprobad antes los términos de Ollama sobre compartir claves (no verificado aquí).
