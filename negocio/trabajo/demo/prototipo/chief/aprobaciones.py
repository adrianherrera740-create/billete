"""Canal de aprobaciones: solo ID y verbo viajan por el canal (R9, requisito 6)."""
import hmac
import secrets

TIPOS_EXTERNOS = {"borrador"}  # efecto externo: exigen segundo paso


class AprobacionDenegada(PermissionError):
    pass


class Cola:
    def __init__(self, vinculados: set[str], reloj):
        self._vinculados = {v.lower() for v in vinculados}
        self._reloj = reloj
        self._items: dict[str, dict] = {}
        # Simula el segundo factor del dispositivo vinculado (en produccion: passkey/TOTP del cliente).
        self._codigo = secrets.token_hex(3)

    def codigo_dispositivo(self) -> str:
        return self._codigo

    def encolar(self, tipo: str, ref: str, payload: dict | None = None) -> str:
        aid = f"A-{len(self._items) + 1:04d}"
        self._items[aid] = {"id": aid, "tipo": tipo, "ref": ref, "estado": "pendiente",
                            "creado": self._reloj().isoformat(), "payload": payload or {}}
        return aid

    def pendientes(self) -> list[dict]:
        return [dict(i) for i in self._items.values() if i["estado"] == "pendiente"]

    def item(self, aid: str) -> dict:
        return dict(self._items[aid])

    def mensaje_canal(self, aid: str) -> str:
        """Lo unico que sale hacia Telegram/Slack/correo: sin asunto, sin cuerpo, sin enlaces."""
        i = self._items[aid]
        return f"Pendiente: {i['tipo']} {i['id']}. Revisa en tu panel. Responde APROBAR {i['id']} o RECHAZAR {i['id']}."

    def decidir(self, aid: str, decision: str, usuario: str, segundo_paso: str | None = None) -> dict:
        if decision not in ("aprobar", "rechazar"):
            raise ValueError("decision invalida")
        i = self._items.get(aid)
        if i is None:
            raise AprobacionDenegada("elemento inexistente")
        if i["estado"] != "pendiente":
            raise AprobacionDenegada(f"ya decidido ({i['estado']})")
        if usuario.lower() not in self._vinculados:
            raise AprobacionDenegada("cuenta no vinculada: no puede aprobar")
        if decision == "aprobar" and i["tipo"] in TIPOS_EXTERNOS:
            if not segundo_paso or not hmac.compare_digest(segundo_paso, self._codigo):
                raise AprobacionDenegada("falta o es incorrecto el segundo paso para una accion con efecto externo")
        i["estado"] = "aprobado" if decision == "aprobar" else "rechazado"
        i["decidido_por"] = usuario.lower()
        # Aprobar un borrador NO lo envia: significa "listo para que lo envies tu desde tu correo".
        return dict(i)

    def vaciar(self) -> int:
        n = len(self._items)
        self._items.clear()
        return n

    def borrar_identificador(self, texto: str) -> int:
        malos = [k for k, v in self._items.items() if texto in str(v)]
        for k in malos:
            del self._items[k]
        return len(malos)

    def borrar_refs(self, refs: list[str]) -> int:
        malos = [k for k, v in self._items.items() if v["ref"] in refs]
        for k in malos:
            del self._items[k]
        return len(malos)
