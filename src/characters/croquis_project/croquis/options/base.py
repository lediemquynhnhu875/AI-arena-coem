"""Kieu du lieu cho cac nhom tuy chon. Dung tham so tu khoa khi tao."""
from dataclasses import dataclass, field
from typing import Callable
from croquis.model.proportions import Proportions


@dataclass(frozen=True)
class Option:
    id: str = ""
    label: str = ""          # ten hien thi tren nut (tieng Viet)
    order: int = 0           # thu tu hien thi
    hidden: bool = False     # an khoi UI nhung van dung duoc trong code


@dataclass(frozen=True)
class ProportionOption(Option):
    """Gioi tinh / do tuoi / voc dang: chi la mot bo ti le."""
    prop: Proportions = field(default_factory=Proportions)


@dataclass(frozen=True)
class SkinOption(Option):
    color: str = "#ffffff"


@dataclass(frozen=True)
class HairColorOption(Option):
    """Mot mau toc trong bang mau (nguoi dung cung co the nhap hex tuy y)."""
    color: str = "#2b2420"


@dataclass(frozen=True)
class HairLayers:
    behind: str = ""         # ve TRUOC than (toc phia sau vai, sau lung)
    front: str = ""          # ve SAU dau (mu toc, mai, loc toc truoc vai)

    def __add__(self, other):
        return HairLayers(self.behind + other.behind, self.front + other.front)


# Slot = diem gan phu kien tren toc, toa do cuc bo cua dau.
#   slots = {"pin":  {"front": ((x1, y1), (x2, y2)), "back": (...)},   # doan tram cai
#            "clip": {"front": (x, y), "back": (x, y)}}                # diem cai kep / hoa
# Kieu toc nao khong khai bao slot thi phu kien can slot do se khong hien (UI nen lam mo nut).
@dataclass(frozen=True)
class HairOption(Option):
    draw: Callable = None    # draw(view) -> HairLayers, toa do cuc bo cua dau
    default_color: str = "#2b2420"
    genders: tuple = ("female", "male")
    slots: dict = field(default_factory=dict)
    bundled_accessory: str = ""   # phu kien da ve san trong draw() (de khong ve trung)


@dataclass(frozen=True)
class AccessoryOption(Option):
    """Phu kien gan len toc. draw(view, slot) -> HairLayers; slot lay tu HairOption.slots[requires]."""
    draw: Callable = None
    requires: str = ""       # ten slot can co tren kieu toc ("" = khong can)
