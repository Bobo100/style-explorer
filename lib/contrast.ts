// WCAG 2.1 對比度計算 —— 既驅動資訊面板的可讀性徽章,也是純函式好測試。

export type WcagResult = "AAA" | "AA" | "Fail";

/** 把 #rgb / #rrggbb(大小寫皆可)解析成 [r,g,b],0~255 */
export function parseHex(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) {
    throw new Error(`Invalid hex colour: ${hex}`);
  }
  const n = parseInt(h, 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

/** sRGB 8-bit 通道 → 線性值(gamma 解碼) */
function channelToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

/** 相對亮度 0(黑)~1(白),WCAG 公式 */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex);
  return (
    0.2126 * channelToLinear(r) +
    0.7152 * channelToLinear(g) +
    0.0722 * channelToLinear(b)
  );
}

/** 兩色對比比值 1~21,順序無關 */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/** 依比值判 WCAG 等級。large = 大字(>=18.66px bold 或 24px) */
export function wcagLevel(ratio: number, large = false): WcagResult {
  const aaa = large ? 4.5 : 7;
  const aa = large ? 3 : 4.5;
  if (ratio >= aaa) return "AAA";
  if (ratio >= aa) return "AA";
  return "Fail";
}

/** 在某背景上挑黑或白文字,取對比較高者 */
export function bestTextOn(bg: string): "#000000" | "#ffffff" {
  return contrastRatio("#000000", bg) >= contrastRatio("#ffffff", bg)
    ? "#000000"
    : "#ffffff";
}
