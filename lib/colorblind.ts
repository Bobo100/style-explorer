// 色盲模擬 —— 用常見的 LMS 近似矩陣,把顏色轉成色覺缺陷者看到的樣子。
import { parseHex } from "./contrast";

export type CbType = "protanopia" | "deuteranopia" | "tritanopia";

export const CB_LABELS: Record<CbType, string> = {
  protanopia: "紅色盲",
  deuteranopia: "綠色盲",
  tritanopia: "藍色盲",
};

// 廣泛使用的 sRGB 近似矩陣(row-major)
const MATRIX: Record<CbType, number[][]> = {
  protanopia: [
    [0.567, 0.433, 0.0],
    [0.558, 0.442, 0.0],
    [0.0, 0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0.0],
    [0.7, 0.3, 0.0],
    [0.0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0.0],
    [0.0, 0.433, 0.567],
    [0.0, 0.475, 0.525],
  ],
};

function clamp(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}

/** 把一個 hex 轉成指定色盲類型看到的 hex */
export function simulate(hex: string, type: CbType): string {
  const [r, g, b] = parseHex(hex);
  const m = MATRIX[type];
  const nr = clamp(m[0][0] * r + m[0][1] * g + m[0][2] * b);
  const ng = clamp(m[1][0] * r + m[1][1] * g + m[1][2] * b);
  const nb = clamp(m[2][0] * r + m[2][1] * g + m[2][2] * b);
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`;
}
