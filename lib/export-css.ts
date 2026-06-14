import { parseHex } from "./contrast";
import { ROLES, type Palette, type Role } from "./types";

/** camelCase role → kebab css 變數名(primaryFg → primary-fg) */
export function roleToVarName(role: Role): string {
  return "--color-" + role.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/** 產生 9 行 `--color-x: #y;`(ROLES 固定順序,deterministic) */
export function roleVarLines(palette: Palette): string[] {
  return ROLES.map((role) => `${roleToVarName(role)}: ${palette.roles[role]};`);
}

function rgba(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * 由配色衍生的漸層 + 陰影 token(主色→強調色漸層、以文字色為基底的兩級陰影)。
 * 名稱不帶 `--color-`,所以不影響角色變數計數。
 */
export function extraTokenLines(palette: Palette): string[] {
  const { primary, accent, text } = palette.roles;
  return [
    `--gradient-brand: linear-gradient(135deg, ${primary}, ${accent});`,
    `--shadow-sm: 0 1px 2px ${rgba(text, 0.08)};`,
    `--shadow-md: 0 6px 16px ${rgba(text, 0.12)};`,
  ];
}

/** Palette → 可貼進專案的 CSS variables 區塊(含漸層 / 陰影 token) */
export function exportCss(palette: Palette): string {
  const body = [...roleVarLines(palette), ...extraTokenLines(palette)]
    .map((l) => `  ${l}`)
    .join("\n");
  return `:root {\n${body}\n}`;
}
