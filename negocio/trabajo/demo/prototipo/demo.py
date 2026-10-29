"""Demo de 3 minutos en terminal. Uso: python3 demo.py [--ingenuo]  (sin red, sin credenciales)."""
import sys
from datetime import datetime, timedelta, timezone

from chief import dossier
from chief.aprobaciones import AprobacionDenegada
from chief.borrado import borrar, buscar
from chief.flujos import ejecutar_dia
from chief.modelo import ModeloIngenuo, ModeloReglas
from chief.sistema import AVISO, CLIENTE, crear

AHORA = datetime(2026, 11, 3, 7, 0, tzinfo=timezone(timedelta(hours=1)))


def titulo(t):
    print(f"\n=== {t} ===")


def main():
    modelo = ModeloIngenuo() if "--ingenuo" in sys.argv else ModeloReglas()
    sis = crear(modelo, AHORA)
    print(AVISO)
    print(f"Modelo: {type(modelo).__name__} (simulado; no hay LLM real ni servicios de pago)")
    r = ejecutar_dia(sis)
    titulo("1. BRIEFING 7:00")
    print(r["briefing"])
    titulo("2. DOSSIER (24 h antes): reunion con organizador conocido")
    print(dossier.a_texto(r["dossiers"][0]))
    titulo("2b. DOSSIER: invitacion de desconocido con inyeccion")
    print(dossier.a_texto(r["dossiers"][1]))
    titulo("3. APROBACIONES: lo que viaja por el canal (solo ID y verbo)")
    aid = sis.cola.pendientes()[0]["id"]
    print(sis.cola.mensaje_canal(aid))
    try:
        sis.cola.decidir(aid, "aprobar", "atacante@otro.example", sis.cola.codigo_dispositivo())
    except AprobacionDenegada as e:
        print("Intento desde cuenta no vinculada ->", e)
    try:
        sis.cola.decidir(aid, "aprobar", CLIENTE)
    except AprobacionDenegada as e:
        print("Sin segundo paso ->", e)
    ok = sis.cola.decidir(aid, "aprobar", CLIENTE, sis.cola.codigo_dispositivo())
    print("Cliente aprueba con segundo paso ->", ok["estado"], "(el borrador queda listo; lo envia el humano, el sistema no puede)")
    titulo("4. REGISTRO DE AUDITORIA")
    print("Cadena integra:", sis.registro.verificar(), "| entradas:", len(sis.registro.entradas()))
    titulo("5. BORRADO CON IDENTIFICADOR DE PRUEBA ZZ-PRUEBA-0001")
    print("Antes:", buscar(sis, "ZZ-PRUEBA-0001"))
    print("Certificado:", borrar(sis, "ZZ-PRUEBA-0001"))
    titulo("6. APAGADO")
    t0 = datetime.now()
    print(sis.interruptor.apagar(sis.cola))
    try:
        ejecutar_dia(sis)
    except RuntimeError as e:
        print("Tras apagar ->", e)
    print(f"Tiempo: {(datetime.now() - t0).total_seconds():.3f} s")


if __name__ == "__main__":
    main()
