"""Mat truoc."""
from croquis.core.svg import both
from croquis.parts import head
from croquis.parts.body_outline import body_path, neck_shoulder_path
from croquis.parts.contour_weight import heavy_left_contour
from croquis.parts.details import bust, collarbone, leg_details, torso_lines
from croquis.parts.limb import arm_with_hand_svg
from croquis.parts.neck import neck_lines, neck_shade
from croquis.style.ink import ink, line
from croquis.views.common import body_transform, head_transform, mirrored, warped


def render(prop, hair):
    """hair: HairLayers da ghep (kieu toc + phu kien), xem croquis.render.compose_hair."""

    b = ink(body_path(prop)) + heavy_left_contour(prop)
    b += mirrored(leg_details.leg_shade() + torso_lines.torso_shade(), prop)
    fine_set = torso_lines.torso_fine() + leg_details.knee_lines()
    if prop.show_bust:
        fine_set += bust.bust_shade()
    b += mirrored(fine_set, prop)
    b += mirrored(collarbone.collarbone_svg(), prop) + warped(collarbone.notch_svg(), prop)
    b += both(arm_with_hand_svg(prop))
    b += both(line(neck_shoulder_path(prop), 1.1))
    b += warped(neck_shade(), prop) + mirrored(neck_lines(), prop)

    h = both(head.ear_svg()) + head.head_svg() + hair.front
    return (f'<g class="hair-behind" transform="{head_transform(prop)}">{hair.behind}</g>'
            f'<g class="body" transform="{body_transform(prop)}">{b}</g>'
            f'<g class="head" transform="{head_transform(prop)}">{h}</g>')
