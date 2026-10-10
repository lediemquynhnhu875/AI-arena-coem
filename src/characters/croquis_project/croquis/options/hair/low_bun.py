"""Bui thap thanh lich (Chuan mau): mu toc vuot ra sau, bui o gay (chi thay tu phia sau)."""
from croquis.core.registry import register
from croquis.options.base import HairOption, HairLayers
from croquis.options.hair._common import front_cap, back_cap, nape_bun, BUN_SLOTS


def draw(view):
    if view == "front":
        return HairLayers(front=front_cap())
    return HairLayers(front=back_cap() + nape_bun())


register("hair", HairOption(id="low_bun", label="Búi thấp thanh lịch (Chuẩn mẫu)", order=1,
                            draw=draw, default_color="#2b2420", genders=("female",), slots=BUN_SLOTS))
