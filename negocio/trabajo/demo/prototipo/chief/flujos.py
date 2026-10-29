"""Orquestacion diaria: lo que haria el disparador de las 7:00 en n8n."""
from . import briefing, crm_flujo, dossier
from .borrador import proponer_borrador
from .sistema import Sistema
from .triaje import triar


def ejecutar_dia(sis: Sistema) -> dict:
    correos = sis.buzon.listar_correos()
    triajes = [triar(sis, c) for c in correos]
    por_id = {c["id"]: c for c in correos}
    borradores = [b for t in triajes if (b := proponer_borrador(sis, por_id[t["correo_id"]], t))]
    altas = crm_flujo.proponer_altas(sis, triajes)
    dossiers = [dossier.generar(sis, e) for e in dossier.eventos_para_dossier(sis)]
    texto = briefing.componer(sis, triajes)
    return {"triajes": triajes, "borradores": borradores, "altas": altas, "dossiers": dossiers, "briefing": texto}
