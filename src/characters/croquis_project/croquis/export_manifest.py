"""Xuat danh sach tuy chon ra JSON de UI tu dong dung cac nhom nut bam.
    python -m croquis.export_manifest > options.json

Dinh dang: danh sach cac nhom, moi nhom {group, title, kind, options}.
  kind = "color"  -> nhom chi la mau (doi bang CSS --skin / --hair, khong can render lai)
  kind = "shape"  -> doi hinh dang, phai render lai
Moi option co them:
  default: true      neu la gia tri mac dinh cua CharacterConfig
  color / defaultColor  (da, mau toc)
  genders, slots     (kieu toc: gioi tinh hop va cac slot phu kien no ho tro)
  requires           (phu kien: slot can co tren kieu toc), UI nen lam mo nut khi khong hop
  bundledAccessory   (kieu toc da ve san mot phu kien)
"""
import json
from dataclasses import fields

from croquis.core import registry
from croquis.model.character import CharacterConfig
from croquis.options import COLOR_GROUPS, GROUPS, TITLES, load_all
from croquis.options.base import AccessoryOption, HairColorOption, HairOption, SkinOption


def manifest():
    load_all()
    defaults = {f.name: f.default for f in fields(CharacterConfig)}
    out = []
    for kind in GROUPS:
        items = []
        for o in registry.all_options(kind):
            item = {"id": o.id, "label": o.label}
            if defaults.get(kind) == o.id:
                item["default"] = True
            if isinstance(o, (SkinOption, HairColorOption)):
                item["color"] = o.color
            if isinstance(o, HairOption):
                item["defaultColor"] = o.default_color
                item["genders"] = list(o.genders)
                item["slots"] = sorted(o.slots)
                if o.bundled_accessory:
                    item["bundledAccessory"] = o.bundled_accessory
            if isinstance(o, AccessoryOption) and o.requires:
                item["requires"] = o.requires
            items.append(item)
        out.append({"group": kind, "title": TITLES[kind],
                    "kind": "color" if kind in COLOR_GROUPS else "shape", "options": items})
    return out


if __name__ == "__main__":
    print(json.dumps(manifest(), ensure_ascii=False, indent=2))
