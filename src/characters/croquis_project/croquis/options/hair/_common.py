"""Hinh toc dung chung (toa do cuc bo cua dau: tam x=0, dinh dau y~50, cam y~136)."""
from croquis.style.ink import hair_shape, hair_strand

# Mu toc phia truoc (nhin chinh dien): dai toc rong ~10px, ngoi giua
CAP_FRONT = ("M-26.5 92 C-29 56 -12 47 0 47 C12 47 29 56 26.5 92 "
             "C24 74 14 62 0 61 C-14 62 -24 74 -26.5 92 Z")

# Toc phu kin dau khi nhin tu phia sau
CAP_BACK = ("M-26.5 90 C-26.5 62 -14 49 0 49 C14 49 26.5 62 26.5 90 "
            "C26.5 108 19 121 0 124 C-19 121 -26.5 108 -26.5 90 Z")


def front_cap():
    return hair_shape(CAP_FRONT) + hair_strand("M0 49 C-9 52 -17 60 -21 74") + hair_strand("M0 49 C9 52 17 60 21 74")


def back_cap():
    return (hair_shape(CAP_BACK) + hair_strand("M0 50 C-1 70 -1 95 0 120", .6)
            + hair_strand("M-12 58 C-18 78 -17 100 -11 116") + hair_strand("M12 58 C18 78 17 100 11 116"))


def nape_bun(r=12.5, cy=110):
    """Bui thap o gay (nhin tu phia sau)."""
    return (hair_shape(f"M{-r} {cy} C{-r} {cy-r*1.35} {r} {cy-r*1.35} {r} {cy} "
                       f"C{r} {cy+r*1.2} {-r} {cy+r*1.2} {-r} {cy} Z")
            + hair_strand(f"M{-r*.6:.1f} {cy-4} C{-r*.2:.1f} {cy-9} {r*.6:.1f} {cy-6} {r*.7:.1f} {cy}")
            + hair_strand(f"M{-r*.7:.1f} {cy+2} C{-r*.3:.1f} {cy+8} {r*.4:.1f} {cy+8} {r*.7:.1f} {cy+3}"))


# Slot phu kien cho cac kieu bui thap / mu toc thuong (toa do cuc bo cua dau)
BUN_SLOTS = {
    "pin":  {"front": ((14, 63), (26, 88)), "back": ((-15, 98), (16, 118))},
    "clip": {"front": (-17, 66),            "back": (17, 72)},
}
