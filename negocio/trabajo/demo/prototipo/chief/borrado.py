"""Borrado certificado con identificador de prueba (R14, requisito 8)."""
import hashlib
import json

from .sistema import Sistema


def buscar(sis: Sistema, texto: str) -> dict:
    return {
        "buzon": sum(texto in json.dumps(x) for x in sis.buzon.listar_correos() + sis.buzon.listar_eventos() + sis.buzon.borradores()),
        "crm": sum(texto in str(f) for f in sis.crm.todas()),
        "cola": sum(texto in str(i) for i in list(sis.cola._items.values())),
        "registro": sis.registro.exportar_jsonl().count(texto),
    }


def borrar(sis: Sistema, identificador: str) -> dict:
    huella = hashlib.sha256(identificador.encode()).hexdigest()[:12]
    ids_borradores = [b["id"] for b in sis.buzon.borradores() if identificador in json.dumps(b)]
    borrados = {"buzon": sis.buzon.borrar_identificador(identificador),
                "crm": sis.crm.borrar_identificador(identificador),
                "cola": sis.cola.borrar_identificador(identificador) + sis.cola.borrar_refs(ids_borradores)}
    restos = buscar(sis, identificador)
    sis.registro.registrar(actor="borrado", accion="borrado", ref=huella, resultado=f"restos={sum(restos.values())}")
    return {"fecha": sis.reloj().isoformat(), "identificador_sha256_12": huella, "borrados": borrados,
            "restos_tras_borrado": restos, "completo": sum(restos.values()) == 0,
            "pendiente_en_produccion": ["copias de seguridad", "logs de n8n", "almacenamiento del LLM", "historial del canal de aprobacion"]}
