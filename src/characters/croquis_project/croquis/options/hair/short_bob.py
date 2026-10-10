"""Toc ngan tan thoi: bob ngang cam, mai vuot lech."""
from croquis.core.registry import register
from croquis.options.base import HairOption, HairLayers
from croquis.style.ink import hair_shape, hair_strand

BEHIND = ("M-28 82 C-34 102 -32 120 -26 130 C-10 135 10 135 26 130 "
          "C32 120 34 102 28 82 Z")
FRONT = ("M-27.5 104 C-31 60 -13 45 0 45 C13 45 31 60 27.5 104 "
         "C27 112 26 120 22 124 C21 106 20 90 17 80 C10 70 0 66 -8 68 "
         "C-14 78 -20 92 -22 124 C-26 120 -27 112 -27.5 104 Z")
BACK = ("M-28 90 C-30 56 -14 46 0 46 C14 46 30 56 28 90 C30 108 29 122 23 129 "
        "C10 134 -10 134 -23 129 C-29 122 -30 108 -28 90 Z")


def draw(view):
    if view == "front":
        return HairLayers(behind=hair_shape(BEHIND),
                          front=hair_shape(FRONT) + hair_strand("M-6 50 C-14 60 -19 78 -20 100")
                          + hair_strand("M8 50 C16 62 20 80 21 102"))
    return HairLayers(front=hair_shape(BACK) + hair_strand("M0 48 C-1 80 -1 110 0 130", .6)
                      + hair_strand("M-14 60 C-19 90 -18 112 -14 126")
                      + hair_strand("M14 60 C19 90 18 112 14 126"))


register("hair", HairOption(id="short_bob", label="Tóc ngắn tân thời", order=4,
                            draw=draw, default_color="#2b2420",
                            slots={"clip": {"front": (-21, 74), "back": (18, 80)}}))
