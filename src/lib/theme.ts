/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "vpr:theme";
export const THEME_CHANGE_EVENT = "vpr:theme-change";

export function layThemeHienTai(): ThemeMode {
  if (typeof window === "undefined") return "light";
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
  } catch {
    // ignore
  }
  return "light";
}

export function apDungTheme(theme: ThemeMode) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // ignore
  }

  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  if (theme === "light") {
    root.classList.add("theme-light");
    root.classList.remove("theme-dark");
    root.classList.remove("dark");
  } else {
    root.classList.add("theme-dark");
    root.classList.add("dark");
    root.classList.remove("theme-light");
  }

  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: { theme } }));
}

// Khởi tạo ngay khi script chạy
if (typeof window !== "undefined") {
  const current = layThemeHienTai();
  apDungTheme(current);
}
