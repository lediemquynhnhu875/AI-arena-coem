"""Diem vao chinh:  render(config) -> chuoi SVG.

    from croquis import render
    svg = render({"gender": "female", "age": "adult", "build": "curvy",
                  "skin": "banh_mat", "hair": "low_bun", "hair_color": "hung_do",
                  "accessory": "flower_clip", "view": "both"})

css_vars=True: mau da / toc la bien CSS (--skin, --hair) tren the <svg>, app doi mau
bang CSS ma khong can render lai.
"""
from croquis.config import CANVAS_H, CX_LOCAL, VIEW_W
from croquis.core import registry
from croquis.model.character import CharacterConfig, is_hex
from croquis.options import load_all
from croquis.options.base import HairLayers
from croquis.style.context import Theme, use_theme
from croquis.views import back, front

load_all()


def resolve_proportions(cfg):
    """gender x age x build -> mot bo Proportions."""
    p = registry.get("gender", cfg.gender).prop
    p = p.combine(registry.get("age", cfg.age).prop)
    return p.combine(registry.get("build", cfg.build).prop)


def resolve_skin_hex(cfg):
    return cfg.skin_color or registry.get("skin", cfg.skin).color


def resolve_hair_hex(cfg):
    """Uu tien: hex nguoi dung nhap > id trong bang mau > mau mac dinh cua kieu toc."""
    if cfg.hair_color is None:
        return registry.get("hair", cfg.hair).default_color
    if is_hex(cfg.hair_color):
        return cfg.hair_color
    return registry.get("hair_color", cfg.hair_color).color


def make_theme(cfg, css_vars=False):
    lineart = cfg.skin == "none" and cfg.skin_color is None
    hair_hex = resolve_hair_hex(cfg)
    if lineart and cfg.hair_color is None:
        hair_hex = "#ffffff"
    if lineart:
        return Theme(lineart=True, skin_hex=resolve_skin_hex(cfg), hair_hex=hair_hex, css_vars=css_vars)
    return Theme(lineart=False, skin_hex=resolve_skin_hex(cfg), hair_hex=hair_hex, css_vars=css_vars,
                 soft="#6b4a3a", shade="#5a3a2a")


def accessory_fits(hair, accessory):
    """Phu kien co gan duoc len kieu toc nay khong (kieu toc phai co slot phu kien can)."""
    if accessory.id == "none":
        return True
    if accessory.id == hair.bundled_accessory:
        return False                       # da ve san trong kieu toc
    return not accessory.requires or accessory.requires in hair.slots


def compose_hair(hair, accessory, view):
    """Ghep lop toc + lop phu kien cho mot mat. Phu kien khong hop thi bo qua, khong bao loi."""
    layers = hair.draw(view)
    if accessory.id != "none" and accessory_fits(hair, accessory):
        slot = hair.slots[accessory.requires][view] if accessory.requires else None
        layers = layers + accessory.draw(view, slot)
    return layers if isinstance(layers, HairLayers) else HairLayers()


def render(config=None, *, css_vars=False):
    cfg = CharacterConfig.from_any(config).validate()
    prop = resolve_proportions(cfg)
    hair = registry.get("hair", cfg.hair)
    accessory = registry.get("accessory", cfg.accessory)
    theme = make_theme(cfg, css_vars)

    views = {"front": [front], "back": [back], "both": [front, back]}[cfg.view]
    names = {"both": ["front", "back"]}.get(cfg.view, [cfg.view])
    with use_theme(theme):
        body = "".join(
            f'<g class="view view-{n}" transform="translate({i * VIEW_W + CX_LOCAL},0)">'
            f'{mod.render(prop, compose_hair(hair, accessory, n))}</g>'
            for i, (n, mod) in enumerate(zip(names, views)))

    w = VIEW_W * len(views)
    style = f' style="--skin:{theme.skin_hex};--hair:{theme.hair_hex}"' if css_vars else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {CANVAS_H}" '
            f'width="{w}" height="{CANVAS_H}"{style} role="img" aria-label="Croquis">{body}</svg>')
