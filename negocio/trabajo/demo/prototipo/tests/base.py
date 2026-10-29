import unittest
from datetime import datetime, timedelta, timezone

from chief.modelo import Modelo, ModeloIngenuo, ModeloReglas
from chief.sistema import CLIENTE, crear

AHORA = datetime(2026, 11, 3, 7, 0, tzinfo=timezone(timedelta(hours=1)))


class Espia(Modelo):
    """Envuelve un modelo y guarda todo lo que recibe."""

    def __init__(self, interno):
        self.interno, self.entradas = interno, []

    def completar(self, tarea, sistema, entrada):
        self.entradas.append((tarea, entrada))
        return self.interno.completar(tarea, sistema, entrada)


class Base(unittest.TestCase):
    modelo_clase = ModeloReglas

    def setUp(self):
        self.espia = Espia(self.modelo_clase())
        self.sis = crear(self.espia, AHORA)
        self.correos = {c["id"]: c for c in self.sis.buzon.listar_correos()}
        self.cliente = CLIENTE
