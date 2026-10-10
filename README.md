# Đóm Dáng — Việt Phục Remix

> **Trải nghiệm kể chuyện văn hóa và phối thử trang phục truyền thống Việt Nam**, dẫn dắt bởi nhân vật Đom Đóm ấm áp, điềm đạm.  
> Ứng dụng tôn vinh di sản nếp áo của các dân tộc anh em trên dải đất hình chữ S với tinh thần: **Gìn giữ cốt cách xưa — Tự do thấu hiểu nay**.

---

## 1. Hướng dẫn cài đặt & khởi chạy

### Yêu cầu môi trường
- Node.js >= 18.x
- npm >= 9.x

### Các lệnh thực thi
```bash
# Cài đặt các gói phụ thuộc
npm install

# Khởi chạy máy chủ phát triển (mặc định cổng 3000)
npm run dev

# Kiểm tra cú pháp và kiểu dữ liệu (TypeScript)
npm run lint

# Đóng gói ứng dụng cho môi trường sản xuất
npm run build
```

---

## 2. Kiến trúc 3 lớp (3-Layer Architecture)

Ứng dụng được thiết kế phân tầng chặt chẽ nhằm đảm bảo tính toàn vẹn và chuẩn mực văn hóa:

```
┌────────────────────────────────────────────────────────┐
│  LỚP 1: DỮ LIỆU VĂN HÓA KIỂM CHỨNG (src/data/)         │
│  - Trang phục, Nhóm dân tộc, Phụ kiện, Chất liệu, Nguồn│
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  LỚP 2: BỘ LUẬT VĂN HÓA XÁC ĐỊNH (src/lib/rules.ts)    │
│  - Phán quyết: Chuẩn mực | Sáng tạo | Cần xem lại      │
│  - Kiểm định quy tắc phối màu và bối cảnh sử dụng     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  LỚP 3: GEMINI DIỄN ĐẠT CẢM XÚC (src/lib/gemini.ts)    │
│  - Kể chuyện "Một Trang Đời", Cố vấn trò chuyện        │
│  - Grounded context: Tuyệt đối không bịa đặt dữ liệu   │
└────────────────────────────────────────────────────────┘
```

