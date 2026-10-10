"""Dong lenh:
    python build.py --list
    python build.py --preset ba_cu -o out.svg
    python build.py --gender female --age adult --build curvy --skin banh_mat --hair low_bun \
                    --hair-color hung_do --accessory flower_clip -o out.svg
    python build.py --skin banh_mat --skin-color "#c68e6b" --hair-color "#334455" -o out.svg
    python build.py --config nhan_vat.json --css-vars -o out.svg
Thu tu uu tien: tham so dong lenh > --config > --preset.
"""
import argparse
import json
import os
import sys

from croquis import CharacterConfig, render
from croquis.core import registry
from croquis.options import GROUPS, TITLES, load_all
from croquis.presets import list_presets, load_preset

# nhom nhan id; hair_color va skin_color nhan them hex nen khong gioi han bang choices
CHOICE_GROUPS = [g for g in GROUPS if g != "hair_color"]


def main(argv=None):
    load_all()
    ap = argparse.ArgumentParser(description="Sinh nguoi mau croquis SVG")
    ap.add_argument("--list", action="store_true", help="liet ke cac tuy chon va preset")
    ap.add_argument("--config", help="file JSON cau hinh")
    ap.add_argument("--preset", choices=[p["id"] for p in list_presets()])
    for g in CHOICE_GROUPS:
        ap.add_argument(f"--{g}", choices=registry.ids(g))
    ap.add_argument("--hair-color", dest="hair_color", help="id trong bang mau toc hoac #rrggbb")
    ap.add_argument("--skin-color", dest="skin_color", help="#rrggbb, ghi de mau cua tong da")
    ap.add_argument("--view", choices=["front", "back", "both"])
    ap.add_argument("--css-vars", action="store_true", help="mau da / toc la bien CSS")
    ap.add_argument("-o", "--out", default="output/croquis.svg")
    a = ap.parse_args(argv)

    if a.list:
        for g in GROUPS:
            print(f"{g} ({TITLES[g]}): " + ", ".join(f"{o.id} ({o.label})" for o in registry.all_options(g)))
        print("preset: " + ", ".join(f"{p['id']} ({p['label']})" for p in list_presets()))
        return

    data = {}
    if a.preset:
        data.update(load_preset(a.preset).to_dict())
    if a.config:
        data.update(json.load(open(a.config, encoding="utf-8")))
    for key in (*CHOICE_GROUPS, "hair_color", "skin_color", "view"):
        v = getattr(a, key)
        if v is not None:
            data[key] = v
    svg = render(CharacterConfig.from_any(data), css_vars=a.css_vars)
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    with open(a.out, "w", encoding="utf-8") as f:
        f.write(svg)
    print("Created:", a.out)


if __name__ == "__main__":
    sys.exit(main())
