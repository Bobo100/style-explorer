import type { CSSProperties } from "react";
import { ROLES, type Palette, type Role } from "./types";

/** role → preview scope 上的 css 變數名(primaryFg → --app-primary-fg) */
export function appVarName(role: Role): string {
  return "--app-" + role.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/** 把一組 palette 攤成可直接掛在元素 style 上的 CSS 變數 */
export function paletteStyleVars(palette: Palette): CSSProperties {
  const out: Record<string, string> = {};
  for (const role of ROLES) out[appVarName(role)] = palette.roles[role];
  return out as CSSProperties;
}
