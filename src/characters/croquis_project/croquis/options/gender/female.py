"""Nu: khung goc cua du an (khong thay doi gi)."""
from croquis.core.registry import register
from croquis.model.proportions import Proportions
from croquis.options.base import ProportionOption

register("gender", ProportionOption(
    id="female", label="Nữ", order=1,
    prop=Proportions(),
))
