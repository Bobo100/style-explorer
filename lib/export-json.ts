import { ROLES, type Palette } from "./types";
import { roleToVarName } from "./export-css";

/** Palette → W3C Design Tokens JSON(Figma / Style Dictionary 可吃) */
export function exportJson(palette: Palette): string {
  const color: Record<string, { $value: string; $type: "color" }> = {};
  for (const role of ROLES) {
    const key = roleToVarName(role).replace(/^--color-/, "");
    color[key] = { $value: palette.roles[role], $type: "color" };
  }
  return JSON.stringify({ color }, null, 2);
}
