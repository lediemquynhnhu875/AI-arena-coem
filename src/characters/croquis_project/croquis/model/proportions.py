"""Ti le co the: mot bo he so nhan be rong tai cac moc giai phau + vai thong so khac.
Gender / age / build deu chi la cac Proportions, duoc nhan voi nhau (combine)."""
from dataclasses import dataclass, field
import numpy as np

# (ten moc, toa do y tren khung goc cua nguoi mau nu truong thanh)
ANCHORS = (
    ("neck", 130.0), ("shoulder", 166.0), ("bust", 232.0), ("waist", 291.0),
    ("hip", 367.0), ("thigh", 450.0), ("knee", 569.0), ("calf", 645.0), ("ankle", 742.0),
)
_YS = [y for _, y in ANCHORS]


@dataclass(frozen=True)
class Proportions:
    head_scale: float = 1.0      # phong to / thu nho dau (tre em > 1)
    body_scale_y: float = 1.0    # keo dai / rut ngan than + chan + tay
    hand_scale: float = 1.0
    arm_fat: float = 0.0         # px: lam tay day (+) hoac manh (-) o giua canh tay
    show_bust: bool = True
    widths: dict = field(default_factory=dict)   # ten moc -> he so nhan be rong
    width_max: float = None      # tran cho moi he so be rong sau khi nhan (tre em: khong de bung/vai qua to)

    def width_at(self, y):
        ms = [self.widths.get(name, 1.0) for name, _ in ANCHORS]
        if self.width_max is not None:
            ms = [min(m, self.width_max) for m in ms]
        return float(np.interp(y, _YS, ms))

    def combine(self, other):
        keys = set(self.widths) | set(other.widths)
        return Proportions(
            head_scale=self.head_scale * other.head_scale,
            body_scale_y=self.body_scale_y * other.body_scale_y,
            hand_scale=self.hand_scale * other.hand_scale,
            arm_fat=self.arm_fat + other.arm_fat,
            show_bust=self.show_bust and other.show_bust,
            widths={k: self.widths.get(k, 1.0) * other.widths.get(k, 1.0) for k in keys},
            width_max=min((m for m in (self.width_max, other.width_max) if m is not None), default=None),
        )
