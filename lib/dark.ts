// 從一組(亮色)配色自動推出深色版。保留色相,翻轉明度骨架,主/強調色提亮以在暗底上跳出來。
import { hexToHsl, hslToHex } from "./color";
import { bestTextOn } from "./contrast";
import type { Palette, Role } from "./types";

/** 把主色 / 強調色調到適合深色背景:夠亮才跳得出來,彩度稍降不刺眼 */
function popOnDark(hex: string): string {
  const { h, s, l } = hexToHsl(hex);
  const nl = Math.max(l, 0.62);
  const ns = Math.min(s, 0.8);
  return hslToHex(h, ns, nl);
}

/** 亮色配色 → 深色配色(角色語意不變,只換值) */
export function toDark(p: Palette): Palette {
  const bg = hexToHsl(p.roles.background);
  const tx = hexToHsl(p.roles.text);

  const primary = popOnDark(p.roles.primary);
  const accent = popOnDark(p.roles.accent);

  const roles: Record<Role, string> = {
    background: hslToHex(bg.h, Math.min(bg.s, 0.18), 0.09),
    surface: hslToHex(bg.h, Math.min(bg.s, 0.16), 0.15),
    text: hslToHex(tx.h, Math.min(tx.s, 0.14), 0.93),
    muted: hslToHex(tx.h, Math.min(tx.s, 0.14), 0.64),
    border: hslToHex(bg.h, Math.min(bg.s, 0.2), 0.26),
    primary,
    primaryFg: bestTextOn(primary),
    accent,
    accentFg: bestTextOn(accent),
  };

  return {
    ...p,
    id: `${p.id}-dark`,
    name: `${p.name}(深色)`,
    roles,
  };
}
