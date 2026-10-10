"""Hinh hoc co xet ti le: bien cac danh sach diem goc (nu truong thanh can doi)
thanh diem da nan theo Proportions."""
import numpy as np

# Nua be rong than goc tai vai / nguc / eo / hong / dui (de tinh do tay phai dich ra)
_BODY_HALF = ((166, 56), (232, 44), (291, 34), (367, 57), (432, 54), (500, 45))
_HY = [a for a, _ in _BODY_HALF]
_HV = [b for _, b in _BODY_HALF]
ARM_FIXED_OUTER = 3        # 3 diem dau cua tay trung voi duong vai cua than


def warp_body(pts, prop):
    return [(x * prop.width_at(y), y) for x, y in pts]


def arm_shift(prop, y):
    """Do tay phai dich ra ngoai (px) khi than rong / hep hon."""
    return (prop.width_at(y) - 1.0) * float(np.interp(y, _HY, _HV))


def _taper(y):
    t = min(1.0, max(0.0, (y - 170.0) / (390.0 - 170.0)))
    return 4 * t * (1 - t)


def warp_arm(outer, inner, prop):
    o = []
    for i, (x, y) in enumerate(outer):
        if i < ARM_FIXED_OUTER:
            o.append((x * prop.width_at(y), y))      # khop dung voi vai cua than
        else:
            o.append((x - arm_shift(prop, y) - prop.arm_fat * _taper(y) / 2, y))
    n = [(x - arm_shift(prop, y) + prop.arm_fat * _taper(y) / 2, y) for x, y in inner]
    return o, n


def wrist_dx(prop, y=390.0):
    return -arm_shift(prop, y)
