from croquis.core.registry import register
from croquis.options.base import AccessoryOption, HairLayers

register("accessory", AccessoryOption(id="none", label="Không", order=0,
                                      draw=lambda view, slot: HairLayers()))
