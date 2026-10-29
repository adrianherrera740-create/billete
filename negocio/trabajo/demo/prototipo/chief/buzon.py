"""Buzon y agenda de PRUEBA, solo lectura, mas creacion de borradores locales.

No existe ningun metodo de envio (requisito 2 y 'no dar a la IA el permiso de enviar').
Cambiar a Gmail real exigiria otra implementacion con gmail.readonly (opcion A) o
gmail.compose (opcion B): decision pendiente de la persona.
"""
import json
from pathlib import Path


class Buzon:
    def __init__(self, ruta_correos: Path, ruta_agenda: Path):
        self._correos = json.loads(Path(ruta_correos).read_text(encoding="utf-8"))
        self._agenda = json.loads(Path(ruta_agenda).read_text(encoding="utf-8"))
        self._borradores: list[dict] = []

    def listar_correos(self) -> list[dict]:
        return [dict(c) for c in self._correos]

    def listar_eventos(self) -> list[dict]:
        return [dict(e) for e in self._agenda]

    def ultimos_asuntos(self, email: str, n: int = 3) -> list[str]:
        propios = [c for c in self._correos if c["de"].lower() == email.lower()]
        return [c["asunto"] for c in sorted(propios, key=lambda c: c["fecha"], reverse=True)[:n]]

    def crear_borrador(self, para: list[str], asunto: str, cuerpo: str, en_respuesta_a: str, avisos: list[str]) -> str:
        bid = f"D-{len(self._borradores) + 1:03d}"
        self._borradores.append({"id": bid, "para": para, "asunto": asunto, "cuerpo": cuerpo,
                                 "en_respuesta_a": en_respuesta_a, "avisos": avisos, "estado": "borrador"})
        return bid

    def borrador(self, bid: str) -> dict:
        return dict(next(b for b in self._borradores if b["id"] == bid))

    def borradores(self) -> list[dict]:
        return [dict(b) for b in self._borradores]

    def borrar_identificador(self, texto: str) -> int:
        antes = len(self._correos) + len(self._agenda) + len(self._borradores)
        self._correos = [c for c in self._correos if texto not in json.dumps(c)]
        self._agenda = [e for e in self._agenda if texto not in json.dumps(e)]
        self._borradores = [b for b in self._borradores if texto not in json.dumps(b)]
        return antes - (len(self._correos) + len(self._agenda) + len(self._borradores))
