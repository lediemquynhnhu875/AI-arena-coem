"""Cau hinh nguoi dung chon (khop voi cac nhom nut bam trong app).

Moi truong tuy chon deu co the de None:  hair_color = None -> mau mac dinh cua kieu toc,
skin_color = None -> dung mau cua tong da da chon.
hair_color nhan id trong bang mau (vd "hung_do") hoac ma hex (#rrggbb); skin_color nhan hex.
"""
import json
import re
from dataclasses import dataclass, asdict, fields

VIEWS = ("front", "back", "both")
_HEX = re.compile(r"^#[0-9a-fA-F]{6}$")
CHOICE_FIELDS = ("gender", "age", "build", "skin", "hair", "accessory")


def is_hex(value):
    return isinstance(value, str) and bool(_HEX.match(value))


@dataclass
class CharacterConfig:
    gender: str = "female"
    age: str = "adult"
    build: str = "balanced"
    skin: str = "none"          # "none" = chi ve net, khong to mau da
    hair: str = "low_bun"
    hair_color: str = None      # None | id trong bang mau toc | "#rrggbb"
    accessory: str = "none"
    skin_color: str = None      # None | "#rrggbb": ghi de mau cua tong da
    view: str = "both"

    @classmethod
    def from_any(cls, value):
        if value is None:
            return cls()
        if isinstance(value, cls):
            return value
        known = {f.name for f in fields(cls)}
        extra = set(value) - known
        if extra:
            raise KeyError(f"Khoa khong hop le: {sorted(extra)}. Hop le: {sorted(known)}")
        return cls(**value)

    @classmethod
    def from_json(cls, text):
        return cls.from_any(json.loads(text))

    def to_dict(self):
        return asdict(self)

    def to_json(self, **kw):
        return json.dumps(self.to_dict(), ensure_ascii=False, **kw)

    def validate(self):
        from croquis.core import registry
        for kind in CHOICE_FIELDS:
            registry.get(kind, getattr(self, kind))
        if self.view not in VIEWS:
            raise ValueError(f"view phai thuoc {VIEWS}")
        if self.hair_color is not None and not is_hex(self.hair_color):
            registry.get("hair_color", self.hair_color)    # KeyError ro rang neu sai id
        if self.skin_color is not None and not is_hex(self.skin_color):
            raise ValueError("skin_color phai la ma hex dang #rrggbb")
        return self
