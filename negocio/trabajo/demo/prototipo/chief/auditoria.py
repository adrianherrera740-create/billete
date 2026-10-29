"""Registro de auditoria append-only con hash encadenado, sin cuerpos de correo (R12, requisito 8)."""
import hashlib
import json

CLAVES = {"actor", "accion", "ref", "resultado", "aprobador"}
MAX_VALOR = 80


class RegistroInvalido(ValueError):
    pass


class Registro:
    def __init__(self, reloj):
        self._reloj = reloj
        self._entradas: list[dict] = []

    def registrar(self, **campos) -> dict:
        if not campos.keys() <= CLAVES or "accion" not in campos:
            raise RegistroInvalido(f"campos no permitidos: {sorted(set(campos) - CLAVES)}")
        for k, v in campos.items():
            if not isinstance(v, str) or len(v) > MAX_VALOR or "\n" in v:
                raise RegistroInvalido(f"{k}: el registro solo guarda referencias cortas, nunca cuerpos")
        previo = self._entradas[-1]["hash"] if self._entradas else "0" * 64
        e = {"n": len(self._entradas) + 1, "ts": self._reloj().isoformat(), **campos, "prev": previo}
        e["hash"] = self._hash(e)
        self._entradas.append(e)
        return e

    @staticmethod
    def _hash(e: dict) -> str:
        base = {k: v for k, v in e.items() if k != "hash"}
        return hashlib.sha256(json.dumps(base, sort_keys=True, ensure_ascii=False).encode()).hexdigest()

    def entradas(self) -> list[dict]:
        return [dict(e) for e in self._entradas]

    def verificar(self) -> bool:
        previo = "0" * 64
        for e in self._entradas:
            if e["prev"] != previo or e["hash"] != self._hash(e):
                return False
            previo = e["hash"]
        return True

    def exportar_jsonl(self) -> str:
        return "\n".join(json.dumps(e, ensure_ascii=False) for e in self._entradas)
