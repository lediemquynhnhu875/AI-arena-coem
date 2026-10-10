/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SÂN KHẤU NGƯỜI MẪU THỜI TRANG CHUẨN CROQUIS (CROQUIS PROJECT MANNEQUIN)
 * Dựng trực tiếp từ bản vẽ mẫu phác thảo người mẫu thời trang croquis_project:
 * - Chuẩn mẫu nữ (chuan_mau.svg) & Chàng trai nam (chang_trai.svg)
 * - Tọa độ trục đối xứng chuẩn X = 200 đồng bộ hoàn hảo với hệ thống trang phục di sản
 * - Tách rời và thay đổi linh hoạt các kiểu tóc: low_bun, long_loose, high_bun, short_bob, short_crop, side_part, silver
 * - Nét vẽ 2D thanh thoát, tỷ lệ 9 đầu phác thảo thời trang, bóng đổ cơ học mềm mại
 * - Đầy đủ 2 mặt trước (Front) và sau (Back)
 * - Tông da & màu tóc áp dụng chuẩn qua biến CSS --skin và --hair
 */

import React, { useMemo } from "react";
import { NhanVatConfig, HuongNhin } from "../types";
import { BANG_MAU_DA } from "../dimensions/skinTones";
import { CroquisBehindHair, CroquisHairRenderer } from "./HairStyles";
import { CentralizedBodyLayerSystem } from "./BodyPartLayering";
import femaleSvgRaw from "../croquis_project/samples/chuan_mau.svg?raw";
import maleSvgRaw from "../croquis_project/samples/chang_trai.svg?raw";

export interface FashionMannequinProps {
  nhanVat: NhanVatConfig;
  huongNhin?: HuongNhin;
  hienDoLot?: boolean;
  childrenVayQuan?: React.ReactNode;
  childrenAo?: React.ReactNode;
  childrenPhuKienThan?: React.ReactNode;
  childrenTocTruocKhanNon?: React.ReactNode;
}

// Chuẩn hóa và làm mịn các khớp nối hình thể, đồng nhất màu da qua CSS variables
function sanitizeCroquisContent(content: string): string {
  // 1. Đồng nhất 100% màu da thân, cổ tay, bàn tay và các ngón tay qua biến CSS --skin
  content = content.replaceAll('fill="#cfa17b"', 'fill="var(--skin, #cfa17b)"');
  content = content.replaceAll('fill="#9b6a53"', 'fill="var(--skin, #9b6a53)"');
  content = content.replaceAll('stroke="#cfa17b"', 'stroke="var(--skin, #cfa17b)"');
  content = content.replaceAll('stroke="#9b6a53"', 'stroke="var(--skin, #9b6a53)"');

  // 2. Xóa vết cắt ngang ở khớp cổ tay:
  // - Ở các đường nét viền (fill="none"), chuyển L thành M để không vẽ đường kẻ đen cắt cổ tay
  content = content.replace(/(<path[^>]*d="[^"]*?)L-75\.0 388\.3 C-72\.8([^"]*"[^>]*fill="none"[^>]*>)/g, '$1M-75.0 388.3 C-72.8$2');
  content = content.replace(/(<path[^>]*fill="none"[^>]*d="[^"]*?)L-75\.0 388\.3 C-72\.8([^"]*"[^>]*>)/g, '$1M-75.0 388.3 C-72.8$2');
  content = content.replace(/(<path[^>]*d="[^"]*?)L-83\.3 388\.3 C-81\.7([^"]*"[^>]*fill="none"[^>]*>)/g, '$1M-83.3 388.3 C-81.7$2');
  content = content.replace(/(<path[^>]*fill="none"[^>]*d="[^"]*?)L-83\.3 388\.3 C-81\.7([^"]*"[^>]*>)/g, '$1M-83.3 388.3 C-81.7$2');

  // - Ở đường viền bàn tay (fill="none"), bỏ lệnh đóng Z ngang qua khớp cổ tay
  content = content.replaceAll('-80 408 Z" fill="none"', '-80 408" fill="none"');

  // 3. Ẩn tóc vẽ tĩnh trong SVG gốc để thay thế bằng kiểu tóc tùy chọn động
  content = content.replaceAll('fill="#2b2420"', 'display="none" fill="none"');

  return content;
}

export interface CroquisViewParts {
  bodyHtmlContent: string;
  headHtmlContent: string;
}

// Trích xuất riêng biệt phần Thân (Body) và phần Đầu (Head) từ raw SVG của croquis_project
function extractViewParts(rawSvg: string, view: "truoc" | "sau"): CroquisViewParts {
  const isFront = view === "truoc";
  const viewTag = isFront ? '<g class="view view-front"' : '<g class="view view-back"';
  const viewIndex = rawSvg.indexOf(viewTag);
  if (viewIndex === -1) return { bodyHtmlContent: "", headHtmlContent: "" };

  const nextViewIndex = isFront
    ? rawSvg.indexOf('<g class="view view-back"', viewIndex)
    : rawSvg.lastIndexOf("</svg>");
  
  const viewSvg = rawSvg.substring(viewIndex, nextViewIndex !== -1 ? nextViewIndex : rawSvg.length);

  const bodyIdx = viewSvg.indexOf('<g class="body"');
  const headIdx = viewSvg.indexOf('<g class="head"');

  let bodyContent = "";
  let headContent = "";

  if (bodyIdx !== -1 && headIdx !== -1) {
    bodyContent = viewSvg.substring(bodyIdx, headIdx);

    // Tìm thẻ đóng </g> của <g class="head" bằng cách đếm độ sâu tag
    let depth = 0;
    let headEnd = -1;
    for (let i = headIdx; i < viewSvg.length; i++) {
      if (viewSvg.startsWith("<g", i)) {
        depth++;
      } else if (viewSvg.startsWith("</g>", i)) {
        depth--;
        if (depth === 0) {
          headEnd = i + 4;
          break;
        }
      }
    }
    headContent = headEnd !== -1 ? viewSvg.substring(headIdx, headEnd) : viewSvg.substring(headIdx);
  } else {
    bodyContent = viewSvg;
  }

  bodyContent = sanitizeCroquisContent(bodyContent);
  headContent = sanitizeCroquisContent(headContent);

  return { bodyHtmlContent: bodyContent, headHtmlContent: headContent };
}

export default function FashionMannequin({
  nhanVat,
  huongNhin = "truoc",
  hienDoLot = true,
  childrenVayQuan,
  childrenAo,
  childrenPhuKienThan,
  childrenTocTruocKhanNon,
}: FashionMannequinProps) {
  const isMale = nhanVat.gioi === "nam";
  const sourceSvg = isMale ? maleSvgRaw : femaleSvgRaw;

  // Tạo nội dung SVG các phần hình thể nguyên bản từ croquis_project
  const { bodyHtmlContent, headHtmlContent } = useMemo(() => {
    return extractViewParts(sourceSvg, huongNhin);
  }, [sourceSvg, huongNhin]);

  return (
    <CentralizedBodyLayerSystem
      nhanVat={nhanVat}
      huongNhin={huongNhin}
      bodyHtmlContent={bodyHtmlContent}
      headHtmlContent={headHtmlContent}
      childrenVayQuan={childrenVayQuan}
      childrenAo={childrenAo}
      childrenPhuKienThan={childrenPhuKienThan}
      childrenTocTruocKhanNon={childrenTocTruocKhanNon}
    />
  );
}
