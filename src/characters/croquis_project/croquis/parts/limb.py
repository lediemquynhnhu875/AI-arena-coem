"""Canh tay + ban tay hop nhat: vai -> bap tay -> co tay -> ban tay lien mot net."""
from croquis.model.shape import wrist_dx
from croquis.parts import hand
from croquis.parts.arm import arm_outline_path, arm_fill_path
from croquis.style.ink import outline, fill


def _hand_group(inner, prop):
    # dua ban tay ve dung co tay moi (y 410 -> 390), thu nho 7% quanh co tay,
    # roi dich ngang theo do than rong / hep
    dx = 5 + wrist_dx(prop)
    s = 0.93 * prop.hand_scale
    return (f'<g transform="translate({dx:.1f},-20) translate(-85.5,410) scale({s:.3f}) '
            f'translate(85.5,-410)">{inner}</g>')


def arm_with_hand_svg(prop):
    outlines = (outline(arm_outline_path(prop), hand.OUTLINE_W, cap="butt")
                + _hand_group(hand.hand_outline_layer(), prop))
    fills = fill(arm_fill_path(prop)) + _hand_group(hand.hand_fill_layer(), prop)
    return outlines + fills + _hand_group(hand.hand_detail_layer(), prop)
