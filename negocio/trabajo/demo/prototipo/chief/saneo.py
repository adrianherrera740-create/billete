"""Saneado de contenido entrante (no fiable): HTML a texto plano, sin texto oculto."""
import re
import unicodedata
from dataclasses import dataclass
from html.parser import HTMLParser

VOID = {"br", "img", "hr", "meta", "link", "input", "area", "base", "col", "embed", "source", "track", "wbr"}
BLOQUE = {"p", "div", "li", "tr", "h1", "h2", "h3", "h4", "table", "blockquote", "section"}
OCULTO = re.compile(
    r"display\s*:\s*none|visibility\s*:\s*hidden|font-size\s*:\s*0(px|pt|em)?\s*(;|$)"
    r"|color\s*:\s*(#fff(fff)?\b|white\b|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\))"
    r"|opacity\s*:\s*0(\.0+)?\s*(;|$)",
    re.I,
)
INVISIBLES = {ord(c): None for c in "​‌‍⁠﻿­‪‫‬‭‮⁦⁧⁨⁩"}
MAX_CARACTERES = 6000


class _Parser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.visible: list[str] = []
        self.oculto: list[str] = []
        self.pila: list[tuple[str, bool]] = []

    def _add(self, texto: str) -> None:
        destino = self.oculto if any(h for _, h in self.pila) else self.visible
        destino.append(texto)

    def handle_starttag(self, tag, attrs):
        if tag in VOID:
            if tag == "br":
                self._add("\n")
            return
        atributos = dict(attrs)
        oculto = bool(OCULTO.search(atributos.get("style") or "")) or "hidden" in atributos or tag in ("script", "style", "template")
        self.pila.append((tag, oculto))
        if tag in BLOQUE:
            self._add("\n")

    def handle_endtag(self, tag):
        for i in range(len(self.pila) - 1, -1, -1):
            if self.pila[i][0] == tag:
                del self.pila[i:]
                break
        if tag in BLOQUE:
            self._add("\n")

    def handle_data(self, data):
        self._add(data)

    def handle_comment(self, data):
        self.oculto.append(data)


@dataclass
class Saneado:
    texto: str
    oculto_descartado: bool
    invisibles: int
    truncado: bool


def _es_html(texto: str) -> bool:
    return bool(re.search(r"<\s*/?\s*[a-zA-Z][^>]*>", texto))


def a_texto_plano(cuerpo: str) -> Saneado:
    """Devuelve texto plano visible. El texto oculto se descarta y se avisa."""
    oculto = False
    if _es_html(cuerpo):
        p = _Parser()
        p.feed(cuerpo)
        p.close()
        texto = "".join(p.visible)
        oculto = any(t.strip() for t in p.oculto)
    else:
        texto = cuerpo
    texto = unicodedata.normalize("NFKC", texto)
    invisibles = sum(1 for c in texto if ord(c) in INVISIBLES)
    texto = texto.translate(INVISIBLES)
    texto = "\n".join(re.sub(r"[ \t]+", " ", l).strip() for l in texto.splitlines())
    texto = re.sub(r"\n{3,}", "\n\n", texto).strip()
    truncado = len(texto) > MAX_CARACTERES
    return Saneado(texto[:MAX_CARACTERES], oculto, invisibles, truncado)
