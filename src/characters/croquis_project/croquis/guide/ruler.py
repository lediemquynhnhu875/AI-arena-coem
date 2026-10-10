"""Thuoc chia 9 dau ben trai + duong dong + nhan ben phai."""
from croquis.guide.landmarks import MARKS
from croquis.style.palette import GUIDE_PINK, GUIDE_DARK, GUIDE_BG, TEXT

FONT = "Georgia,serif"


def guide_svg():
    g = ""
    for n, y, label in MARKS:
        g += (f'<line x1="62" y1="{y}" x2="385" y2="{y}" stroke="{GUIDE_PINK}" stroke-width=".8" stroke-dasharray="4 3"/>'
              f'<text x="392" y="{y+4}" font-size="12" fill="{TEXT}" font-family="{FONT}">{label}</text>')
        if n:
            g += (f'<circle cx="44" cy="{y}" r="11" fill="{GUIDE_BG}" stroke="{GUIDE_PINK}"/>'
                  f'<text x="44" y="{y+4.5}" font-size="13" text-anchor="middle" fill="{GUIDE_DARK}" '
                  f'font-family="{FONT}" font-weight="bold">{n}</text>')
    g += (f'<path d="M16 52 L16 808 M12 56 L16 52 L20 56 M12 804 L16 808 L20 804" stroke="{GUIDE_DARK}" stroke-width="1" fill="none"/>'
          f'<text transform="translate(9,430) rotate(-90)" font-size="11" text-anchor="middle" fill="{GUIDE_DARK}" '
          f'font-family="{FONT}" letter-spacing="2">9 HEADS TALL</text>')
    g += (f'<text x="260" y="26" font-size="17" text-anchor="middle" fill="#222" font-family="{FONT}" '
          f'letter-spacing="3">FEMALE CROQUIS · 9 HEADS</text>')
    return g
