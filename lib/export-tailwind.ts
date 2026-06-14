import { type Palette } from "./types";
import { roleVarLines } from "./export-css";

/** Palette → Tailwind v4 `@theme` 區塊(貼進 globals.css 即生 bg-primary 等 utility) */
export function exportTailwind(palette: Palette): string {
  const body = roleVarLines(palette)
    .map((l) => `  ${l}`)
    .join("\n");
  return `@theme {\n${body}\n}`;
}
