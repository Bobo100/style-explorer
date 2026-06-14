// 從圖片 / Logo 取色 → 配出一組語意配色。
// 取色(quantize)與「色 → 角色」都是純函式,canvas 取像素的部分留在元件。
import { hexToHsl, hslToHex } from "./color";
import { bestTextOn, parseHex, relativeLuminance } from "./contrast";
import type { Palette, Role } from "./types";

/** 跟 ImageData 同形,方便測試不依賴 DOM */
export interface PixelSource {
  data: Uint8ClampedArray | number[];
  width: number;
  height: number;
}

function toHex(r: number, g: number, b: number): string {
  const h = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v)))
      .toString(16)
      .padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

function hueDist(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/**
 * 把圖片像素量化成前 N 個主色(依出現比重排序)。
 * 用 4-bit/通道(16 階)的粗桶分群,桶內取平均色,跳過幾乎透明的像素。
 */
export function extractColors(src: PixelSource, count = 6): string[] {
  const buckets = new Map<
    number,
    { n: number; r: number; g: number; b: number }
  >();
  const d = src.data;
  for (let i = 0; i < d.length; i += 4) {
    const a = d[i + 3];
    if (a < 128) continue; // 透明像素不算
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    const cur = buckets.get(key);
    if (cur) {
      cur.n++;
      cur.r += r;
      cur.g += g;
      cur.b += b;
    } else {
      buckets.set(key, { n: 1, r, g, b });
    }
  }
  return [...buckets.values()]
    .sort((x, y) => y.n - x.n)
    .slice(0, count)
    .map((c) => toHex(c.r / c.n, c.g / c.n, c.b / c.n));
}

/**
 * 從一組主色挑出 primary / accent(取圖片裡實際的彩色),
 * 中性骨架(背景/文字/邊框)則用主色相調出 → 保證底色可讀,配色又像那張圖。
 */
export function rolesFromColors(colors: string[]): Record<Role, string> {
  const chromatic = colors
    .map((hex) => ({ hex, hsl: hexToHsl(hex) }))
    .filter((x) => x.hsl.s > 0.12 && x.hsl.l > 0.12 && x.hsl.l < 0.9)
    .sort((a, b) => b.hsl.s - a.hsl.s);

  const primary = chromatic[0]?.hex ?? "#4f46e5";
  const ph = hexToHsl(primary).h;

  const accentCand = chromatic.find((x) => hueDist(x.hsl.h, ph) > 35);
  const accent = accentCand?.hex ?? hslToHex(ph + 180, 0.55, 0.45);

  // 中性骨架沿用主色相一點點,跟生成器一致 → 背景/文字必然遠超 AAA
  const roles: Record<Role, string> = {
    background: hslToHex(ph, 0.28, 0.975),
    surface: "#ffffff",
    text: hslToHex(ph, 0.2, 0.14),
    muted: hslToHex(ph, 0.12, 0.42),
    border: hslToHex(ph, 0.18, 0.9),
    primary,
    primaryFg: bestTextOn(primary),
    accent,
    accentFg: bestTextOn(accent),
  };
  return roles;
}

/** 主色相 → 一個既有 mood,讓取色配色也能被風格篩選 */
function moodFromHue(h: number): Palette["moods"] {
  if (h < 20 || h >= 330) return ["活力新創"];
  if (h < 50) return ["溫暖親切"];
  if (h < 160) return ["自然有機"];
  if (h < 200) return ["科技未來"];
  if (h < 260) return ["沉穩專業"];
  return ["優雅奢華"];
}

/** 從主色清單組一組可微調 / 匯出的配色(標 custom) */
export function paletteFromImage(colors: string[], name = "從圖片取色"): Palette {
  const roles = rolesFromColors(colors);
  // 用亮度排序的主色當「靈感色帶」放進說明,讓使用者知道取自哪幾色
  const swatch = [...colors]
    .sort((a, b) => relativeLuminance(b) - relativeLuminance(a))
    .slice(0, 4)
    .join("、");
  const ph = hexToHsl(roles.primary).h;
  parseHex(roles.primary); // 驗證合法,色錯就早炸

  return {
    id: "from-image",
    name,
    moods: moodFromHue(ph),
    roles,
    blurb:
      "從你上傳的圖片 / Logo 取主色配出的一組,適合想讓網站跟既有視覺(品牌、照片、靈感圖)一致的情境。",
    why: `主色取自圖片裡最鮮明的顏色(${swatch});背景、文字、邊框依主色相自動調出,整組調性跟原圖一致。對比不足可一鍵修到 AA / AAA。`,
    roleUsage: {
      primary: "取自圖片的主色,主要按鈕與重點",
      accent: "圖片裡的另一個顏色,次要強調",
      background: "依主色相調出的極淺底,不搶圖片的色",
    },
    custom: true,
  };
}
