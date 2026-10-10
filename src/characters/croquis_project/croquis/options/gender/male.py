"""Nam: vai rong, nguc no, eo gan bang hong (khong thon eo), co day, tay chan chac, ban tay lon."""
from croquis.core.registry import register
from croquis.model.proportions import Proportions
from croquis.options.base import ProportionOption

register("gender", ProportionOption(
    id="male", label="Nam", order=2,
    prop=Proportions(
        body_scale_y=1.06, arm_fat=5.0, hand_scale=1.1, show_bust=False,
        widths=dict(neck=1.38, shoulder=1.30, bust=1.20, waist=1.42, hip=0.90,
                    thigh=0.98, knee=1.12, calf=1.14, ankle=1.12),
    ),
))
