"""Flujo 2b: propuesta de borrador. El agente solo CREA borradores locales; nunca envia."""
import re

from .esquemas import ESQUEMA_BORRADOR, SalidaInvalida, parse
from .filtro_salida import enlaces_del_original, limpiar
from .modelo import ModeloNoDisponible
from .sistema import Sistema, prompt
from .triaje import IBAN, IMPORTE, preparar_entrada

CABECERA = re.compile(r"^\s*(para|to|cc|cco|bcc|de|from)\s*:.*$", re.I | re.M)
CORREO = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")


def proponer_borrador(sis: Sistema, correo: dict, triaje: dict) -> str | None:
    sis.interruptor.exigir_activo()
    if triaje["etiqueta"] != "Responder" or not triaje["requiere_respuesta"] or triaje["sospechoso"] or triaje["excluido"]:
        return None
    token, entrada = preparar_entrada("borrador", f"De: {triaje['de']}\nAsunto: {triaje['asunto']}\nCuerpo:\n{triaje['texto_original']}")
    try:
        d = parse(sis.modelo.completar("borrador", prompt("borrador").replace("{token}", token), entrada), ESQUEMA_BORRADOR)
    except (SalidaInvalida, ModeloNoDisponible):
        sis.registro.registrar(actor="borrador", accion="borrador_fallido", ref=correo["id"], resultado="sin borrador")
        return None
    avisos = []
    cuerpo, retirados = limpiar(d["cuerpo"])
    if retirados:
        avisos.append("se retiraron enlaces o imagenes del borrador")
    sin_cab = CABECERA.sub("", cuerpo)
    if sin_cab != cuerpo:
        avisos.append("se retiraron cabeceras de destinatario escritas por el modelo")
    cuerpo = CORREO.sub("[direccion retirada]", sin_cab).strip()
    if IBAN.search(cuerpo) or IMPORTE.search(cuerpo):
        avisos.append("el borrador menciona importes o cuentas: revisalo con especial cuidado")
        cuerpo = IBAN.sub("[cuenta retirada]", cuerpo)
    if correo.get("responder_a") and correo["responder_a"].lower() != triaje["de"].lower():
        avisos.append("el correo trae un Reply-To distinto del remitente: el borrador va solo al remitente")
    if enlaces_del_original(triaje["texto_original"]):
        avisos.append("el original contiene enlaces (se muestran inertes en la tarjeta de revision)")
    para = [triaje["de"]]  # nunca elegido por el modelo: solo quien escribio en el hilo
    bid = sis.buzon.crear_borrador(para, "Re: " + triaje["asunto"], cuerpo, correo["id"], avisos)
    aid = sis.cola.encolar("borrador", bid)
    sis.registro.registrar(actor="borrador", accion="borrador_creado", ref=bid, resultado=aid)
    return bid
