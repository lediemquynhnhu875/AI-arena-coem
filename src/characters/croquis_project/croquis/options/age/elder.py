"""Cao tuoi: vai hoi xuoi, eo day hon, than ngan nhe."""
from croquis.core.registry import register
from croquis.model.proportions import Proportions
from croquis.options.base import ProportionOption

register("age", ProportionOption(
    id="elder", label="Cao tuổi", order=3,
    prop=Proportions(
        body_scale_y=0.97,
        widths=dict(shoulder=0.97, waist=1.12, hip=0.98),
    ),
))
