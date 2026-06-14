// 自訂微調 + 一鍵修到 AA/AAA。盡量「就近」調整,讓修完跟原本視覺差最小。
import { hexToHsl, hslToHex } from "./color";
import { bestTextOn, contrastRatio } from "./contrast";
import type { Palette, Role } from "./types";

/** 改單一角色色值,回新 palette(immutable),標記為 custom */
export function setRole(p: Palette, role: Role, hex: string): Palette {
  return { ...p, roles: { ...p.roles, [role]: hex }, custom: true };
}

/** 在某色相/彩度上,從 lStart 往外(雙向)找最近的明度,使「最佳文字色」對比達標 */
function fitFillNear(
  hue: number,
  sat: number,
  lStart: number,
  target: number,
): { color: string; fg: string } {
  for (let d = 0; d <= 0.85; d += 0.015) {
    for (const l of [lStart - d, lStart + d]) {
      if (l < 0.06 || l > 0.96) continue;
      const color = hslToHex(hue, sat, l);
      const fg = bestTextOn(color);
      if (contrastRatio(fg, color) >= target) return { color, fg };
    }
  }
  const color = hslToHex(hue, sat, 0.12);
  return { color, fg: bestTextOn(color) };
}

/** 從 lStart 往外找最近明度,使該色對「所有指定背景」的最小對比都達標 */
function fitOnBgsNear(
  bgs: string[],
  hue: number,
  sat: number,
  lStart: number,
  target: number,
): string {
  const ok = (hex: string) =>
    Math.min(...bgs.map((bg) => contrastRatio(hex, bg))) >= target;
  for (let d = 0; d <= 0.95; d += 0.015) {
    for (const l of [lStart - d, lStart + d]) {
      if (l < 0.04 || l > 0.98) continue;
      const c = hslToHex(hue, sat, l);
      if (ok(c)) return c;
    }
  }
  // 兜底:純黑或純白挑對比高的
  return contrastRatio("#000000", bgs[0]) >= contrastRatio("#ffffff", bgs[0])
    ? "#0a0a0a"
    : "#fafafa";
}

/**
 * 一鍵把配色修到目標等級:調整 text(對 bg/surface)、primary+primaryFg、accent+accentFg,
 * 各自就近移動明度直到達標。其餘角色(muted/border)不動。
 */
export function autoFix(p: Palette, level: "AA" | "AAA"): Palette {
  const target = level === "AAA" ? 7 : 4.5;
  const r = { ...p.roles };

  const th = hexToHsl(r.text);
  r.text = fitOnBgsNear([r.background, r.surface], th.h, th.s, th.l, target);

  const ph = hexToHsl(r.primary);
  const pf = fitFillNear(ph.h, ph.s, ph.l, target);
  r.primary = pf.color;
  r.primaryFg = pf.fg;

  const ah = hexToHsl(r.accent);
  const af = fitFillNear(ah.h, ah.s, ah.l, target);
  r.accent = af.color;
  r.accentFg = af.fg;

  return { ...p, roles: r, custom: true };
}
