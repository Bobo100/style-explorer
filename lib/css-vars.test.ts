import { describe, it, expect } from "vitest";
import { appVarName, paletteStyleVars } from "./css-vars";
import { PALETTES } from "./palettes";

describe("appVarName", () => {
  it("maps roles to --app-* kebab vars", () => {
    expect(appVarName("background")).toBe("--app-background");
    expect(appVarName("primaryFg")).toBe("--app-primary-fg");
  });
});

describe("paletteStyleVars", () => {
  it("emits all 9 --app-* vars for a palette", () => {
    const vars = paletteStyleVars(PALETTES[0]) as Record<string, string>;
    expect(Object.keys(vars)).toHaveLength(9);
    expect(vars["--app-primary"]).toBe(PALETTES[0].roles.primary);
    expect(vars["--app-accent-fg"]).toBe(PALETTES[0].roles.accentFg);
  });
});
