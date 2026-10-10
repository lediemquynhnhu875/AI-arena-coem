"""Co: dau co nam trong duong vien than (xem torso_points); o day chi ve bong va nep co."""
from croquis.style.ink import fine, shade


def neck_shade():
    """Bong nhe duoi cam."""
    return shade("M-12 131 C-5 140 5 140 12 131")


def neck_lines():
    """Duong co ức dòn chum cong nhe tu sau tai xuong hom xuong don."""
    return fine("M-10.5 131 C-11.5 142 -9 152 -4 160", .5)
