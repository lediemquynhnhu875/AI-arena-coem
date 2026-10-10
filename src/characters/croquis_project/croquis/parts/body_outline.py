"""Ghep than + chan thanh mot duong vien kin duy nhat, da nan theo ti le (Proportions)."""
from croquis.core.curves import curve, mirror
from croquis.model.shape import warp_body
from croquis.parts.points.torso_points import TORSO_OUTER
from croquis.parts.points.leg_points import LEG_OUTER, LEG_INNER


def body_path(prop):
    outer = warp_body(TORSO_OUTER + LEG_OUTER, prop)
    inner = warp_body(LEG_INNER, prop)
    right_inner = mirror(inner)[::-1]
    return ("M%.1f %.1f " % outer[0] + curve(outer) +
            " L%.1f %.1f " % inner[0] + curve(inner) + " " + curve(right_inner) +
            " L%.1f %.1f " % mirror(outer)[-1] + curve(mirror(outer)[::-1]) + " Z")


def neck_shoulder_path(prop):
    """Net tu duoi cam qua co thang den dau vai (ve de len tay cho net lien)."""
    pts = warp_body(TORSO_OUTER[:7], prop)
    return "M%.1f %.1f " % pts[0] + curve(pts)
