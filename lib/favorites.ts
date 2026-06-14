// 收藏 / 最愛 —— 存進 localStorage。以「9 色簽章」當身分,所以策展、動態、自訂的同色配色視為同一個。
import { ROLES, type Palette } from "./types";

const KEY = "style-explorer:favorites";

export function paletteSig(p: Palette): string {
  return ROLES.map((r) => p.roles[r]).join("");
}

export function isFavorite(favs: Palette[], p: Palette): boolean {
  const sig = paletteSig(p);
  return favs.some((f) => paletteSig(f) === sig);
}

/** 切換收藏狀態,回新陣列(immutable)。新收藏的放最前面 */
export function toggleFavorite(favs: Palette[], p: Palette): Palette[] {
  const sig = paletteSig(p);
  return isFavorite(favs, p)
    ? favs.filter((f) => paletteSig(f) !== sig)
    : [{ ...p }, ...favs];
}

export function loadFavorites(): Palette[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as Palette[]) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favs: Palette[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(favs));
  } catch {
    // localStorage 不可用時靜默(隱私模式等)
  }
}