1. **Lớp 1 — Dữ liệu gốc (`src/data/`)**:
   - `trangphuc.ts`: Định nghĩa danh mục trang phục, mảng dữ kiện sự thật (`suThat`), dịp mặc (`dip`), và mã nguồn khảo cứu (`nguonIds`).
   - `nhom.ts`: Thông tin 8 nhóm vùng miền văn hóa (Kinh Bắc, Chăm, Thái, H'Mông, Ba Na, Ê Đê, Nam Bộ, v.v.).
   - `phukien.ts`, `vai.ts`, `mausac.ts`, `mocthoigian.ts`, `nguon.ts`: Các tư liệu văn hóa phụ trợ được gắn mã đối chiếu.
   - *Nguyên tắc cốt lõi*: Mọi câu từ hiển thị trên giao diện đều trích xuất trực tiếp từ các tệp dữ liệu này, không ghi đè định kiến cá nhân.

2. **Lớp 2 — Bộ luật xác định (`src/lib/rules.ts`)**:
   - Mọi phán quyết văn hóa về cách kết hợp trang phục (nhãn `chuan` - Chuẩn mực, `sang_tao` - Sáng tạo, `can_xem_lai` - Cần xem lại) được xử lý bằng mã logic toán học minh bạch.
   - AI **không** được trao quyền phán quyết đúng/sai về mặt văn hóa nhằm tránh thiên kiến và ảo giác (hallucination).

3. **Lớp 3 — Gemini diễn đạt cảm xúc (`src/lib/gemini.ts`)**:
   - Gemini (`gemini-3.8-flash`) chỉ đóng vai trò người dẫn chuyện "Một Trang Đời" hoặc người giải đáp trong khung chat "Cố vấn văn hóa".
   - Tất cả prompt đều được bao bọc trong ngữ cảnh dữ liệu đóng kín (*grounded in CONTEXT*), nhiệt độ thấp (0.3), kiểm tra schema JSON nghiêm ngặt và luôn có bản hiển thị dự phòng tức thì nếu mất kết nối mạng.

### Phân loại dữ liệu & Tối ưu hóa truy vấn (Data Stratification)
Ứng dụng tách biệt dứt khoát ba luồng dữ liệu:
1. **Dữ liệu TĨNH**: Trang phục (`trangphuc.ts`), màu sắc (`mausac.ts`), phụ kiện (`phukien.ts`), bộ luật kiểm định (`rules.ts`) — nạp duy nhất 1 lần khi mở ứng dụng, lưu giữ trong bộ nhớ máy khách, không phát sinh bất kỳ yêu cầu mạng nào khi chuyển màn hình.
2. **Dữ liệu ĐỘNG CỤC BỘ**: Gùi Ký Ức (`guiKyUc.ts`), hồ sơ người dùng (`hoSo.ts`), hồ sơ phong cách (`styleProfile.ts`), tiến trình khám phá — đọc/ghi tức thì trên `localStorage`/`sessionStorage` của trình duyệt, độ trễ 0ms, không qua mạng. Mọi thao tác đổi màu, thay đổi phụ kiện, góc nhìn, tư thế đều chỉ cập nhật state cục bộ và render lại SVG toán học.
3. **Dữ liệu CẦN GEMINI**: Giới hạn nghiêm ngặt ở 4 tính năng tương tác sâu (Một Trang Đời, Cố vấn Đom Đóm, Thám Tử Văn Hóa, Giải thích sâu "Vì sao"). Mọi lệnh gọi đều được gắn `callerKey` kèm `AbortController` để tự động hủy bỏ lệnh in-flight cũ nếu người dùng chuyển lựa chọn mới, tránh hiển thị nhầm kết quả.


---

## 3. Cách thêm một nhóm dân tộc mới (Chỉ thêm dữ liệu)

Hệ thống được thiết kế theo dạng Data-Driven hoàn toàn mở. Để thêm một nhóm văn hóa mới mà **không cần can thiệp logic mã nguồn giao diện**, chỉ cần thực hiện 3 bước:

### Bước 1: Khai báo nhóm trong `src/data/nhom.ts`
Thêm một đối tượng mới vào mảng `nhom`:
```typescript
{
  id: "dao",
  ten: "Người Dao",
  vungId: "bac",
  moTa: "Nổi bật với sắc chàm sâu lắng, khăn đỏ rực rỡ và những đường thêu chỉ màu tinh xảo...",
  mauDacTrung: "#B83227",
  hoaVanDacTrung: "Họa tiết quả trám, ngôi sao tám cánh và hoa văn cành thông thêu tay.",
  ghiChuVanHoa: "Trang phục truyền thống phản ánh vũ trụ quan và ước vọng mùa màng bội thu."
}
```

### Bước 2: Thêm trang phục thuộc nhóm trong `src/data/trangphuc.ts`
Thêm trang phục tương ứng vào mảng `trangPhuc`:
```typescript
{
  id: "dao_do",
  ten: "Áo dài người Dao Đỏ",
  nhomIds: ["dao"],
  vungId: "bac",
  gioiTinh: "nu",
  dip: ["le_hoi", "cuoi"],
  moTaNgan: "Nếp áo chàm đen điểm xuyết quả bông đỏ thắm trước ngực và khăn vấn đầu cầu kỳ.",
  suThat: [
    "Những quả bông len đỏ trước ngực tượng trưng cho ngọn lửa sưởi ấm vùng cao và may mắn.",
    "Khăn đội đầu của phụ nữ Dao Đỏ có thể nặng từ 1 đến 2 kg với nhiều lớp vải gấp tỉ mỉ."
  ],
  nguonIds: ["bt_dan_toc_hoc", "trang_phuc_cac_dan_toc_vn"],
  phuKienTuongThich: ["khan_dao_do", "vong_bac_dao"]
}
```

### Bước 3: Bổ sung phụ kiện và chất liệu (nếu có)
- Thêm phụ kiện mới vào `src/data/phukien.ts`.
- Thêm chất liệu vải mới vào `src/data/vai.ts`.
- Ghi nhận tài liệu trích dẫn vào `src/data/nguon.ts`.

Ngay sau khi lưu tệp dữ liệu, bản đồ văn hóa, bộ lọc trang phục, màn hình thử đồ, sợi chỉ chung và trợ lý Đom Đóm sẽ tự động cập nhật nhóm mới mà không cần sửa bất kỳ dòng lệnh logic nào.

---

## 4. Nguồn tư liệu khảo cứu

Mọi chi tiết trang phục, mốc thời gian và hoa văn trong ứng dụng đều được trích dẫn từ các nguồn nghiên cứu uy tín:
1. **Bảo tàng Dân tộc học Việt Nam** — Tư liệu hiện vật và văn hóa mặc 54 dân tộc.
2. **Bảo tàng Phụ nữ Việt Nam** — Nghiên cứu trang phục phụ nữ các thời kỳ và vùng miền.
3. **Viện Văn hóa Nghệ thuật Quốc gia Việt Nam** — Các công trình khảo cứu trang phục lễ hội truyền thống.
4. **"Ngàn năm áo mũ" (Trần Quang Đức)** — Nghiên cứu lịch sử trang phục cung đình và dân gian thời quân chủ.
5. **Dữ liệu thời tiết trực tuyến Open-Meteo** (Giấy phép CC BY 4.0) phục vụ tính năng gợi ý trang phục theo tiết trời thời gian thực.

---

## 5. Bản quyền & Giấy phép tài nguyên

- **Kiểu chữ (Typography)**: Sử dụng các phông chữ mở phân phối qua Google Fonts:
  - *Noto Serif*: Dành cho tiêu đề và lời dẫn đậm chất văn hóa.
  - *Be Vietnam Pro*: Dành cho thân bài, thông số và các trường đọc văn bản.
- **m thanh (Audio)**: Hoàn toàn tổng hợp trong thời gian thực bằng **Web Audio API** (`src/lib/audio.ts`):
  - Tiếng vải sột soạt: Bộ lọc nhiễu hạt bandpass.
  - Tiếng chuông bạc: Sóng sin hài hòa ngân vang nhẹ nhàng.
  - Tiếng bước guốc: Xung âm học mô phỏng đế guốc mộc gõ thềm nhà cổ.
  - *Tuyệt đối không sử dụng tệp âm thanh tĩnh chứa bản quyền bên ngoài.*
- **Chất liệu thị giác (Visual Assets)**:
  - Lớp nhiễu hạt giấy hạt (paper grain): Thuật toán SVG Fractal Noise trực tiếp từ chuỗi Data URI mã nguồn mở.
  - Hình họa nhân vật và trang phục: Render hoàn toàn bằng vector SVG toán học, thích ứng mượt mà với mọi tỉ lệ co giãn cơ thể.

---

## 6. Cách thức tích hợp Gemini & Giới hạn hiện tại

### Cách thức hoạt động của Gemini
- Sử dụng SDK hiện đại `@google/genai` với mô hình `gemini-3.8-flash` (dự phòng `gemini-3.1-flash-lite`).
- Thời gian chờ (Timeout) tối đa 12 giây; có cơ chế tự động thử lại khi quá tải.
- Kiểm tra nghiêm ngặt cấu trúc JSON trả về theo Schema định nghĩa sẵn.
- **Chế độ ngoại tuyến mượt mà**: Nếu thiết bị mất mạng, API Key hết hạn hoặc Gemini gặp lỗi, ứng dụng tự động hiển thị nguyên bản ghi chép gốc có nguồn đối chiếu và câu trả lời dự phòng của Đom Đóm — đảm bảo tuyệt đối không có màn hình trắng hay lỗi giao diện.

### Giới hạn hiện tại trong bản thử nghiệm
1. **Hồ sơ người dùng (`Hồ sơ`)**: Hiện tại hoạt động cục bộ trên trình duyệt (`localStorage`) thông qua cơ chế phân vùng khóa `vpr:<hoSo>:...`. Chưa đồng bộ hóa tài khoản qua máy chủ đám mây.
2. **Chợ Phiên cộng đồng**: Các bài đăng mẫu hiện tại đại diện cho các trường hợp phối đồ mô phỏng cộng đồng nhằm phục vụ thử nghiệm tính năng bình chọn có lý do văn hóa. Dữ liệu bài đăng mới của bạn được lưu trữ trên máy cá nhân.

---

## 7. Quyền riêng tư & Quản lý vị trí địa lý

- **Mục đích sử dụng**: "Vị trí" được sử dụng độc quyền cho tính năng gợi ý thời tiết và hiển thị bầu trời Đom Đóm, **không lưu lại trên máy chủ** (chỉ lưu tạm thời trong `sessionStorage` của phiên hiện tại trên trình duyệt và tự hủy khi đóng phiên).
- **Quyền tự quyết của người dùng (Luồng 3 bước ưu tiên rõ ràng)**:
  1. **Bước 1 — Hỏi quyền chỉ khi bấm**: Ứng dụng *tuyệt đối không xin quyền vị trí im lặng* ở nền hay khi vừa mở trang. Hộp thoại trình duyệt (`navigator.geolocation`) chỉ xuất hiện khi người dùng chủ động bấm nút *"Dùng vị trí của tôi (GPS)"*.
  2. **Bước 2 — Ô tìm kiếm địa điểm dự phòng**: Nếu người dùng từ chối cấp quyền hoặc trình duyệt không hỗ trợ định vị, hệ thống lập tức mở ô tìm kiếm địa điểm để người dùng gõ tên thành phố, thị xã hoặc huyện và chọn từ danh sách gợi ý.
  3. **Bước 3 — Vị trí mặc định theo vùng**: Nếu người dùng bỏ qua cả hai bước trên, ứng dụng sử dụng vị trí đại diện của vùng đang xem trên Toạ Độ Ký Ức (Hà Nội, Huế, Buôn Ma Thuột, TP. Hồ Chí Minh), nói rõ đây là vị trí mặc định và cung cấp nút đổi linh hoạt.

