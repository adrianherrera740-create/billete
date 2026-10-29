"""Validacion estricta de la salida del modelo: JSON con esquema fijo (R1)."""
import json


class SalidaInvalida(ValueError):
    pass


ETIQUETAS_MODELO = ("Responder", "Importante", "Informativo", "Riesgo", "Revisar")
PRIORIDADES = ("alta", "media", "baja")

ESQUEMA_TRIAJE = {
    "etiqueta": ("enum", ETIQUETAS_MODELO),
    "prioridad": ("enum", PRIORIDADES),
    "requiere_respuesta": ("bool", None),
    "resumen": ("str", 240),
    "sospecha_inyeccion": ("bool", None),
    "motivo_sospecha": ("str", 160),
    "contiene_importes_o_cuentas": ("bool", None),
}
ESQUEMA_BORRADOR = {"cuerpo": ("str", 1200)}
ESQUEMA_DOSSIER = {"puntos": ("lista", (5, 200)), "preguntas": ("lista", (3, 200))}


def parse(texto: str, esquema: dict) -> dict:
    try:
        d = json.loads(texto)
    except (json.JSONDecodeError, TypeError) as e:
        raise SalidaInvalida("la salida del modelo no es JSON") from e
    if not isinstance(d, dict):
        raise SalidaInvalida("la salida no es un objeto")
    if set(d) != set(esquema):
        raise SalidaInvalida(f"claves no permitidas o ausentes: {sorted(set(d) ^ set(esquema))}")
    for k, (tipo, lim) in esquema.items():
        v = d[k]
        if tipo == "enum" and v not in lim:
            raise SalidaInvalida(f"{k}: valor fuera de la lista")
        if tipo == "bool" and not isinstance(v, bool):
            raise SalidaInvalida(f"{k}: debe ser booleano")
        if tipo == "str" and (not isinstance(v, str) or len(v) > lim):
            raise SalidaInvalida(f"{k}: texto ausente o demasiado largo")
        if tipo == "lista":
            n, largo = lim
            if not isinstance(v, list) or len(v) > n or not all(isinstance(x, str) and len(x) <= largo for x in v):
                raise SalidaInvalida(f"{k}: lista invalida")
    return d
