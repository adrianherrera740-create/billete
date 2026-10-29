"""CRM: altas propuestas (pasan por aprobacion) y aplicadas solo si se aprueban."""
from datetime import timedelta

from .sistema import Sistema


def proponer_altas(sis: Sistema, triajes: list[dict]) -> list[str]:
    ids = []
    vistos = set()
    for t in triajes:
        if t["excluido"] or t["sospechoso"] or t["conocido"] or t["de"] in vistos:
            continue
        if t["etiqueta"] not in ("Responder", "Importante"):
            continue
        vistos.add(t["de"])
        aid = sis.cola.encolar("crm_alta", t["correo_id"], {"email": t["de"]})
        sis.registro.registrar(actor="crm", accion="alta_propuesta", ref=aid, resultado="pendiente")
        ids.append(aid)
    return ids


def aplicar_altas_aprobadas(sis: Sistema) -> int:
    n = 0
    caduca = (sis.reloj() + timedelta(days=365)).date().isoformat()
    for i in sis.cola._items.values():
        if i["tipo"] == "crm_alta" and i["estado"] == "aprobado" and not i.get("aplicado"):
            email = i["payload"]["email"]
            sis.crm.alta({"id": f"C-{len(sis.crm.todas()) + 1:03d}", "nombre": email.split("@")[0],
                          "email": email, "relacion": "contacto nuevo por confirmar",
                          "ultima_interaccion": sis.reloj().date().isoformat(), "notas": "", "caduca": caduca})
            i["aplicado"] = True
            sis.registro.registrar(actor="crm", accion="alta_aplicada", ref=i["id"], resultado="ok")
            n += 1
    return n
