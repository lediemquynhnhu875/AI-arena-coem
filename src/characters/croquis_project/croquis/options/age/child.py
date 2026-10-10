"""Tre em (~6 dau): dau to, than ngan han, bung hoi tron khong eo, tay chan ngan, ban tay nho."""
from croquis.core.registry import register
from croquis.model.proportions import Proportions
from croquis.options.base import ProportionOption

register("age", ProportionOption(
    id="child", label="Trẻ em", order=1,
    prop=Proportions(
        head_scale=1.22, body_scale_y=0.74, hand_scale=0.85, show_bust=False,
        arm_fat=-3.0, width_max=1.15,
        widths=dict(neck=0.9, shoulder=0.84, bust=0.98, waist=1.2, hip=0.88,
                    thigh=0.84, knee=0.9, calf=0.86, ankle=0.9),
    ),
))
