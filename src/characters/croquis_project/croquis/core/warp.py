"""Bien doi toa do ben trong chuoi SVG path (dung de nan be rong theo vong dang nguoi).
Chi ho tro lenh tuyet doi M/L/C/Q (du cho toan bo net ve cua du an)."""
import re

_TOKEN = re.compile(r"[A-Za-z]|-?\d*\.?\d+")
_D_ATTR = re.compile(r'(?<=\sd=")([^"]*)(?=")')


def warp_path(d, fn):
    """fn(x, y) -> (x', y')."""
    out, nums = [], []

    def flush():
        for i in range(0, len(nums) - 1, 2):
            x, y = fn(nums[i], nums[i + 1])
            out.append(f"{x:.1f} {y:.1f}")
        nums.clear()

    for tok in _TOKEN.findall(d):
        if tok.isalpha():
            flush()
            out.append(tok)
        else:
            nums.append(float(tok))
    flush()
    return " ".join(out)


def warp_svg(svg, fn):
    """Ap fn len moi thuoc tinh d="..." trong doan SVG."""
    return _D_ATTR.sub(lambda m: warp_path(m.group(1), fn), svg)
