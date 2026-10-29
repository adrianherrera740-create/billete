"""CRM ligero: solo datos ya presentes en buzon/agenda, sin categorias especiales, con caducidad (R10, R11)."""
import re
import unicodedata

CAMPOS = {"id", "nombre", "email", "organizacion", "relacion", "ultima_interaccion", "notas", "caduca"}
PROHIBIDAS = re.compile(
    r"salud|diagnostic|enfermed|medic|religi|polit|sindic|orientacion|biometr|penal|antecedentes|judicial", re.I)


class FichaInvalida(ValueError):
    pass


def _n(t: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", t) if unicodedata.category(c) != "Mn")


class CRM:
    def __init__(self):
        self._fichas: dict[str, dict] = {}

    def validar(self, ficha: dict) -> dict:
        extra = set(ficha) - CAMPOS
        if extra:
            raise FichaInvalida(f"campos no permitidos en el CRM: {sorted(extra)}")
        for obligatorio in ("nombre", "email", "caduca"):
            if not ficha.get(obligatorio):
                raise FichaInvalida(f"falta {obligatorio}")
        for k in ("notas", "relacion", "organizacion"):
            v = _n(str(ficha.get(k, "")))
            if PROHIBIDAS.search(v):
                raise FichaInvalida(f"{k}: parece categoria especial (art. 9/10); no se guarda")
        if len(ficha.get("notas", "")) > 200:
            raise FichaInvalida("notas: maximo 200 caracteres")
        return ficha

    def alta(self, ficha: dict) -> None:
        self._fichas[ficha["email"].lower()] = self.validar(dict(ficha))

    def obtener(self, email: str) -> dict | None:
        f = self._fichas.get(email.lower())
        return dict(f) if f else None

    def conoce(self, email: str) -> bool:
        return email.lower() in self._fichas

    def todas(self) -> list[dict]:
        return [dict(f) for f in self._fichas.values()]

    def purgar_caducadas(self, hoy: str) -> int:
        caducas = [e for e, f in self._fichas.items() if f["caduca"] < hoy]
        for e in caducas:
            del self._fichas[e]
        return len(caducas)

    def borrar_identificador(self, texto: str) -> int:
        malas = [e for e, f in self._fichas.items() if texto in str(f)]
        for e in malas:
            del self._fichas[e]
        return len(malas)
