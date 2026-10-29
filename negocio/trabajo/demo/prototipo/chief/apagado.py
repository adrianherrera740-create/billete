"""Interruptor de emergencia (R13, requisito 8). Todo flujo lo consulta antes de actuar."""


class SistemaApagado(RuntimeError):
    pass


class Interruptor:
    def __init__(self):
        self.apagado = False
        self.tokens: dict[str, str] = {}  # solo marcadores ficticios; nunca credenciales reales

    def exigir_activo(self) -> None:
        if self.apagado:
            raise SistemaApagado("Sistema apagado por el cliente: no se ejecuta ningun flujo. Reactivar es decision del cliente.")

    def apagar(self, cola=None, buzon=None) -> dict:
        self.apagado = True
        revocados = len(self.tokens)
        self.tokens.clear()
        vaciados = cola.vaciar() if cola is not None else 0
        return {"tokens_revocados": revocados, "elementos_en_cola_descartados": vaciados, "flujos_parados": True}
