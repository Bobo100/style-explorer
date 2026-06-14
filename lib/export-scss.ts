import { ROLES, type Palette } from "./types";
import { extraTokenLines, roleToVarName } from "./export-css";

/** Palette → SCSS 變數($color-primary 等,含漸層 / 陰影 token) */
export function exportScss(palette: Palette): string {
  const colors = ROLES.map(
    (role) =>
      `${roleToVarName(role).replace(/^--/, "$")}: ${palette.roles[role]};`,
  );
  // `--gradient-brand: ...;` → `$gradient-brand: ...;`
  const extras = extraTokenLines(palette).map((l) => l.replace(/^--/, "$"));
  return [...colors, ...extras].join("\n");
}
