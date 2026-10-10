"""Hoa cai toc: bong hoa 5 canh nho gan o diem 'clip' cua kieu toc."""
import math

from croquis.core.registry import register
from croquis.options.base import AccessoryOption, HairLayers
from croquis.style.context import theme

PETAL = "#f3c6cf"
CORE = "#e7a93a"


def _flower(cx, cy, r):
    t = theme()
    petals = []
    for i in range(5):
        a = math.radians(-90 + i * 72)
        px, py = cx + math.cos(a) * r * .72, cy + math.sin(a) * r * .72
        petals.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{r*.55:.1f}" fill="{PETAL}" '
                      f'stroke="{t.ink}" stroke-width=".5" stroke-opacity=".6"/>')
    return "".join(petals) + f'<circle cx="{cx}" cy="{cy}" r="{r*.38:.1f}" fill="{CORE}" stroke="{t.ink}" stroke-width=".4" stroke-opacity=".6"/>'


def draw(view, slot):
    x, y = slot
    return HairLayers(front=_flower(x, y, 5.2 if view == "front" else 5.6))


register("accessory", AccessoryOption(id="flower_clip", label="Hoa cài tóc", order=2,
                                      draw=draw, requires="clip"))
