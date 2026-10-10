"""Toc hoa ram: bui thap mau bac, xen soi trang."""
from croquis.core.registry import register
from croquis.options.base import HairOption, HairLayers
from croquis.options.hair._common import front_cap, back_cap, nape_bun, BUN_SLOTS
from croquis.style.ink import hair_strand


def _streaks(view):
    if view == "front":
        return "".join(hair_strand(d, .9) for d in (
            "M-4 49 C-12 53 -19 62 -22 80", "M5 49 C13 54 20 64 23 82", "M0 50 C-3 54 -5 58 -6 62"))
    return "".join(hair_strand(d, .9) for d in (
        "M-8 54 C-13 74 -12 96 -8 114", "M9 54 C14 76 13 98 9 114"))


def draw(view):
    if view == "front":
        return HairLayers(front=front_cap() + _streaks(view))
    return HairLayers(front=back_cap() + nape_bun() + _streaks(view))


register("hair", HairOption(id="silver", label="Tóc hoa râm", order=5,
                            draw=draw, default_color="#a8a4a1", slots=BUN_SLOTS))
