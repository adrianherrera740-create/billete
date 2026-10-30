import unittest

from chief import crm_flujo
from chief.aprobaciones import AprobacionDenegada
from chief.apagado import SistemaApagado
from chief.auditoria import RegistroInvalido
from chief.borrado import borrar, buscar
from chief.crm import CRM, FichaInvalida
from chief.flujos import ejecutar_dia
from tests.base import Base


class TestAprobaciones(Base):
    def setUp(self):
        super().setUp()
        ejecutar_dia(self.sis)
        self.aid = next(i["id"] for i in self.sis.cola.pendientes() if i["tipo"] == "borrador")

    def test_aviso_de_bloqueo_solo_recuento(self):
        m = self.sis.cola.aviso_bloqueo()
        self.assertRegex(m, r"^Tienes \d+ asuntos? pendientes?\.$")
        for i in self.sis.cola.pendientes():
            self.assertNotIn(i["id"], m)
            self.assertNotIn(i["tipo"], m)
        for c in self.sis.buzon.listar_correos():
            self.assertNotIn(c["asunto"], m)
        self.assertNotIn("@", m)

    def test_texto_de_panel_lleva_id_pero_sin_asunto_ni_cuerpo(self):
        m = self.sis.cola.texto_panel(self.aid)
        self.assertIn(self.aid, m)
        for c in self.sis.buzon.listar_correos():
            self.assertNotIn(c["asunto"], m)
        self.assertNotIn("@", m)

    def test_cuenta_no_vinculada_rechazada(self):
        with self.assertRaises(AprobacionDenegada):
            self.sis.cola.decidir(self.aid, "aprobar", "otro@x.example", self.sis.cola.codigo_dispositivo())

    def test_segundo_paso_obligatorio_y_correcto(self):
        for codigo in (None, "", "000000x"):
            with self.assertRaises(AprobacionDenegada):
                self.sis.cola.decidir(self.aid, "aprobar", self.cliente, codigo)
        r = self.sis.cola.decidir(self.aid, "aprobar", self.cliente, self.sis.cola.codigo_dispositivo())
        self.assertEqual(r["estado"], "aprobado")

    def test_no_se_decide_dos_veces(self):
        self.sis.cola.decidir(self.aid, "rechazar", self.cliente)
        with self.assertRaises(AprobacionDenegada):
            self.sis.cola.decidir(self.aid, "aprobar", self.cliente, self.sis.cola.codigo_dispositivo())

    def test_aprobar_borrador_no_envia_nada(self):
        self.sis.cola.decidir(self.aid, "aprobar", self.cliente, self.sis.cola.codigo_dispositivo())
        self.assertTrue(all(b["estado"] == "borrador" for b in self.sis.buzon.borradores()))
        self.assertFalse(hasattr(self.sis.buzon, "enviar"))


class TestCRM(Base):
    def test_rechaza_campos_y_categorias_especiales(self):
        c = CRM()
        base = {"nombre": "A", "email": "a@x.example", "caduca": "2027-01-01"}
        with self.assertRaises(FichaInvalida):
            c.alta({**base, "diagnostico": "x"})
        with self.assertRaises(FichaInvalida):
            c.alta({**base, "notas": "Tiene una enfermedad cronica"})
        with self.assertRaises(FichaInvalida):
            c.alta({**base, "notas": "Afiliado a un sindicato y partido politico"})
        with self.assertRaises(FichaInvalida):
            c.alta({"nombre": "A", "email": "a@x.example"})  # sin caducidad

    def test_alta_solo_con_aprobacion(self):
        r = ejecutar_dia(self.sis)
        antes = len(self.sis.crm.todas())
        self.assertTrue(r["altas"])
        self.assertEqual(len(self.sis.crm.todas()), antes)  # propuestas no aplican nada
        self.assertEqual(crm_flujo.aplicar_altas_aprobadas(self.sis), 0)
        self.sis.cola.decidir(r["altas"][0], "aprobar", self.cliente)
        self.assertEqual(crm_flujo.aplicar_altas_aprobadas(self.sis), 1)
        self.assertEqual(len(self.sis.crm.todas()), antes + 1)

    def test_no_se_propone_alta_de_sospechosos_ni_excluidos(self):
        r = ejecutar_dia(self.sis)
        refs = {self.sis.cola.item(a)["ref"] for a in r["altas"]}
        self.assertFalse(refs & {"e003", "e004", "e006", "e009"})

    def test_caducidad(self):
        self.assertEqual(self.sis.crm.purgar_caducadas("2028-01-01"), 3)


class TestAuditoria(Base):
    def test_cadena_integra_y_manipulacion_detectada(self):
        ejecutar_dia(self.sis)
        self.assertTrue(self.sis.registro.verificar())
        self.sis.registro._entradas[2]["resultado"] = "manipulado"
        self.assertFalse(self.sis.registro.verificar())

    def test_sin_cuerpos(self):
        ejecutar_dia(self.sis)
        volcado = self.sis.registro.exportar_jsonl()
        for c in self.sis.buzon.listar_correos():
            self.assertNotIn(c["cuerpo"][:30], volcado)
        with self.assertRaises(RegistroInvalido):
            self.sis.registro.registrar(accion="x", cuerpo="hola")
        with self.assertRaises(RegistroInvalido):
            self.sis.registro.registrar(accion="x", ref="a" * 200)

    def test_no_hay_api_de_edicion_o_borrado(self):
        for n in ("editar", "borrar", "eliminar", "modificar"):
            self.assertFalse(hasattr(self.sis.registro, n))


class TestApagadoYBorrado(Base):
    def test_apagado(self):
        ejecutar_dia(self.sis)
        r = self.sis.interruptor.apagar(self.sis.cola)
        self.assertEqual(r["tokens_revocados"], 2)
        self.assertEqual(self.sis.cola.pendientes(), [])
        self.assertEqual(self.sis.interruptor.tokens, {})
        with self.assertRaises(SistemaApagado):
            ejecutar_dia(self.sis)

    def test_borrado_certificado(self):
        ejecutar_dia(self.sis)
        ident = "ZZ-PRUEBA-0001"
        antes = buscar(self.sis, ident)
        self.assertGreater(sum(antes.values()), 0)
        cert = borrar(self.sis, ident)
        self.assertTrue(cert["completo"])
        self.assertEqual(sum(buscar(self.sis, ident).values()), 0)
        self.assertNotIn(ident, str(cert))  # el certificado guarda solo la huella
        self.assertTrue(cert["pendiente_en_produccion"])
        self.assertTrue(self.sis.registro.verificar())
        for i in self.sis.cola.pendientes():
            if i["tipo"] == "borrador":
                self.assertTrue(any(b["id"] == i["ref"] for b in self.sis.buzon.borradores()))


if __name__ == "__main__":
    unittest.main()
