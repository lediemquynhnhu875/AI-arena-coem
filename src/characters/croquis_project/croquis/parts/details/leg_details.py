"""Bong va nep tren chan: bap chan, goi."""
from croquis.style.ink import fine, shade


def leg_shade():
    return (shade("M -9 617.5 C -10 646 -9 693.5 -7 731.5") +
            shade("M -38 622.2 C -37 648.8 -33 677.3 -29 703"))


def knee_lines():
    return (fine("M -29 560.3 C -23 556 -15 556 -8 561.2", .45) +
            fine("M -28 575.7 C -22 580.4 -14 580.4 -8 575.7", .3))
