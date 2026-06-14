import { describe, it, expect } from "vitest";
import { setRole, autoFix } from "./adjust";
import { meetsGrade } from "./grade";
import { PALETTES } from "./palettes";
import type { Palette } from "./types";

const base = PALETTES[0];

function broken(): Palette {
  // 故意做爛:中灰主色配白字、淺強調配白字、灰文字 —— 多處不足
  return {
    ...base,
    roles: {
      ...base.roles,
      text: "#777777",
      primary: "#999999",
      primaryFg: "#ffffff",
      accent: "#bbbbbb",
      accentFg: "#ffffff",
    },
  };
}

describe("setRole", () => {
  it("returns a new palette without mutating the original", () => {
    const next = setRole(base, "primary", "#123456");
    expect(next.roles.primary).toBe("#123456");
    expect(next.custom).toBe(true);
    expect(base.roles.primary).not.toBe("#123456");
  });
});

describe("autoFix", () => {
  it("repairs a broken palette to AA", () => {
    const fixed = autoFix(broken(), "AA");
    expect(meetsGrade(fixed, "AA")).toBe(true);
    expect(fixed.custom).toBe(true);
  });

  it("repairs a broken palette to AAA", () => {
    expect(meetsGrade(autoFix(broken(), "AAA"), "AAA")).toBe(true);
  });

  it("lifts every curated palette to the target level", () => {
    for (const p of PALETTES) {
      expect(meetsGrade(autoFix(p, "AA"), "AA"), `${p.id} AA`).toBe(true);
      expect(meetsGrade(autoFix(p, "AAA"), "AAA"), `${p.id} AAA`).toBe(true);
    }
  });

  it("leaves an already-AAA palette still AAA", () => {
    const aaa = autoFix(base, "AAA");
    expect(meetsGrade(aaa, "AAA")).toBe(true);
  });
});
