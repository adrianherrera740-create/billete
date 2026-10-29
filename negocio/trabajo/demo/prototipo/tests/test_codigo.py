"""Pruebas de que el prototipo NO puede enviar, NO usa red y NO contiene secretos ni datos reales."""
import ast
import json
import re
import unittest
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ESPEC = RAIZ.parent / "especificacion-mvp.md"
PROHIBIDOS_IMPORT = {"smtplib", "imaplib", "poplib", "socket", "http", "urllib", "requests", "httpx", "aiohttp", "ftplib", "subprocess", "os"}


def fuentes():
    return list((RAIZ / "chief").glob("*.py"))


class TestSoloLecturaYBorradores(unittest.TestCase):
    def test_no_hay_funciones_de_envio(self):
        for f in fuentes():
            for n in ast.walk(ast.parse(f.read_text(encoding="utf-8"))):
                if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef)):
                    self.assertNotRegex(n.name.lower(), r"^(send|enviar|reenviar|forward|delete|borrar_correo|mover)", f"{f.name}:{n.name}")

    def test_sin_red_ni_procesos(self):
        for f in fuentes():
            for n in ast.walk(ast.parse(f.read_text(encoding="utf-8"))):
                mods = []
                if isinstance(n, ast.Import):
                    mods = [a.name.split(".")[0] for a in n.names]
                elif isinstance(n, ast.ImportFrom) and n.module and n.level == 0:
                    mods = [n.module.split(".")[0]]
                for m in mods:
                    self.assertNotIn(m, PROHIBIDOS_IMPORT, f"{f.name} importa {m}")

    def test_sin_secretos(self):
        patrones = [r"sk-[A-Za-z0-9]{16,}", r"AKIA[0-9A-Z]{12,}", r"ghp_[A-Za-z0-9]{20,}", r"xox[bap]-", r"AIza[0-9A-Za-z_-]{20,}",
                    r"(?i)(password|passwd|secret|api[_-]?key)\s*[:=]\s*['\"][^'\"]{6,}", r"\b\d{6}:[A-Za-z0-9_-]{30,}\b"]
        for f in list(RAIZ.rglob("*.py")) + list(RAIZ.rglob("*.json")) + list(RAIZ.rglob("*.txt")) + list(RAIZ.rglob("*.md")):
            t = f.read_text(encoding="utf-8")
            for p in patrones:
                self.assertIsNone(re.search(p, t), f"{f.name}: patron {p}")

    def test_datos_solo_ficticios(self):
        ok = re.compile(r"@[\w.-]+\.(example|test)\b")
        for nombre in ("correos.json", "agenda.json", "crm_inicial.json"):
            t = (RAIZ / "datos" / nombre).read_text(encoding="utf-8")
            for m in re.finditer(r"[\w.+-]+@[\w.-]+\.\w+", t):
                self.assertRegex(m.group(0), ok, f"{nombre}: {m.group(0)} no es dominio reservado")
            json.loads(t)

    def test_prompts_contienen_defensas_y_estan_en_la_especificacion(self):
        espec = ESPEC.read_text(encoding="utf-8") if ESPEC.exists() else ""
        for nombre in ("triaje", "borrador", "dossier"):
            p = (RAIZ / "prompts" / f"{nombre}.txt").read_text(encoding="utf-8")
            self.assertIn("NO FIABLE", p)
            self.assertIn("{token}", p)
            self.assertRegex(p, r"direcciones web")
            self.assertIn("SOLO con un JSON", p)
            self.assertIn(p.strip(), espec, f"el prompt {nombre} de la especificacion difiere del del prototipo")


if __name__ == "__main__":
    unittest.main()
