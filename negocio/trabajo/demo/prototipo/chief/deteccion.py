"""Deteccion de patrones de instruccion en contenido entrante.

Es una SENAL para el humano, nunca la unica defensa (analisis-riesgos R1).
"""
import re
import unicodedata

PATRONES = [
    (r"ignor\w*\s+(todas?\s+)?(las\s+|tus\s+)?(instrucciones|reglas|lo\s+anterior)", "pide ignorar instrucciones"),
    (r"ignore\s+(all\s+)?(the\s+)?(previous|prior|above)", "pide ignorar instrucciones"),
    (r"olvida\s+(todo\s+)?lo\s+anterior", "pide olvidar instrucciones"),
    (r"(marca|marcar|clasifica|trata)\w*\s+(este\s+correo\s+)?como\s+urgente", "pide cambiar la prioridad"),
    (r"mark\s+(this\s+)?(email\s+)?as\s+urgent", "pide cambiar la prioridad"),
    (r"no\s+menciones?|no\s+incluyas|omite\s+el\s+correo|do\s+not\s+mention", "pide ocultar informacion"),
    (r"(a[nñ]ade|incluye|inserta|add|append)\s+(al\s+final|en\s+el\s+dossier|to\s+the\s+end)", "pide anadir contenido a la salida"),
    (r"!\[[^\]]*\]\(", "contiene imagen markdown"),
    (r"(reenv[ií]a|reenviar|forward|envia|enviar|send)\w*\s+.*\b(a|to)\s+\S+@\S+", "pide enviar a una direccion"),
    (r"(contenido|resumen)\s+de\s+los\s+[uú]ltimos\s+\d+\s+correos", "pide datos de otros correos"),
    (r"system\s*prompt|prompt\s+del\s+sistema|tus\s+instrucciones", "pide revelar instrucciones"),
    (r"\b(eres\s+ahora|you\s+are\s+now|act[uú]a\s+como)\b", "intenta cambiar el rol"),
    (r"<</?datos", "intenta falsificar el delimitador"),
]
_COMPILADOS = [(re.compile(p, re.I | re.S), d) for p, d in PATRONES]


def _norm(t: str) -> str:
    return unicodedata.normalize("NFKC", t)


def senales(texto: str, oculto: bool = False, invisibles: int = 0) -> list[str]:
    out = []
    t = _norm(texto)
    for rx, desc in _COMPILADOS:
        if rx.search(t) and desc not in out:
            out.append(desc)
    if oculto:
        out.append("texto oculto en el HTML (descartado)")
    if invisibles:
        out.append("caracteres invisibles (retirados)")
    return out
