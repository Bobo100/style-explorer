import { contrastRatio, wcagLevel, type WcagResult } from "./contrast";
import type { Palette } from "./types";

// 一組配色的整體可讀性 = 四個關鍵文字組合裡「最差」的那個等級。
// 用 normal-text 門檻(AA>=4.5, AAA>=7),所以飽和色白字按鈕會誠實落在 AA 或 Fail。
const ORDER: Record<WcagResult, number> = { Fail: 0, AA: 1, AAA: 2 };

export function paletteGrade(p: Palette): WcagResult {
  const pairs: [string, string][] = [
    [p.roles.text, p.roles.background],
    [p.roles.text, p.roles.surface],
    [p.roles.primaryFg, p.roles.primary],
    [p.roles.accentFg, p.roles.accent],
  ];
  let worst: WcagResult = "AAA";
  for (const [fg, bg] of pairs) {
    const lvl = wcagLevel(contrastRatio(fg, bg));
    if (ORDER[lvl] < ORDER[worst]) worst = lvl;
  }
  return worst;
}

/** 這組配色是否至少達到 target(AA 也接受 AAA) */
export function meetsGrade(p: Palette, target: "AA" | "AAA"): boolean {
  const g = paletteGrade(p);
  return ORDER[g] >= ORDER[target];
}
