"""Nguoi lon: khung goc."""
from croquis.core.registry import register
from croquis.model.proportions import Proportions
from croquis.options.base import ProportionOption

register("age", ProportionOption(
    id="adult", label="Người lớn", order=2,
    prop=Proportions(),
))
