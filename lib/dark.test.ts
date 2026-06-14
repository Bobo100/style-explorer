import { describe, it, expect } from "vitest";
import { toDark } from "./dark";
import { PALETTES } from "./palettes";
import { contrastRatio, relativeLuminance } from "./contrast";

describe("toDark", () => {
  it("flips the neutral skeleton: dark bg, light text, still readable", () => {
    for (const p of PALETTES.slice(0, 6)) {
      const d = toDark(p);
      expect(relativeLuminance(d.roles.background)).toBeLessThan(0.12);
      expect(relativeLuminance(d.roles.text)).toBeGreaterThan(0.7);
      expect(contrastRatio(d.roles.text, d.roles.background)).toBeGreaterThanOrEqual(7);
    }
  });

  it("tags the dark variant id/name and keeps 9 roles", () => {
    const d = toDark(PALETTES[0]);
    expect(d.id.endsWith("-dark")).toBe(true);
    expect(d.name).toContain("深色");
    expect(Object.keys(d.roles)).toHaveLength(9);
  });
});
