"""Tram cai ngoc: mot doan tram xuyen toc, hat ngoc o dau (mat sau co ngoc o ca hai dau)."""
from croquis.core.registry import register
from croquis.options.base import AccessoryOption, HairLayers
from croquis.style.context import theme


def pearl(cx, cy, r=2.4):
    t = theme()
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#fbf7f1" stroke="{t.ink}" '
            f'stroke-width=".5" stroke-opacity=".7"/>'
            f'<circle cx="{cx - r*.3:.1f}" cy="{cy - r*.3:.1f}" r="{r*.3:.1f}" fill="#ffffff"/>')


def draw(view, slot):
    (x1, y1), (x2, y2) = slot
    t = theme()
    w, op = (".9", "1") if view == "back" else (".8", ".7")
    pin = (f'<path d="M{x1} {y1} L{x2} {y2}" stroke="{t.ink}" stroke-width="{w}" '
           f'stroke-linecap="round" opacity="{op}"/>')
    if view == "front":
        return HairLayers(front=pin + pearl(x1, y1))
    return HairLayers(front=pin + pearl(x1, y1, 2.6) + pearl(x2, y2, 2.0))


register("accessory", AccessoryOption(id="pearl_pin", label="Trâm ngọc", order=1,
                                      draw=draw, requires="pin"))
