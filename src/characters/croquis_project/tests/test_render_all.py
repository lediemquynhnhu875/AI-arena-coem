"""Render moi to hop tuy chon, kiem tra SVG hop le va khong co so hong (nan/inf).
Chay:  python -m unittest discover -s tests -v"""
import itertools
import time
import unittest
import xml.etree.ElementTree as ET

from croquis import render
from croquis.core import registry
from croquis.export_manifest import manifest
from croquis.model.character import CharacterConfig
from croquis.options import COLOR_GROUPS, GROUPS, SHAPE_GROUPS, load_all
from croquis.presets import list_presets, load_preset

load_all()


def check(cfg):
    svg = render(cfg)
    ET.fromstring(svg)                                  # phai la XML hop le
    assert "nan" not in svg.lower() and "inf" not in svg.lower(), cfg
    return svg


class TestRender(unittest.TestCase):
    def test_every_shape_combination(self):
        """Nhom doi hinh dang: thu day du moi to hop (voi 1 tong da)."""
        pools = [registry.ids(g) for g in SHAPE_GROUPS]
        n, t0 = 0, time.time()
        for combo in itertools.product(*pools):
            check(dict(zip(SHAPE_GROUPS, combo), skin="banh_mat", view="both"))
            n += 1
        print(f"\n{n} to hop hinh dang, {time.time() - t0:.1f}s")

    def test_every_color_with_each_hair(self):
        for skin, hc, hair in itertools.product(registry.ids("skin"), registry.ids("hair_color"),
                                                registry.ids("hair")):
            check({"skin": skin, "hair_color": hc, "hair": hair})

    def test_views_and_css_vars(self):
        for view in ("front", "back", "both"):
            ET.fromstring(render({"view": view, "skin": "hoa_le"}, css_vars=True))
        self.assertIn("--skin:", render({"skin": "hoa_le"}, css_vars=True))

    def test_color_resolution(self):
        s = render({"skin": "hoa_le", "skin_color": "#112233", "hair_color": "hung_do"}, css_vars=True)
        self.assertIn("--skin:#112233", s)
        self.assertIn("--hair:#8b3a26", s)
        self.assertIn("--hair:#abcdef", render({"skin": "hoa_le", "hair_color": "#abcdef"}, css_vars=True))

    def test_unknown_option_is_clear_error(self):
        for bad in ({"hair": "khong_co"}, {"toc": "low_bun"}, {"hair_color": "khong_co"},
                    {"accessory": "khong_co"}):
            with self.assertRaises(KeyError):
                render(bad)
        with self.assertRaises(ValueError):
            render({"skin_color": "do"})

    def test_incompatible_accessory_is_skipped(self):
        """Tram ngoc tren toc bob (khong co slot 'pin') -> bo qua, giong het khong chon."""
        self.assertEqual(render({"hair": "short_bob", "accessory": "pearl_pin"}),
                         render({"hair": "short_bob"}))
        self.assertNotEqual(render({"hair": "low_bun", "accessory": "pearl_pin"}),
                            render({"hair": "low_bun"}))

    def test_pearl_bun_equals_bun_plus_pin(self):
        self.assertEqual(render({"hair": "pearl_bun"}),
                         render({"hair": "low_bun", "accessory": "pearl_pin"}))
        self.assertEqual(render({"hair": "pearl_bun"}),
                         render({"hair": "pearl_bun", "accessory": "pearl_pin"}))   # khong ve trung

    def test_feet_share_one_floor(self):
        """Moi dang nguoi deu dung tren cung mat san (chan khong bi troi)."""
        from croquis.views.common import layout, FLOOR_Y, PIVOT_Y, FOOT_Y
        from croquis.render import resolve_proportions
        for g in registry.ids("gender"):
            for a in registry.ids("age"):
                sy, dy = layout(resolve_proportions(CharacterConfig(gender=g, age=a)))
                self.assertAlmostEqual(PIVOT_Y + (FOOT_Y - PIVOT_Y) * sy + dy, FLOOR_Y, places=3)


class TestStructure(unittest.TestCase):
    def test_manifest_covers_every_group(self):
        m = {g["group"]: g for g in manifest()}
        self.assertEqual(set(m), set(GROUPS))
        for g in GROUPS:
            self.assertEqual(m[g]["kind"], "color" if g in COLOR_GROUPS else "shape")

    def test_every_hair_has_a_gender_and_each_gender_has_hair(self):
        for h in registry.all_options("hair"):
            self.assertTrue(h.genders, h.id)
        for g in registry.ids("gender"):
            self.assertTrue([h for h in registry.all_options("hair") if g in h.genders], g)

    def test_child_widths_are_capped(self):
        """Be trai / be gai day dan khong bi bung to day tay be ra."""
        from croquis.render import resolve_proportions
        for g, b in itertools.product(registry.ids("gender"), registry.ids("build")):
            p = resolve_proportions(CharacterConfig(gender=g, age="child", build=b))
            self.assertLessEqual(max(p.width_at(y) for y in range(130, 745, 5)), 1.15 + 1e-9, (g, b))

    def test_every_default_is_registered(self):
        CharacterConfig().validate()

    def test_presets_valid_and_roundtrip(self):
        self.assertGreaterEqual(len(list_presets()), 1)
        for p in list_presets():
            cfg = load_preset(p["id"])
            check(cfg)
            self.assertEqual(CharacterConfig.from_json(cfg.to_json()), cfg)

    def test_accessory_requirements_point_to_real_slots(self):
        slots = {s for h in registry.all_options("hair") for s in h.slots}
        for a in registry.all_options("accessory"):
            if a.requires:
                self.assertIn(a.requires, slots, a.id)


if __name__ == "__main__":
    unittest.main()
