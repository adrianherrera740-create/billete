"""Exclusion por regla de categorias especiales (art. 9/10): NO se envian al modelo (R10)."""
import unicodedata

PALABRAS = [
    "diagnostico", "analitica", "historia clinica", "tratamiento medico", "receta medica", "enfermedad",
    "resultados medicos", "afiliacion sindical", "partido politico", "orientacion sexual", "religion",
    "antecedentes penales", "procedimiento penal", "sentencia penal", "datos biometricos",
]
DOMINIOS = ("clinica-", "hospital-", "juzgado-")
ETIQUETAS_CLIENTE = {"salud", "legal-penal"}  # carpetas que el cliente decide dejar fuera por escrito


def _n(t: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", t.lower()) if unicodedata.category(c) != "Mn")


def motivo_exclusion(correo: dict) -> str | None:
    texto = _n(f"{correo['asunto']} {correo['cuerpo']}")
    dominio = correo["de"].split("@")[-1].lower()
    if any(dominio.startswith(d) for d in DOMINIOS):
        return "remitente de dominio sanitario o judicial"
    if ETIQUETAS_CLIENTE & {e.lower() for e in correo.get("etiquetas", [])}:
        return "carpeta excluida por el cliente"
    for p in PALABRAS:
        if p in texto:
            return "posible categoria especial (palabra clave)"
    return None
