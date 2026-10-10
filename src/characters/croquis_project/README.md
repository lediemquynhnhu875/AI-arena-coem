# croquis – người mẫu SVG có thể tuỳ chọn

```bash
python build.py --list                                   # liệt kê lựa chọn + preset
python build.py --preset ba_cu -o out.svg
python build.py --gender female --age adult --build curvy --skin banh_mat \
                --hair low_bun --hair-color hung_do --accessory flower_clip -o out.svg
python build.py --skin banh_mat --skin-color "#c68e6b" --hair-color "#334455" -o out.svg   # màu tự do
python -m croquis.export_manifest > samples/options.json # UI đọc file này để dựng các nhóm nút
python serve.py                                          # demo thử UI tại http://localhost:8000
python -m unittest discover -s tests -v                  # render thử toàn bộ tổ hợp
```

```python
from croquis import render
svg = render({"gender": "female", "age": "adult", "build": "curvy", "skin": "banh_mat",
              "hair": "low_bun", "hair_color": "hung_do", "accessory": "flower_clip", "view": "both"},
             css_vars=True)
```

## Mỗi lựa chọn là một file nhỏ (tự đăng ký)

| Nhóm (UI) | Thư mục `croquis/options/` | Một file chứa gì | Đổi gì |
|---|---|---|---|
| Giới tính `gender` | `gender/` | bộ tỉ lệ (`Proportions`); nam: vai rộng, eo ≈ hông, tay chân chắc | hình dáng |
| Độ tuổi `age` | `age/` | bộ tỉ lệ; trẻ em ~6 đầu, có `width_max` chặn hệ số bề rộng để bụng/vai không phình khi nhân với nam/đầy đặn | hình dáng |
| Vóc dáng `build` | `build/` | hệ số nhân bề rộng vai/ngực/eo/hông/đùi/gối/bắp chân/mắt cá | hình dáng |
| Tông da `skin` | `skin/` | 1 mã màu | **chỉ màu** |
| Kiểu tóc `hair` | `hair/` | hàm `draw(view)` → lớp sau thân + lớp phủ đầu, cho cả mặt trước và sau; khai báo `slots` | hình dáng |
| Màu tóc `hair_color` | `hair_color/` | 1 mã màu | **chỉ màu** |
| Phụ kiện `accessory` | `accessory/` | hàm `draw(view, slot)`; khai báo `requires` (slot cần có) | hình dáng |

**Thêm một lựa chọn = thêm một file** (tên không bắt đầu bằng `_`), không sửa chỗ khác. Ví dụ thêm màu tóc:

```python
# croquis/options/hair_color/xanh_navy.py
from croquis.core.registry import register
from croquis.options.base import HairColorOption
register("hair_color", HairColorOption(id="xanh_navy", label="Xanh Navy", color="#2a3a55", order=8))
```

Thêm preset = thêm `croquis/presets/<id>.json` dạng `{"label": "...", "config": {...}}`.

## Các lựa chọn ghép lại thế nào

```
gender × age × build  ──nhân──►  Proportions (hệ số bề rộng tại các mốc, tỉ lệ đầu, độ dày tay)
Proportions + points/ (bộ điểm gốc nữ người lớn cân đối)  ──►  đường viền thân / chân / tay

skin.color  (hoặc skin_color tuỳ ý)      ┐
hair_color (id | #hex) > mặc định kiểu tóc ┴─►  Theme (--skin, --hair)

hair.draw(view) + accessory.draw(view, hair.slots[accessory.requires])  ──►  lớp tóc cho từng mặt
```

- **Hình dáng** (3 bảng hệ số nhân với nhau) và **màu** (một mã màu) tách riêng. Với `css_vars=True`,
  màu da và màu tóc là biến CSS `--skin`, `--hair` trên thẻ `<svg>`, nên app đổi màu bằng
  `svg.style.setProperty('--skin', ...)` mà không cần render lại (xem `web/index.html`).
- **Slot**: kiểu tóc khai báo "chỗ gắn phụ kiện" (`pin` = đoạn trâm, `clip` = điểm cài hoa) cho từng mặt.
  Phụ kiện chỉ cần nói mình cần slot nào, nên một phụ kiện ghép được với mọi kiểu tóc có slot đó.
  Kiểu tóc không có slot thì phụ kiện bị bỏ qua (không lỗi); manifest có `requires` / `slots`
  để UI làm mờ nút không hợp.
- `pearl_bun` (Búi cài trâm ngọc) = `low_bun` + phụ kiện `pearl_pin`, dùng lại code phụ kiện,
  chọn thêm `pearl_pin` cũng không bị vẽ đôi (`bundled_accessory`).
- Số tổ hợp nhân lại rất lớn (2×3×4×6×5×7×3 ≈ 15 nghìn) nhưng số file chỉ cộng lại.

## Manifest cho UI

`python -m croquis.export_manifest` → danh sách nhóm, mỗi nhóm `{group, title, kind, options}`.
`kind: "color"` = đổi bằng CSS, `"shape"` = phải render lại. Mỗi option có `default`, `color`,
`defaultColor`, `genders`, `slots`, `requires`, `bundledAccessory` tuỳ loại.

## Cấu trúc

```
build.py  serve.py  web/index.html          dòng lệnh · demo server · demo UI
croquis/
  render.py        render(config) -> SVG, ghép lớp tóc + phụ kiện, chọn màu
  model/           CharacterConfig (+ JSON), Proportions, shape (nắn điểm theo tỉ lệ)
  options/         __init__.py (GROUPS, TITLES)  base.py (kiểu dữ liệu)  gender/ age/ build/ skin/ hair/ hair_color/ accessory/
  presets/         *.json nhân vật dựng sẵn + loader
  views/           front.py, back.py, common.py
  parts/           body_outline, arm, hand, limb, head, neck, contour_weight
                   points/ (ĐIỂM GỐC dáng người)  details/ (bust, collarbone, leg, torso, back)
  style/           context.py (theme), ink.py (kiểu nét), palette.py
  core/            registry.py, warp.py, curves.py, svg.py
  guide/           ruler.py, landmarks.py (thước 9 đầu, khi cần vẽ lại tỉ lệ)
tests/
```

## Giới hạn hiện tại

- Nam, trẻ em, cao tuổi vẫn chủ yếu là đổi tỉ lệ trên cùng một khuôn (đầu/mặt chưa có đặc trưng riêng như hàm vuông
  của nam); cao tuổi chưa khác người lớn nhiều.
- Kiểu tóc khai báo `genders` (nữ: búi, tóc dài; nam: cắt ngắn, rẽ ngôi; bob và hoa râm dùng chung); UI nên lọc theo đó,
  render vẫn chấp nhận mọi tổ hợp.
- Mặt sau mới có nét cơ bản (cột sống, xương bả vai, nếp mông).
- Phụ kiện hiện có 2 loại (trâm, hoa); thêm loại mới chỉ cần một file, nhưng slot mới (vd vòng hoa
  quanh đầu) phải khai báo trong từng kiểu tóc muốn hỗ trợ.
