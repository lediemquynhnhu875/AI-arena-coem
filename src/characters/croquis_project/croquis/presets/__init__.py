"""Preset = mot nhan vat dung san, luu thanh file JSON trong thu muc nay.
Them preset moi: them mot file <id>.json  {"label": "...", "config": {...}}.

    from croquis.presets import load_preset, list_presets
    svg = render(load_preset("ba_cu"))
"""
import json
from pathlib import Path

from croquis.model.character import CharacterConfig

_DIR = Path(__file__).parent


def list_presets():
    out = []
    for p in sorted(_DIR.glob("*.json")):
        data = json.loads(p.read_text(encoding="utf-8"))
        out.append({"id": p.stem, "label": data["label"], "config": data["config"]})
    return out


def load_preset(preset_id):
    p = _DIR / f"{preset_id}.json"
    if not p.exists():
        raise KeyError(f"Khong co preset '{preset_id}'. Hop le: {[x['id'] for x in list_presets()]}")
    return CharacterConfig.from_any(json.loads(p.read_text(encoding="utf-8"))["config"]).validate()
