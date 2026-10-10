"""Dung chung cho mat truoc / mat sau: bien doi than-dau theo ti le, ham nan + lat guong."""
from croquis.core.svg import both
from croquis.core.warp import warp_svg

BASE_BODY_SCALE_Y = 0.92   # nguoi lon: than + chan + tay duoc rut 8% so voi khung goc
PIVOT_Y = 130              # diem co: cho co tiep giap cam
HEAD_PIVOT_Y = 136         # cam
FOOT_Y = 796               # mui chan thap nhat trong khung goc
FLOOR_Y = PIVOT_Y + (FOOT_Y - PIVOT_Y) * BASE_BODY_SCALE_Y   # mat san chung cho moi dang nguoi


def layout(prop):
    """Tra ve (ti le doc cua than, do dich doc) de chan luon dung tren cung mot mat san."""
    sy = BASE_BODY_SCALE_Y * prop.body_scale_y
    foot = PIVOT_Y + (FOOT_Y - PIVOT_Y) * sy
    return sy, FLOOR_Y - foot


def body_transform(prop):
    sy, dy = layout(prop)
    return f"translate(0,{dy:.2f}) translate(0,{PIVOT_Y}) scale(1,{sy:.4f}) translate(0,{-PIVOT_Y})"


def head_transform(prop):
    _, dy = layout(prop)
    h = prop.head_scale
    return (f"translate(0,{dy:.2f}) translate(0,{HEAD_PIVOT_Y}) scale({h:.4f}) "
            f"translate(0,{-HEAD_PIVOT_Y})")


def warped(svg, prop):
    """Nan be rong cac duong net phu theo ti le (de bong/nep di theo vong dang)."""
    return warp_svg(svg, lambda x, y: (x * prop.width_at(y), y))


def mirrored(svg, prop):
    return both(warped(svg, prop))
