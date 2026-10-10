"""Noi cac diem thanh duong cong mem (Catmull-Rom -> Bezier)."""
import numpy as np


def curve(pts, lead=None):
    """Tra ve chuoi cac doan 'C ...'. Diem dau phai da duoc 'M' hoac 'L' truoc.
    lead: diem 'dan huong' truoc diem dau, de duong cong khop voi duong khac
    dang di qua cung diem do (vi du canh tay noi tiep duong vai cua than)."""
    p = [np.array(q, float) for q in pts]
    p = [np.array(lead, float) if lead is not None else p[0]] + p + [p[-1]]
    out = []
    for i in range(1, len(p) - 2):
        p0, p1, p2, p3 = p[i - 1], p[i], p[i + 1], p[i + 2]
        c1 = p1 + (p2 - p0) / 6
        c2 = p2 - (p3 - p1) / 6
        out.append("C%.1f %.1f %.1f %.1f %.1f %.1f" % (*c1, *c2, *p2))
    return " ".join(out)


def mirror(pts):
    """Lat qua truc x=0."""
    return [(-x, y) for x, y in pts]
