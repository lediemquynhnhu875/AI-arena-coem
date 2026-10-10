"""Du lieu hinh hoc ban tay: long ban tay, ngon, ngon cai, vach tach ngon."""
import numpy as np

# Long ban tay bat dau ngay tai co tay (-91,410)-(-80,408) de khong co moi noi
PALM = "M-91 410 C-94 418 -95 428 -94 434 L-80 435 C-79 428 -79 416 -80 408 Z"

# (diem goc, dau ngon, be rong)
FINGERS = [
    ((-92.5, 432), (-96.0, 456), 3.2),   # ut
    ((-89.5, 433), (-93.0, 462), 3.4),   # ap ut
    ((-86.5, 434), (-89.5, 468), 3.5),   # giua
    ((-83.5, 434), (-85.5, 463), 3.4),   # tro
]
THUMB = ((-80.5, 415), (-76.0, 440), 4.2)

# Cac vach manh tach ngon (chi hien 1 phan, ngon van lien khoi o goc)
FINGER_GAPS = [
    "M-91.3 447 L-94.6 459",
    "M-88.2 449 L-91.4 465",
    "M-85.2 449 L-87.6 462",
]


def finger_path(base, tip, bend=1.2):
    b, t = np.array(base, float), np.array(tip, float)
    m, v = (b + t) / 2, t - b
    n = np.array([-v[1], v[0]]) / np.linalg.norm(v)
    c = m + n * bend
    return "M%.1f %.1f Q%.1f %.1f %.1f %.1f" % (*b, *c, *t)
