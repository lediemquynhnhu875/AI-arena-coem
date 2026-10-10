"""Theme cua mot lan render (mau da, mau toc, che do net...).
Dung contextvars de cac ham ve khong phai truyen theme qua tung tham so."""
from contextvars import ContextVar
from contextlib import contextmanager
from dataclasses import dataclass


@dataclass(frozen=True)
class Theme:
    lineart: bool = True
    skin_hex: str = "#ffffff"
    hair_hex: str = "#ffffff"
    css_vars: bool = False
    ink: str = "#3d3438"
    halo: str = "#7a6a70"
    soft: str = "#6d6166"
    shade: str = "#8a7a80"


_CURRENT = ContextVar("croquis_theme", default=Theme())


def theme():
    return _CURRENT.get()


@contextmanager
def use_theme(t):
    token = _CURRENT.set(t)
    try:
        yield t
    finally:
        _CURRENT.reset(token)


def skin_fill():
    t = theme()
    return f"var(--skin,{t.skin_hex})" if t.css_vars else t.skin_hex


def hair_fill():
    t = theme()
    return f"var(--hair,{t.hair_hex})" if t.css_vars else t.hair_hex
