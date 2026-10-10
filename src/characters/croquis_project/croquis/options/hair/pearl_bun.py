"""Bui cai tram ngoc = bui thap + phu kien 'pearl_pin' (dung lai accessory, khong ve trung).
Van giu thanh mot kieu toc rieng de UI cu co nut san; nguoi dung cung co the chon
'Bui thap' + phu kien 'Tram ngoc' de ra cung ket qua."""
from croquis.core.registry import register
from croquis.options.accessory.pearl_pin import draw as pearl_pin
from croquis.options.base import HairOption
from croquis.options.hair._common import BUN_SLOTS
from croquis.options.hair.low_bun import draw as low_bun


def draw(view):
    return low_bun(view) + pearl_pin(view, BUN_SLOTS["pin"][view])


register("hair", HairOption(id="pearl_bun", label="Búi cài trâm ngọc", order=3, draw=draw,
                            default_color="#2b2420", genders=("female",), slots={k: v for k, v in BUN_SLOTS.items() if k != "pin"},
                            bundled_accessory="pearl_pin"))
