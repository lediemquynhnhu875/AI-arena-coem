"""Tu dong nap moi file trong options/<nhom>/ (ten khong bat dau bang '_').

GROUPS la danh sach cac nhom lua chon; ten nhom trung ten truong trong CharacterConfig.
Muon them mot nhom moi: them ten vao GROUPS + TITLES, tao thu muc options/<nhom>/ co __init__.py.
"""
import importlib
import pkgutil

GROUPS = ("gender", "age", "build", "skin", "hair", "hair_color", "accessory")

# Nhom thay doi HINH DANG (can render lai). Cac nhom con lai chi doi mau / phu kien nho.
SHAPE_GROUPS = ("gender", "age", "build", "hair", "accessory")
# Nhom chi la mau: voi css_vars=True co the doi bang CSS, khong render lai.
COLOR_GROUPS = ("skin", "hair_color")

TITLES = {"gender": "Giới tính", "age": "Độ tuổi", "build": "Vóc dáng",
          "skin": "Tông da", "hair": "Kiểu tóc", "hair_color": "Màu tóc",
          "accessory": "Phụ kiện tóc"}

_loaded = False


def load_all():
    global _loaded
    if _loaded:
        return
    for group in GROUPS:
        pkg = importlib.import_module(f"croquis.options.{group}")
        for mod in pkgutil.iter_modules(pkg.__path__):
            if not mod.name.startswith("_"):
                importlib.import_module(f"{pkg.__name__}.{mod.name}")
    _loaded = True
