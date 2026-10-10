/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { domdom } from "../copy/coem";
import { openGiuChuanVanHoa } from "../lib/giuChuan";
import { ShieldCheck } from "lucide-react";

interface Props {
  currentCostumeName?: string;
  onOpenGiuChuan?: () => void;
}

export default function AppFooter({ currentCostumeName, onOpenGiuChuan }: Props) {
  const handleClick = () => {
    if (onOpenGiuChuan) {
      onOpenGiuChuan();
    } else {
      openGiuChuanVanHoa(currentCostumeName);
    }
  };

  return (
    <footer className="app-footer">
      <style>{css}</style>
      <div className="app-footer__container">
        <div className="app-footer__actions">
          <button
            type="button"
            onClick={handleClick}
            className="app-footer__btn inline-flex items-center gap-2"
            title="Đọc nguyên tắc Giữ chuẩn văn hóa của Cò Em"
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>{domdom.giuChuanVanHoa.nutMoTrang}</span>
          </button>
        </div>

        <p className="app-footer__note">
          {domdom.giuChuanVanHoa.dongLuuTru}
        </p>
        <p className="app-footer__weather-credit" style={{ margin: 0, fontSize: "0.74rem", color: "var(--tro-tram)" }}>
          {domdom.thoiTiet.ghiCong}{" "}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--tro-tram)", textDecoration: "underline" }}
          >
            {domdom.thoiTiet.giayPhep}
          </a>
        </p>
      </div>
    </footer>
  );
}

const css = `
.app-footer {
  position: relative;
  z-index: 10;
  width: 100%;
  padding: 24px 16px 36px;
  background: var(--nen-the);
  border-top: 1px solid var(--vien-the);
  margin-top: auto;
}

.app-footer__container {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.app-footer__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.app-footer__btn {
  min-height: 42px;
  padding: 8px 18px;
  background: var(--nen-the);
  border: 1px solid var(--vien-the);
  color: var(--nen-toi);
  border-radius: var(--vien-lech-a);
  font-family: var(--font-than);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--nhip-cham) ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.app-footer__btn:hover {
  border-color: var(--vang-chinh);
  color: var(--vang-chinh);
  transform: translateY(-1px);
}

.app-footer__icon {
  font-size: 1rem;
}

.app-footer__note {
  margin: 0;
  font-size: 0.8rem;
  color: var(--tro-tram);
  font-style: italic;
  letter-spacing: 0.02em;
}

@media (max-width: 400px) {
  .app-footer {
    padding: 18px 12px 28px;
  }
  .app-footer__btn {
    width: 100%;
    justify-content: center;
  }
}
`;
