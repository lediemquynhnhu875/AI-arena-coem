"""Canh tay (den co tay), da nan theo ti le.
- arm_outline_path: chi net vien ngoai + trong, KHONG co canh dong
- arm_fill_path: hinh kin de to nen, bat dau som hon net vien mot doan o co de dau net khong lo vach"""
from croquis.core.curves import curve
from croquis.model.shape import warp_arm, warp_body
from croquis.parts.points.arm_points import ARM_OUTER, ARM_INNER, ARM_LEAD


def _parts(prop):
    outer, inner = warp_arm(ARM_OUTER, ARM_INNER, prop)
    lead = warp_body([ARM_LEAD], prop)[0]
    return outer, inner, lead


def arm_outline_path(prop):
    outer, inner, lead = _parts(prop)
    return ("M%.1f %.1f " % outer[0] + curve(outer, lead=lead) +
            " L%.1f %.1f " % inner[0] + curve(inner))


def arm_fill_path(prop):
    _, _, lead = _parts(prop)
    return "M%.1f %.1f L%s Z" % (lead[0], lead[1], arm_outline_path(prop)[1:])
