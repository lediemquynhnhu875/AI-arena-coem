/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PHỤ KIỆN GIÀY DÉP VIỆT PHỤC (FOOTWEAR RENDERER)
 * Tinh chỉnh giải phẫu học ôm khít 100% mu bàn chân, cổ chân và gót chân:
 * - Guốc mộc quai nhung truyền thống (guoc_moc)
 * - Hài thêu mũi cong hoa sen cung đình (hai_theu)
 * - Sneaker hiện đại đế êm ôm phom (sneaker)
 * - Dép da thủ công Nam Bộ (dep_da_co)
 */

import { SoDoNhanVat } from "../types";

export function renderFootwear(
  soDo: SoDoNhanVat,
  phuKienIds: string[] = [],
  footwearId?: string | null
) {
  // Xác định loại giày dép cần dựng
  const activeId =
    footwearId ||
    phuKienIds.find((id) => ["guoc_moc", "hai_theu", "sneaker", "dep_da_co"].includes(id)) ||
    (phuKienIds.includes("sneaker") ? "sneaker" : null);

  if (!activeId) return null;

  return (
    <g id={`footwear-${activeId}`} className="footwear-fitted-group">
      {/* 1. GUỐC MỘC QUAI NHUNG TRUYỀN THỐNG VIỆT NAM */}
      {activeId === "guoc_moc" && (
        <g id="guoc-moc-layer">
          {/* Guốc trái: Thớt gỗ mộc đẽo gót & khoét vòm lòng bàn chân */}
          <path
            d="M 163 788 L 186 795 L 185 800 L 175 800 L 174 797 L 170 797 L 169 800 L 163 800 Z"
            fill="#854d0e"
            stroke="#451a03"
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
          <line x1="165" y1="792" x2="183" y2="796" stroke="#a16207" strokeWidth="0.8" opacity="0.8" />
          {/* Quai nhung đỏ gấc / son cong ôm trọn mu bàn chân trái */}
          <path
            d="M 166 775 Q 177 768, 188 782"
            fill="none"
            stroke="#b91c1c"
            strokeWidth="4.2"
            strokeLinecap="round"
          />
          {/* Đường chỉ thêu kim tuyến vàng chìm trên quai nhung */}
          <path
            d="M 166 775 Q 177 768, 188 782"
            fill="none"
            stroke="#fef08a"
            strokeWidth="0.9"
            strokeDasharray="2 1.5"
          />
          {/* Đinh guốc mạ đồng chốt 2 đầu quai */}
          <circle cx="166" cy="775" r="1.3" fill="#ca8a04" stroke="#78350f" strokeWidth="0.4" />
          <circle cx="188" cy="782" r="1.3" fill="#ca8a04" stroke="#78350f" strokeWidth="0.4" />

          {/* Guốc phải: Thớt gỗ mộc đối xứng */}
          <path
            d="M 237 788 L 214 795 L 215 800 L 225 800 L 226 797 L 230 797 L 231 800 L 237 800 Z"
            fill="#854d0e"
            stroke="#451a03"
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
          <line x1="235" y1="792" x2="217" y2="796" stroke="#a16207" strokeWidth="0.8" opacity="0.8" />
          {/* Quai nhung đỏ gấc cong ôm trọn mu bàn chân phải */}
          <path
            d="M 234 775 Q 223 768, 212 782"
            fill="none"
            stroke="#b91c1c"
            strokeWidth="4.2"
            strokeLinecap="round"
          />
          <path
            d="M 234 775 Q 223 768, 212 782"
            fill="none"
            stroke="#fef08a"
            strokeWidth="0.9"
            strokeDasharray="2 1.5"
          />
          {/* Đinh guốc mạ đồng */}
          <circle cx="234" cy="775" r="1.3" fill="#ca8a04" stroke="#78350f" strokeWidth="0.4" />
          <circle cx="212" cy="782" r="1.3" fill="#ca8a04" stroke="#78350f" strokeWidth="0.4" />
        </g>
      )}

      {/* 2. HÀI THÊU MŨI CONG HOA SEN CUNG ĐÌNH */}
      {activeId === "hai_theu" && (
        <g id="hai-theu-layer">
          {/* Hài trái: Ôm khít từ gót (163, 782) tới mũi ngón chân (186, 796), vểnh hoa sen ở mũi trước */}
          <path
            d="M 163 782 Q 164 794, 172 796 L 186 796 Q 188 794, 188 789 C 183 783, 172 774, 163 782 Z"
            fill="#991b1b"
            stroke="#7f1d1d"
            strokeWidth="1.1"
          />
          {/* Mũi hài vểnh cong hoa sen thêu chỉ kim tuyến */}
          <path
            d="M 183 794 Q 187 792, 188 787"
            fill="none"
            stroke="#facc15"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="187.5" cy="787" r="1.2" fill="#fde047" />
          {/* Viền miệng hài lót lụa vàng */}
          <path
            d="M 164 782 Q 173 775, 183 784"
            fill="none"
            stroke="#fde047"
            strokeWidth="0.9"
          />
          <path
            d="M 170 796 Q 178 797, 186 796"
            fill="none"
            stroke="#fef08a"
            strokeWidth="0.9"
          />

          {/* Hài phải: Ôm khít đối xứng */}
          <path
            d="M 237 782 Q 236 794, 228 796 L 214 796 Q 212 794, 212 789 C 217 783, 228 774, 237 782 Z"
            fill="#991b1b"
            stroke="#7f1d1d"
            strokeWidth="1.1"
          />
          {/* Mũi hài vểnh cong hoa sen */}
          <path
            d="M 217 794 Q 213 792, 212 787"
            fill="none"
            stroke="#facc15"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="212.5" cy="787" r="1.2" fill="#fde047" />
          {/* Viền miệng hài lót lụa vàng */}
          <path
            d="M 236 782 Q 227 775, 217 784"
            fill="none"
            stroke="#fde047"
            strokeWidth="0.9"
          />
          <path
            d="M 230 796 Q 222 797, 214 796"
            fill="none"
            stroke="#fef08a"
            strokeWidth="0.9"
          />
        </g>
      )}

      {/* 3. GIÀY SNEAKER TRẮNG REMIX HIỆN ĐẠI KHỚP DÁNG CHÂN */}
      {activeId === "sneaker" && (
        <g id="sneaker-fitted-layer">
          {/* Giày trái: Đế cao su đúc êm ái */}
          <path
            d="M 161 786 Q 174 792, 187 795 L 186 801 Q 173 801, 161 801 Z"
            fill="#f8fafc"
            stroke="#94a3b8"
            strokeWidth="1.2"
          />
          <line x1="162" y1="799" x2="185" y2="799" stroke="#cbd5e1" strokeWidth="0.9" />
          {/* Thân giày da trắng ôm khít cổ chân (170-189) và mu bàn chân */}
          <path
            d="M 170 750 Q 180 746, 189 752 L 188 772 Q 188 786, 187 795 Q 174 792, 161 786 Q 162 770, 168 758 Z"
            fill="#ffffff"
            stroke="#64748b"
            strokeWidth="1.2"
          />
          {/* Dây giày đan ngang qua lưỡi gà */}
          <line x1="172" y1="758" x2="184" y2="758" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="173" y1="764" x2="185" y2="764" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="174" y1="770" x2="186" y2="770" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="175" y1="776" x2="187" y2="776" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
          {/* Sọc trang trí thể thao di sản đỏ */}
          <path
            d="M 164 776 Q 174 778, 184 785"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Giày phải: Đế cao su đúc */}
          <path
            d="M 239 786 Q 226 792, 213 795 L 214 801 Q 227 801, 239 801 Z"
            fill="#f8fafc"
            stroke="#94a3b8"
            strokeWidth="1.2"
          />
          <line x1="238" y1="799" x2="215" y2="799" stroke="#cbd5e1" strokeWidth="0.9" />
          {/* Thân giày da trắng bên phải */}
          <path
            d="M 230 750 Q 220 746, 211 752 L 212 772 Q 212 786, 213 795 Q 226 792, 239 786 Q 238 770, 232 758 Z"
            fill="#ffffff"
            stroke="#64748b"
            strokeWidth="1.2"
          />
          {/* Dây giày phải */}
          <line x1="228" y1="758" x2="216" y2="758" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="227" y1="764" x2="215" y2="764" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="226" y1="770" x2="214" y2="770" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="225" y1="776" x2="213" y2="776" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
          {/* Sọc trang trí thể thao di sản đỏ */}
          <path
            d="M 236 776 Q 226 778, 216 785"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* 4. DÉP DA THỦ CÔNG NAM BỘ */}
      {activeId === "dep_da_co" && (
        <g id="dep-da-layer">
          {/* Lòng dép da sẫm chân trái */}
          <path
            d="M 163 788 Q 174 792, 186 795 L 185 799 Q 174 798, 163 796 Z"
            fill="#451a03"
            stroke="#271001"
            strokeWidth="0.8"
          />
          {/* Quai da bản ngang thêu chỉ thủ công */}
          <path
            d="M 166 775 Q 177 772, 188 781"
            stroke="#78350f"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M 166 775 Q 177 772, 188 781"
            stroke="#ca8a04"
            strokeWidth="0.8"
            strokeDasharray="2 1"
          />
          {/* Quai xỏ ngón trước */}
          <path
            d="M 175 786 Q 182 788, 186 793"
            stroke="#78350f"
            strokeWidth="2.6"
            strokeLinecap="round"
          />

          {/* Lòng dép da sẫm chân phải */}
          <path
            d="M 237 788 Q 226 792, 214 795 L 215 799 Q 226 798, 237 796 Z"
            fill="#451a03"
            stroke="#271001"
            strokeWidth="0.8"
          />
          {/* Quai da chân phải */}
          <path
            d="M 234 775 Q 223 772, 212 781"
            stroke="#78350f"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M 234 775 Q 223 772, 212 781"
            stroke="#ca8a04"
            strokeWidth="0.8"
            strokeDasharray="2 1"
          />
          <path
            d="M 225 786 Q 218 788, 214 793"
            stroke="#78350f"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </g>
      )}
    </g>
  );
}
