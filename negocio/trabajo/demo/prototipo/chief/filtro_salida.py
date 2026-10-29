"""Filtro de salida: texto plano, sin enlaces, imagenes ni HTML (R3, requisito 4)."""
import re

IMG_MD = re.compile(r"!\[[^\]]*\]\([^)]*\)")
ENLACE_MD = re.compile(r"\[([^\]]*)\]\([^)]*\)")
HTML = re.compile(r"<[^>]*>")
URL = re.compile(r"(?i)(?:\b(?:https?|ftp)://|\bwww\.|\b(?:data|javascript):)[^\s<>\"')\]]*")
DOMINIO_RUTA = re.compile(r"(?i)\b[a-z0-9-]+(?:\.[a-z0-9-]+)+/[^\s<>\"')\]]*")
MARCA = "[enlace retirado]"


def limpiar(texto: str) -> tuple[str, int]:
    """Devuelve (texto limpio, numero de elementos retirados)."""
    retirados = 0

    def sub(patron, repl, t):
        nonlocal retirados
        t, n = patron.subn(repl, t)
        retirados += n
        return t

    texto = sub(IMG_MD, "", texto)
    texto = sub(ENLACE_MD, r"\1", texto)
    texto = sub(HTML, "", texto)
    texto = sub(URL, MARCA, texto)
    texto = sub(DOMINIO_RUTA, MARCA, texto)
    texto = texto.replace("![", "").replace("](", " ").replace("<", "").replace(">", "")
    return re.sub(r"[ \t]+", " ", texto).strip(), retirados


def inerte(url: str) -> str:
    """Muestra una URL como texto inerte para el humano (no clicable)."""
    return url.replace("http", "hxxp", 1).replace(".", "[.]")


def enlaces_del_original(texto_original: str) -> list[str]:
    """URLs presentes literalmente en el original, defangeadas para mostrarlas al humano."""
    con_esquema = URL.findall(texto_original)
    sin_esquema = DOMINIO_RUTA.findall(URL.sub(" ", texto_original))
    return sorted({inerte(u) for u in con_esquema + sin_esquema})
