# 🏮 Hướng Dẫn Quản Lý & Mở Rộng Tài Nguyên (Resources Guide)

Thư mục `src/resources/` là nơi quản lý tập trung toàn bộ tài nguyên thiết kế của **Cò Em — Việt Phục Remix**. Mọi tài nguyên được module hóa để việc bảo trì, tinh chỉnh và mở rộng diễn ra nhanh chóng, an toàn và có kiểu dữ liệu rõ ràng (Type-safe).

---

## 📁 Cấu Trúc Thư Mục

```text
src/resources/
├── colors/
│   └── colors.ts         # Bảng màu di sản Việt & theme tokens (Light / Dark)
├── typography/
│   └── fonts.ts          # Cấu hình phông chữ, thang cỡ chữ, độ dày, khoảng cách dòng
├── images/
│   ├── patterns.ts       # Họa tiết SVG, hoa văn trống đồng, mây cổ, texture giấy dó
│   └── mascot.ts         # Cấu hình linh vật Cò Em (kích thước, độ sáng, hoạt ảnh)
├── audio/
│   └── sounds.ts         # Danh mục âm thanh di sản, hiệu ứng thiên nhiên
├── index.ts              # Barrel file xuất khẩu toàn bộ tài nguyên
└── README.md             # Sổ tay hướng dẫn phát triển (tài liệu này)
```

---

## 🎨 1. Quản Lý Màu Sắc (`src/resources/colors/colors.ts`)

- **Thêm màu mới**: Thêm vào object `HERITAGE_COLORS` kèm `name`, `vietnameseName`, `hex`, `description`, và `culturalOrigin`.
- **Cập nhật giao diện Sáng / Tối**: Điều chỉnh giá trị trong `THEME_COLOR_TOKENS.light` và `THEME_COLOR_TOKENS.dark`.
- **Sử dụng trong mã nguồn TypeScript**:
  ```ts
  import { HERITAGE_COLORS, THEME_COLOR_TOKENS } from "../resources";

  const bannerColor = HERITAGE_COLORS.SON_DONG_HO.hex;
  ```

---

## ✍️ 2. Quản Lý Phông Chữ (`src/resources/typography/fonts.ts`)

- **Thay đổi hoặc bổ sung font**: Sửa `FONT_FAMILIES` (ví dụ bổ sung font thư pháp hoặc font hiển thị đặc biệt).
- **Thang kích thước chuẩn**: Sử dụng `FONT_SIZES` thay vì viết cứng giá trị pixel để đảm bảo giao diện đồng bộ.

---

## 🖼️ 3. Quản Lý Hoa Văn & Hình Ảnh (`src/resources/images/`)

- **Thêm hoa văn SVG**: Mở `patterns.ts`, tạo hằng số SVG dạng chuỗi (dùng `currentColor` để hoa văn tự động đổi màu theo chủ đề giao diện).
- **Thêm ảnh tĩnh (PNG/JPG/WebP)**: Đặt tệp ảnh vào thư mục `public/assets/` và khai báo đường dẫn trong module ảnh để dễ bảo trì.

---

## 🔊 4. Quản Lý Âm Thanh (`src/resources/audio/sounds.ts`)

- **Thêm âm thanh mới**: Bổ sung định nghĩa vào `SOUND_CATALOG` với phân loại (`category`: `ambient`, `sfx`, `nature`) và vùng miền tương ứng.

---

## 💡 Lợi Ích Của Kiến Trúc Này

1. **Không còn hardcoded màu rải rác**: Đổi 1 nơi trong `colors.ts`, toàn bộ ứng dụng tự động cập nhật.
2. **Hỗ trợ đa chế độ mượt mà**: Chế độ Sáng (Bạch Nhật) và Tối (Huyền Dạ) đều được kiểm soát chặt chẽ.
3. **Dễ dàng mở rộng cho các nhà phát triển khác**: Cấu trúc rõ ràng, có tài liệu và chuẩn TypeScript.
