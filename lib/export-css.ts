import { ROLES, type Palette, type Role } from "./types";

/** camelCase role → kebab css 變數名(primaryFg → primary-fg) */
export function roleToVarName(role: Role): string {
  return "--color-" + role.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/** 產生 9 行 `--color-x: #y;`(ROLES 固定順序,deterministic) */
export function roleVarLines(palette: Palette): string[] {
  return ROLES.map((role) => `${roleToVarName(role)}: ${palette.roles[role]};`);
}

/** Palette → 可貼進專案的 CSS variables 區塊 */
export function exportCss(palette: Palette): string {
  const body = roleVarLines(palette)
    .map((l) => `  ${l}`)
    .join("\n");
  return `:root {\n${body}\n}`;
}
