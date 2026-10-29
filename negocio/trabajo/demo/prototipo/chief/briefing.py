"""Flujo 1: briefing 7:00. Se compone con una plantilla DETERMINISTA: el modelo no decide que aparece (R1)."""
from .filtro_salida import limpiar
from .sistema import AVISO, Sistema

ORDEN = ["Riesgo", "Responder", "Importante", "Informativo", "Revisar"]
TITULOS = {"Riesgo": "RIESGO (verifica antes de actuar)", "Responder": "Para responder", "Importante": "Importante",
           "Informativo": "Informativo", "Revisar": "Sin clasificar (revision manual)"}


def componer(sis: Sistema, triajes: list[dict]) -> str:
    sis.interruptor.exigir_activo()
    ahora = sis.reloj()
    excl = [t for t in triajes if t["excluido"]]
    sosp = [t for t in triajes if t["sospechoso"]]
    normales = [t for t in triajes if not t["excluido"] and not t["sospechoso"]]
    out = [f"BRIEFING {ahora:%H:%M} - {ahora:%d/%m/%Y}", AVISO, ""]
    out.append(f"Resumen: {len(triajes)} correos. {len(excl)} excluidos por regla (la IA no los leyo). "
               f"{len(sosp)} para revisar con cuidado. {len(sis.cola.pendientes())} pendientes de tu aprobacion.")
    out += ["", "AGENDA DE HOY"]
    hoy = [e for e in sis.buzon.listar_eventos() if e["inicio"][:10] == ahora.date().isoformat()]
    for e in sorted(hoy, key=lambda e: e["inicio"]):
        titulo, _ = limpiar(e["titulo"])
        marca = "" if e["organizador_conocido"] else " (organizador no verificado)"
        out.append(f"  {e['inicio'][11:16]}  {titulo}{marca}")
    if not hoy:
        out.append("  Sin eventos.")
    for et in ORDEN:  # los normales aparecen TODOS: nada puede ocultarse por instruccion de un correo
        grupo = sorted((t for t in normales if t["etiqueta"] == et), key=lambda t: {"alta": 0, "media": 1, "baja": 2}[t["prioridad"]])
        if not grupo:
            continue
        out += ["", TITULOS[et].upper()]
        for t in grupo:
            extra = f" [{'; '.join(t['avisos'])}]" if t["avisos"] else ""
            out.append(f"  {t['correo_id']} ({t['prioridad']}) {t['de']}: {t['resumen']}{extra}")
    if sosp:
        out += ["", "PARA REVISAR CON CUIDADO (no se resumen)"]
        for t in sosp:
            out.append(f"  {t['correo_id']} {t['de']}: {'; '.join(t['senales']) or 'sospecha del modelo'}")
    if excl:
        out += ["", "EXCLUIDOS POR REGLA"] + [f"  {t['correo_id']}: {t['avisos'][0]}" for t in excl]
    pend = sis.cola.pendientes()
    if pend:
        out += ["", "PENDIENTE DE APROBAR (solo referencias)"] + [f"  {i['id']} {i['tipo']} {i['ref']}" for i in pend]
    texto, _ = limpiar("\n".join(out))
    sis.registro.registrar(actor="briefing", accion="briefing", ref=ahora.strftime("%Y%m%d-%H%M"), resultado=f"{len(triajes)} correos")
    return texto
