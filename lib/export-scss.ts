import { ROLES, type Palette } from "./types";
import { roleToVarName } from "./export-css";

/** Palette → SCSS 變數($color-primary 等) */
export function exportScss(palette: Palette): string {
  return ROLES.map(
    (role) =>
      `${roleToVarName(role).replace(/^--/, "$")}: ${palette.roles[role]};`,
  ).join("\n");
}
