"""Flujo 3: dossier de reunion 24 h antes. Fuentes elegidas por regla, no por el modelo (R2)."""
from datetime import datetime, timedelta

from . import deteccion, exclusion
from .esquemas import ESQUEMA_DOSSIER, SalidaInvalida, parse
from .filtro_salida import limpiar
from .modelo import ModeloNoDisponible
from .saneo import a_texto_plano
from .sistema import CLIENTE, Sistema, prompt
from .triaje import preparar_entrada

NO_VERIFICADA = "Reunion con persona u organizacion no verificada: no hay antecedentes en el CRM. No se ha enriquecido con datos privados."


def eventos_para_dossier(sis: Sistema) -> list[dict]:
    ahora = sis.reloj()
    return [e for e in sis.buzon.listar_eventos()
            if ahora < datetime.fromisoformat(e["inicio"]) <= ahora + timedelta(hours=24)]


def generar(sis: Sistema, ev: dict) -> dict:
    sis.interruptor.exigir_activo()
    org = ev["organizador"]
    org_conocido = sis.crm.conoce(org) or org == CLIENTE
    asist, contexto = [], []
    for a in ev["asistentes"]:
        ficha = sis.crm.obtener(a)
        if ficha is None and a != CLIENTE:
            asist.append({"email": a, "estado": "no fiable: sin enriquecimiento"})
            continue
        if a == CLIENTE:
            continue
        asuntos = []
        for c in sis.buzon.listar_correos():
            if c["de"].lower() == a.lower() and exclusion.motivo_exclusion(c) is None:
                asuntos.append((c["fecha"], limpiar(a_texto_plano(c["asunto"]).texto)[0]))
        ultimos = [s for _, s in sorted(asuntos, reverse=True)[:3]]
        asist.append({"email": a, "estado": "conocido", "ficha": {k: ficha[k] for k in ("nombre", "organizacion", "relacion", "ultima_interaccion", "notas")},
                      "ultimos_asuntos": ultimos})
        contexto.append(f"{ficha['nombre']} ({ficha['organizacion']}): {ficha['relacion']}. Notas: {ficha['notas']}. Ultimos asuntos: {'; '.join(ultimos)}")

    avisos, descripcion, puntos, preguntas = [], "(omitida)", [NO_VERIFICADA], []
    desc = a_texto_plano(ev.get("descripcion", ""))
    senales = deteccion.senales(f"{ev['titulo']}\n{desc.texto}", desc.oculto_descartado, desc.invisibles)
    if not org_conocido:
        avisos.append("organizador no verificado: descripcion omitida")
    elif senales:
        avisos.append("la descripcion contiene instrucciones; omitida: " + "; ".join(senales))
    else:
        descripcion = limpiar(desc.texto)[0][:300]
        titulo_ok = limpiar(a_texto_plano(ev["titulo"]).texto)[0]
        token, entrada = preparar_entrada("dossier", f"Titulo: {titulo_ok}\nDescripcion: {descripcion}\n" + "\n".join(contexto))
        try:
            d = parse(sis.modelo.completar("dossier", prompt("dossier").replace("{token}", token), entrada), ESQUEMA_DOSSIER)
            puntos = [limpiar(p)[0] for p in d["puntos"]]
            preguntas = [limpiar(p)[0] for p in d["preguntas"]]
        except (SalidaInvalida, ModeloNoDisponible):
            avisos.append("sin puntos de conversacion: el modelo no respondio de forma valida")
            puntos = []
    res = {"evento_id": ev["id"], "titulo": limpiar(a_texto_plano(ev["titulo"]).texto)[0], "inicio": ev["inicio"],
           "asistentes": asist, "descripcion": descripcion, "puntos": puntos, "preguntas": preguntas, "avisos": avisos,
           "organizador_conocido": org_conocido}
    sis.registro.registrar(actor="dossier", accion="dossier", ref=ev["id"], resultado="conocido" if org_conocido else "no verificado")
    return res


def a_texto(d: dict) -> str:
    out = [f"DOSSIER {d['inicio'][:16].replace('T', ' ')} - {d['titulo']}", ""]
    for a in d["asistentes"]:
        if a["estado"] == "conocido":
            f = a["ficha"]
            out.append(f"  {f['nombre']} ({f['organizacion']}) - {f['relacion']}; ultima interaccion {f['ultima_interaccion']}")
            out += [f"    ultimo asunto: {s}" for s in a["ultimos_asuntos"]]
        else:
            out.append(f"  {a['email']} - {a['estado']}")
    out += ["", f"Descripcion: {d['descripcion']}", "Puntos:"] + [f"  - {p}" for p in d["puntos"]]
    if d["preguntas"]:
        out += ["Preguntas abiertas:"] + [f"  - {p}" for p in d["preguntas"]]
    if d["avisos"]:
        out += ["Avisos:"] + [f"  - {p}" for p in d["avisos"]]
    return limpiar("\n".join(out))[0]
