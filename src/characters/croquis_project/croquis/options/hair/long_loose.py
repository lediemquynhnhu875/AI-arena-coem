"""Toc dai buong xoa: dai toc phia sau vai + hai loc truoc nguc."""
from croquis.core.registry import register
from croquis.options.base import HairOption, HairLayers
from croquis.options.hair._common import front_cap, CAP_BACK
from croquis.style.ink import hair_shape, hair_strand

BEHIND = ("M-27 70 C-36 120 -38 190 -32 258 C-18 266 18 266 32 258 "
          "C38 190 36 120 27 70 Z")
LOCK_L = ("M-26.5 92 C-31 130 -37 190 -35 244 C-31 252 -23 250 -21 240 "
          "C-19 190 -22 135 -23.5 100 Z")
BACK_FALL = ("M-27 72 C-37 130 -39 205 -33 268 C-18 277 18 277 33 268 "
             "C39 205 37 130 27 72 Z")


def draw(view):
    if view == "front":
        locks = hair_shape(LOCK_L) + hair_shape(_mirror(LOCK_L))
        strands = (hair_strand("M-31 140 C-34 180 -33 215 -31 240")
                   + hair_strand("M31 140 C34 180 33 215 31 240"))
        return HairLayers(behind=hair_shape(BEHIND), front=front_cap() + locks + strands)
    cap = hair_shape(CAP_BACK) + hair_shape(BACK_FALL)
    strands = "".join(hair_strand(f"M{x} 64 C{x*1.18:.1f} 130 {x*1.2:.1f} 205 {x*1.05:.1f} 268", .6)
                      for x in (-14, -6, 0, 6, 14))
    return HairLayers(front=cap + strands)


def _mirror(d):
    from croquis.core.warp import warp_path
    return warp_path(d, lambda x, y: (-x, y))


register("hair", HairOption(id="long_loose", label="Tóc dài buông xõa", order=2,
                            draw=draw, default_color="#2b2420", genders=("female",),
                            slots={"clip": {"front": (-18, 66), "back": (17, 76)}}))
