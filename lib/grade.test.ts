import { describe, it, expect } from "vitest";
import { paletteGrade, meetsGrade } from "./grade";
import { PALETTES } from "./palettes";
import type { Palette } from "./types";

function mk(roles: Partial<Palette["roles"]>): Palette {
  return {
    id: "x",
    name: "x",
    moods: ["極簡黑白"],
    roles: {
      background: "#ffffff",
      surface: "#ffffff",
      text: "#000000",
      muted: "#666666",
      border: "#eeeeee",
      primary: "#000000",
      primaryFg: "#ffffff",
      accent: "#000000",
      accentFg: "#ffffff",
      ...roles,
    },
    blurb: "",
    why: "",
    roleUsage: {},
  };
}

describe("paletteGrade", () => {
  it("black/white everywhere is AAA", () => {
    expect(paletteGrade(mk({}))).toBe("AAA");
  });

  it("drops to the worst pair's level", () => {
    // 白字疊在中灰主色上 → 該組合不足,整體被拉到 Fail
    expect(paletteGrade(mk({ primary: "#999999", primaryFg: "#ffffff" }))).toBe(
      "Fail",
    );
  });
});

describe("meetsGrade", () => {
  it("AAA palette satisfies both AA and AAA targets", () => {
    const p = mk({});
    expect(meetsGrade(p, "AA")).toBe(true);
    expect(meetsGrade(p, "AAA")).toBe(true);
  });

  it("a Fail palette satisfies neither", () => {
    const p = mk({ primary: "#999999", primaryFg: "#ffffff" });
    expect(meetsGrade(p, "AA")).toBe(false);
    expect(meetsGrade(p, "AAA")).toBe(false);
  });
});

describe("curated library grades", () => {
  it("every curated palette grades at least Fail-or-better consistently", () => {
    // 確保 paletteGrade 對所有策展配色都跑得出有效等級
    for (const p of PALETTES) {
      expect(["AAA", "AA", "Fail"]).toContain(paletteGrade(p));
    }
  });
});
