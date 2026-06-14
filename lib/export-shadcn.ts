// 匯出 shadcn/ui theme(:root + .dark)。shadcn 的 CSS 變數值是「H S% L%」空白分隔。
import { hexToHsl } from "./color";
import { toDark } from "./dark";
import type { Palette, Role } from "./types";

/** hex → shadcn 用的 "H S% L%" 三元組 */
function triplet(hex: string): string {
  const { h, s, l } = hexToHsl(hex);
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/** 角色 → shadcn token 對映(同一份邏輯給亮/暗兩個 block 用) */
function shadcnLines(roles: Record<Role, string>): string {
  const v = (hex: string) => triplet(hex);
  const map: [string, string][] = [
    ["--background", v(roles.background)],
    ["--foreground", v(roles.text)],
    ["--card", v(roles.surface)],
    ["--card-foreground", v(roles.text)],
    ["--popover", v(roles.surface)],
    ["--popover-foreground", v(roles.text)],
    ["--primary", v(roles.primary)],
    ["--primary-foreground", v(roles.primaryFg)],
    ["--secondary", v(roles.surface)],
    ["--secondary-foreground", v(roles.text)],
    ["--muted", v(roles.surface)],
    ["--muted-foreground", v(roles.muted)],
    ["--accent", v(roles.accent)],
    ["--accent-foreground", v(roles.accentFg)],
    ["--border", v(roles.border)],
    ["--input", v(roles.border)],
    ["--ring", v(roles.primary)],
    ["--radius", "0.5rem"],
  ];
  return map.map(([k, val]) => `  ${k}: ${val};`).join("\n");
}

/** Palette → shadcn/ui globals.css(含自動推出的 .dark) */
export function exportShadcn(palette: Palette): string {
  const light = shadcnLines(palette.roles);
  const dark = shadcnLines(toDark(palette).roles);
  return `:root {\n${light}\n}\n\n.dark {\n${dark}\n}`;
}
