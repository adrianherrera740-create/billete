"""Ensamblado del sistema (inyeccion de dependencias; el modelo y el reloj se pasan de fuera)."""
import json
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

from .apagado import Interruptor
from .aprobaciones import Cola
from .auditoria import Registro
from .buzon import Buzon
from .crm import CRM
from .modelo import Modelo

RAIZ = Path(__file__).resolve().parent.parent
AVISO = "FASE DE PRUEBA: datos ficticios; no apto para datos reales hasta cerrar el kit legal."
CLIENTE = "cliente.demo@cliente-demo.example"


def prompt(nombre: str) -> str:
    return (RAIZ / "prompts" / f"{nombre}.txt").read_text(encoding="utf-8")


@dataclass
class Sistema:
    buzon: Buzon
    crm: CRM
    cola: Cola
    registro: Registro
    interruptor: Interruptor
    modelo: Modelo
    reloj: callable


def crear(modelo: Modelo, ahora: datetime, datos: Path = RAIZ / "datos") -> Sistema:
    reloj = lambda: ahora  # noqa: E731
    crm = CRM()
    for f in json.loads((datos / "crm_inicial.json").read_text(encoding="utf-8")):
        crm.alta(f)
    interruptor = Interruptor()
    interruptor.tokens = {"lectura": "TOKEN-FICTICIO-1", "borradores": "TOKEN-FICTICIO-2"}
    return Sistema(
        buzon=Buzon(datos / "correos.json", datos / "agenda.json"),
        crm=crm, cola=Cola({CLIENTE}, reloj), registro=Registro(reloj),
        interruptor=interruptor, modelo=modelo, reloj=reloj,
    )
