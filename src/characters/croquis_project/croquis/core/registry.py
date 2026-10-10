"""Kho dang ky tuy chon. Moi file trong croquis/options/<nhom>/ tu dang ky vao day,
nen them mot lua chon moi chi can them mot file, khong phai sua noi khac."""
from collections import OrderedDict

_REG = {}


def register(kind, option):
    group = _REG.setdefault(kind, OrderedDict())
    if option.id in group:
        raise ValueError(f"Trung id '{option.id}' trong nhom '{kind}'")
    group[option.id] = option
    return option


def get(kind, option_id):
    try:
        return _REG[kind][option_id]
    except KeyError:
        raise KeyError(f"Khong co {kind}='{option_id}'. Hop le: {ids(kind)}") from None


def all_options(kind, include_hidden=False):
    items = sorted(_REG.get(kind, {}).values(), key=lambda o: o.order)
    return [o for o in items if include_hidden or not o.hidden]


def ids(kind):
    return [o.id for o in all_options(kind, include_hidden=True)]


def kinds():
    return list(_REG)
