"""Khuon dau (khong mat/mui/mieng) va tai. Toc nam rieng trong options/hair/."""
from croquis.style.ink import ink, line
from croquis.style.context import skin_fill, theme

HEAD = "M-26 90 C-26 118 -12 134 0 136 C12 134 26 118 26 90 C26 66 14 52 0 52 C-14 52 -26 66 -26 90 Z"
EAR = "M-25 90 C-32 90 -32 104 -25 105 Z"


def ear_svg():
    """Tai ben trai (build.py lat guong cho ben phai). Ve truoc khuon dau."""
    return f'<path d="{EAR}" fill="{skin_fill()}" stroke="{theme().ink}" stroke-width=".8"/>'


def head_svg():
    return ink(HEAD)
