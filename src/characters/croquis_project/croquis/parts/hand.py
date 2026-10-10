"""Ve ban tay thanh MOT khoi lien: ve het vien truoc, to nen da sau,
nen cac moi noi giua long ban tay - ngon - co tay bi che di."""
from croquis.parts.hand_shapes import PALM, FINGERS, THUMB, FINGER_GAPS, finger_path
from croquis.style.ink import outline, fill, thick_stroke, fine
from croquis.style.context import theme, skin_fill

OUTLINE_W = 2.2   # nua ngoai cua net vien se hien ra ~1.1px


def hand_outline_layer():
    parts = [outline(PALM, OUTLINE_W)]
    for b, t, w in FINGERS + [THUMB]:
        parts.append(thick_stroke(finger_path(b, t), w + OUTLINE_W, theme().ink))
    return "".join(parts)


def hand_fill_layer():
    parts = [fill(PALM)]
    for b, t, w in FINGERS + [THUMB]:
        parts.append(thick_stroke(finger_path(b, t), w, skin_fill()))
    return "".join(parts)


def hand_detail_layer():
    return "".join(fine(d, o=.5, w=.6) for d in FINGER_GAPS)
