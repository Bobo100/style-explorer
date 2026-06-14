// 整組微調:一根「明暗」、一根「鮮豔度」滑桿,對 9 個角色同時調 HSL。
// 是粗調的鈍刀(會影響對比),調完可用一鍵修 AA/AAA 補回可讀性。
import { hexToHsl, hslToHex } from "./color";
import { ROLES, type Palette, type Role } from "./types";

export interface Tweak {
  lightness: number; // 明度位移,建議 -0.2 ~ 0.2
  saturation: number; // 彩度倍率,建議 0.5 ~ 1.5(1 = 不變)
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** 套用整組微調,回新 palette(immutable,標 custom)。lightness=0 且 saturation=1 時等同原色 */
export function tweakPalette(p: Palette, { lightness, saturation }: Tweak): Palette {
  const roles = {} as Record<Role, string>;
  for (const role of ROLES) {
    const { h, s, l } = hexToHsl(p.roles[role]);
    roles[role] = hslToHex(h, clamp01(s * saturation), clamp01(l + lightness));
  }
  return { ...p, roles, custom: true };
}
