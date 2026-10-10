"""Net phu cua mat sau: cot song, xuong ba vai, lom eo, nep mong. Chi ve nua trai."""
from croquis.style.ink import fine, shade


def back_center():
    return fine("M0 150 C-1 200 1 255 0 345", .3)          # cot song (khong lat guong)


def back_shade():
    return (shade("M-38 192 C-31 206 -17 211 -7 205") +    # xuong ba vai
            shade("M-31 330 C-33 340 -33 352 -30 362"))     # lom eo


def back_fine():
    return (fine("M-54 399 C-38 410 -16 411 0 405", .5) +   # nep mong
            fine("M-29 566 C-23 570 -15 570 -8 566", .35))  # khoeo chan
