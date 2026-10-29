"""Flujo 2: triaje con etiquetas. El modelo propone; las reglas deterministas deciden lo critico."""
import re
import secrets

from . import deteccion, exclusion
from .esquemas import ESQUEMA_TRIAJE, SalidaInvalida, parse
from .filtro_salida import limpiar
from .modelo import ModeloNoDisponible
from .saneo import a_texto_plano
from .sistema import CLIENTE, Sistema, prompt

EMAIL = re.compile(r"^[\w.+-]+@[\w-]+(\.[\w-]+)+$")
IBAN = re.compile(r"\b[A-Z]{2}\d{2}(?:\s?\d{4}){3,}\b")
IMPORTE = re.compile(r"\d[\d.,]*\s?(?:eur|euros|€)", re.I)
CAMBIO_CUENTA = re.compile(r"cambio de cuenta|nueva cuenta|nuevo iban|nuevos datos bancarios|datos bancarios", re.I)
DELIM = re.compile(r"<<\s*/?\s*DATOS[^>\n]*>>?", re.I)
RESUMEN_SOSPECHOSO = "Contiene instrucciones o contenido oculto. No se resume: revisa el original con cuidado."


def direccion_valida(de: str) -> str:
    return de if isinstance(de, str) and EMAIL.match(de) else "remitente-no-valido@invalido.example"


def preparar_entrada(tarea: str, bloque: str) -> tuple[str, str]:
    """Devuelve (token, entrada) con el contenido no fiable delimitado por un token aleatorio."""
    token = secrets.token_hex(6)
    bloque = DELIM.sub("[delimitador retirado]", bloque)
    return token, f"TAREA: {tarea}\n<<DATOS-{token}>>\n{bloque}\n<</DATOS-{token}>>"


def triar(sis: Sistema, correo: dict) -> dict:
    sis.interruptor.exigir_activo()
    cid, de = correo["id"], direccion_valida(correo["de"])
    base = {"correo_id": cid, "de": de, "conocido": sis.crm.conoce(de) or de == CLIENTE,
            "excluido": False, "sospechoso": False, "senales": [], "avisos": []}

    motivo = exclusion.motivo_exclusion(correo)
    if motivo:  # nunca llega al modelo
        sis.registro.registrar(actor="triaje", accion="triaje", ref=cid, resultado="Excluido")
        return {**base, "etiqueta": "Excluido", "prioridad": "baja", "requiere_respuesta": False,
                "resumen": "", "excluido": True, "avisos": [motivo], "texto_original": ""}

    asunto = a_texto_plano(correo["asunto"]).texto[:200]
    san = a_texto_plano(correo["cuerpo"])
    texto = san.texto
    senales = deteccion.senales(f"{asunto}\n{texto}", san.oculto_descartado, san.invisibles)
    token, entrada = preparar_entrada("triaje", f"De: {de}\nAsunto: {asunto}\nCuerpo:\n{texto}")
    sistema = prompt("triaje").replace("{token}", token)

    res, avisos = None, []
    try:
        res = parse(sis.modelo.completar("triaje", sistema, entrada), ESQUEMA_TRIAJE)
    except SalidaInvalida as e:
        avisos.append(f"salida del modelo rechazada ({e}); queda para revision manual")
    except ModeloNoDisponible as e:
        avisos.append(f"modelo no disponible; queda para revision manual ({str(e)[:60]})")
    if res is None:
        res = {"etiqueta": "Revisar", "prioridad": "media", "requiere_respuesta": False, "resumen": "",
               "sospecha_inyeccion": False, "motivo_sospecha": "", "contiene_importes_o_cuentas": False}

    etiqueta, prioridad = res["etiqueta"], res["prioridad"]
    cuentas = res["contiene_importes_o_cuentas"] or bool(IBAN.search(texto) or IMPORTE.search(texto))
    resumen, retirados = limpiar(res["resumen"])
    if retirados:
        avisos.append("se neutralizaron enlaces o imagenes en la salida del modelo")

    cambio_cuenta = bool(CAMBIO_CUENTA.search(f"{asunto} {texto}"))
    if cambio_cuenta and (not base["conocido"] or IBAN.search(texto)):
        etiqueta, prioridad = "Riesgo", "alta"
        avisos.append("pide datos o cambio de cuenta bancaria: verifica por un canal que ya conocias; no se redacta borrador")
    elif not base["conocido"] and prioridad == "alta":
        prioridad = "media"  # un desconocido no puede subir su propia prioridad

    sospechoso = bool(senales) or res["sospecha_inyeccion"]
    requiere = res["requiere_respuesta"]
    if sospechoso:
        etiqueta, prioridad, requiere = "Sospechoso", "media", False
        resumen = RESUMEN_SOSPECHOSO
        avisos += senales
        if res["sospecha_inyeccion"] and not senales:
            avisos.append("el modelo marco sospecha de inyeccion")
    if etiqueta == "Riesgo":
        requiere = False
    if cuentas:
        avisos.append("contiene importes o cuentas")

    sis.registro.registrar(actor="triaje", accion="triaje", ref=cid, resultado=etiqueta)
    return {**base, "etiqueta": etiqueta, "prioridad": prioridad, "requiere_respuesta": requiere,
            "resumen": resumen, "sospechoso": sospechoso, "senales": senales, "avisos": avisos,
            "contiene_importes_o_cuentas": cuentas, "texto_original": texto, "asunto": asunto}
