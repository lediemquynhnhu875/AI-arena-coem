"""Toc cat ngan (nam): mu toc om sat dau, chan toc thang, mai ngan."""
from croquis.core.registry import register
from croquis.options.base import HairOption, HairLayers
from croquis.style.ink import hair_shape, hair_strand

FRONT = ("M-26.5 90 C-28 58 -12 46 0 46 C12 46 28 58 26.5 90 C24 78 21 71 15 67 "
         "C7 64 -7 64 -15 67 C-21 71 -24 78 -26.5 90 Z")
BACK = ("M-26.5 90 C-27 60 -14 47 0 47 C14 47 27 60 26.5 90 C26.5 99 22 104 16 107 "
        "C8 103 -8 103 -16 107 C-22 104 -26.5 99 -26.5 90 Z")


def draw(view):
    if view == "front":
        return HairLayers(front=hair_shape(FRONT) + hair_strand("M0 47 C-9 50 -17 57 -21 70")
                          + hair_strand("M0 47 C9 50 17 57 21 70") + hair_strand("M-6 50 C-4 56 -3 60 -2 64", .6))
    return HairLayers(front=hair_shape(BACK) + hair_strand("M0 49 C-1 70 -1 90 0 104", .6)
                      + hair_strand("M-12 56 C-18 74 -17 92 -12 104") + hair_strand("M12 56 C18 74 17 92 12 104"))


register("hair", HairOption(id="short_crop", label="Tóc cắt ngắn", order=6, draw=draw,
                            default_color="#2b2420", genders=("male",)))
