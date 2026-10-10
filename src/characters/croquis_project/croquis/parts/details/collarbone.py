"""Xuong quai xanh: duong cong chu S mem, mo dan ve phia vai, kem bong rat nhe
phia duoi va hom xuong don o giua. Chi ve nua trai; build.py lat guong."""
from croquis.style.palette import SOFT, SHADE

CLAVICLE = "M-3 171.5 C-9 173 -15 171.8 -21 170 C-27 168.2 -33 168.6 -40 169.8"
SHADOW = "M-6 175 C-12 176.5 -18 175 -24 173 C-29 171.3 -34 171.5 -38 172.5"


def collarbone_svg():
    shadow = (f'<path d="{SHADOW}" fill="none" stroke="{SHADE}" stroke-width="2.6" '
              f'opacity=".035" stroke-linecap="round"/>'
              f'<path d="{SHADOW}" fill="none" stroke="{SHADE}" stroke-width="1.1" '
              f'opacity=".05" stroke-linecap="round"/>')
    line = (f'<path d="{CLAVICLE}" fill="none" stroke="{SOFT}" stroke-width=".6" '
            f'opacity=".45" stroke-linecap="round"/>')
    return shadow + line


def notch_svg():
    """Hom xuong don o giua (khong lat guong)."""
    return (f'<path d="M-5 164 C-2.5 168 2.5 168 5 164" fill="none" stroke="{SOFT}" '
            f'stroke-width=".6" opacity=".4" stroke-linecap="round"/>')
