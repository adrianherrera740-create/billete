"""Genera el icono de La Nave (build/icon.png y build/icon.ico) sin recursos de terceros.
Uso: python3 build/make-icon.py   (necesita Pillow)"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

S = 1024  # se dibuja grande y se reduce para suavizar los bordes
OUT = Path(__file__).parent


def gradient(size):
    top, bottom = (24, 36, 68), (8, 12, 24)
    img = Image.new("RGB", (size, size))
    px = img.load()
    for y in range(size):
        t = y / (size - 1)
        row = tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
        for x in range(size):
            px[x, y] = row
    return img


def build():
    bg = gradient(S).convert("RGBA")
    mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, S - 1, S - 1), radius=int(S * 0.22), fill=255)
    icon = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    icon.paste(bg, (0, 0), mask)

    d = ImageDraw.Draw(icon)
    # estrellas
    for x, y, r in [(150, 170, 5), (860, 140, 6), (780, 330, 4), (210, 520, 4), (900, 640, 5), (120, 780, 6), (700, 880, 4)]:
        d.ellipse((x - r, y - r, x + r, y + r), fill=(190, 210, 255, 230))

    cx = S // 2
    # llama
    flame = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    fd = ImageDraw.Draw(flame)
    fd.polygon([(cx - 70, 700), (cx + 70, 700), (cx, 940)], fill=(255, 150, 40, 255))
    fd.polygon([(cx - 36, 700), (cx + 36, 700), (cx, 850)], fill=(255, 220, 120, 255))
    icon.alpha_composite(flame.filter(ImageFilter.GaussianBlur(6)))
    d = ImageDraw.Draw(icon)
    # aletas
    d.polygon([(cx - 120, 520), (cx - 250, 740), (cx - 120, 700)], fill=(79, 140, 255, 255))
    d.polygon([(cx + 120, 520), (cx + 250, 740), (cx + 120, 700)], fill=(79, 140, 255, 255))
    # cuerpo
    d.rounded_rectangle((cx - 120, 300, cx + 120, 720), radius=110, fill=(236, 242, 255, 255))
    d.polygon([(cx - 120, 360), (cx, 110), (cx + 120, 360)], fill=(236, 242, 255, 255))
    d.polygon([(cx - 90, 330), (cx, 120), (cx + 90, 330)], fill=(79, 140, 255, 255))
    # ventanilla
    d.ellipse((cx - 62, 400, cx + 62, 524), fill=(24, 36, 68, 255))
    d.ellipse((cx - 46, 416, cx + 46, 508), fill=(120, 190, 255, 255))
    d.ellipse((cx - 30, 428, cx - 4, 454), fill=(255, 255, 255, 200))
    return icon


icon = build()
icon.resize((512, 512), Image.LANCZOS).save(OUT / "icon.png")
sizes = [16, 24, 32, 48, 64, 128, 256]
icon.resize((256, 256), Image.LANCZOS).save(OUT / "icon.ico", sizes=[(s, s) for s in sizes])
print("icon.png e icon.ico generados")
