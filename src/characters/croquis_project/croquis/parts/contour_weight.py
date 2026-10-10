"""Net dam hon doc mep ben trai tu eo xuong mui chan (kieu but chi trong anh mau)."""
from croquis.core.curves import curve
from croquis.model.shape import warp_body
from croquis.parts.points.torso_points import TORSO_OUTER
from croquis.parts.points.leg_points import LEG_OUTER
from croquis.style.context import theme

WAIST_Y = 288


def heavy_left_contour(prop):
    pts = warp_body([p for p in TORSO_OUTER if p[1] >= WAIST_Y] + LEG_OUTER, prop)
    d = "M%.1f %.1f " % pts[0] + curve(pts)
    return (f'<path d="{d}" fill="none" stroke="{theme().ink}" stroke-width="1.7" '
            f'stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>')
