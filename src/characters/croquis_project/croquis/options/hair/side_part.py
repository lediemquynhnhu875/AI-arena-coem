"""Toc re ngoi (nam): mai hat sang mot ben, ngan hon o hai mai, day hon o dinh."""
from croquis.core.registry import register
from croquis.options.base import HairOption, HairLayers
from croquis.style.ink import hair_shape, hair_strand

FRONT = ("M-26.5 92 C-29 56 -12 44 2 44 C16 44 29 56 26.5 92 C24 80 22 72 17 66 "
         "C10 61 -2 62 -10 66 C-16 70 -20 74 -22 80 C-23 84 -25 88 -26.5 92 Z")
BACK = ("M-26.5 90 C-27 58 -14 45 1 45 C15 45 27 58 26.5 90 C26.5 99 22 105 16 108 "
        "C8 104 -8 104 -16 108 C-22 105 -26.5 99 -26.5 90 Z")


def draw(view):
    if view == "front":
        return HairLayers(front=hair_shape(FRONT) + hair_strand("M-12 48 C-14 56 -12 62 -6 65", .8)
                          + hair_strand("M2 45 C8 50 16 58 22 74") + hair_strand("M-4 46 C4 52 12 56 15 64", .7))
    return HairLayers(front=hair_shape(BACK) + hair_strand("M1 47 C0 70 0 92 1 105", .6)
                      + hair_strand("M-13 55 C-18 74 -17 92 -12 105") + hair_strand("M13 55 C18 74 17 92 12 105"))


register("hair", HairOption(id="side_part", label="Tóc rẽ ngôi", order=7, draw=draw,
                            default_color="#2b2420", genders=("male",)))
