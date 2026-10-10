"""Cac kieu net: net chinh mem, net phu, bong. Mau lay tu theme hien tai."""
from croquis.style.context import theme, skin_fill, hair_fill


def halo(d):
    t = theme()
    return (f'<path d="{d}" fill="none" stroke="{t.halo}" stroke-width="3.8" opacity=".06" stroke-linejoin="round"/>'
            f'<path d="{d}" fill="none" stroke="{t.halo}" stroke-width="2.2" opacity=".12" stroke-linejoin="round"/>')


def fill(d, color=None):
    return f'<path d="{d}" fill="{color or skin_fill()}" stroke="none"/>'


def line(d, w=1.1, cap="round"):
    return (f'<path d="{d}" fill="none" stroke="{theme().ink}" stroke-width="{w}" '
            f'stroke-linejoin="round" stroke-linecap="{cap}"/>')


def ink(d, w=1.1, color=None):
    """Hinh khep kin: to nen (mau da) + quang + net."""
    return fill(d, color) + halo(d) + line(d, w)


def outline(d, w=2.2, cap="round"):
    """Chi net vien (ky thuat 've vien truoc, to nen sau" de hop nhat cac manh)."""
    return halo(d) + line(d, w, cap)


def thick_stroke(d, width, color):
    return (f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}" '
            f'stroke-linecap="round" stroke-linejoin="round"/>')


def shade(d):
    c = theme().shade
    return "".join(
        f'<path d="{d}" fill="none" stroke="{c}" stroke-width="{w}" opacity="{o}" stroke-linecap="round"/>'
        for w, o in [(9, .025), (5, .04), (2.4, .07)])


def fine(d, o=.55, w=.7):
    return (f'<path d="{d}" fill="none" stroke="{theme().soft}" stroke-width="{w}" '
            f'opacity="{o}" stroke-linecap="round"/>')


def hair_shape(d, w=.9):
    """Mang toc: to mau toc; che do net thi them vien ro."""
    t = theme()
    stroke = t.ink if t.lineart else "#000000"
    op = 1 if t.lineart else .35
    sw = w if t.lineart else .5
    return (f'<path d="{d}" fill="{hair_fill()}" stroke="{stroke}" stroke-opacity="{op}" '
            f'stroke-width="{sw}" stroke-linejoin="round"/>')


def hair_strand(d, w=.7):
    """Soi toc / vet sang: trang mo tren toc mau, muc nhat tren che do net."""
    t = theme()
    color, op = (t.ink, .4) if t.lineart else ("#ffffff", .28)
    return (f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{w}" '
            f'opacity="{op}" stroke-linecap="round"/>')
