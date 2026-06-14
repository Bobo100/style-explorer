import { describe, it, expect } from "vitest";
import { tweakPalette } from "./tweak";
import { hexToHsl } from "./color";
import { parseHex } from "./contrast";
import { PALETTES } from "./palettes";
import { ROLES } from "./types";

const p = PALETTES[0];

describe("tweakPalette", () => {
  it("saturation 0 turns every role greyscale", () => {
    const out = tweakPalette(p, { lightness: 0, saturation: 0 });
    for (const r of ROLES) {
      const [rr, gg, bb] = parseHex(out.roles[r]);
      expect(rr).toBe(gg);
      expect(gg).toBe(bb);
    }
  });

  it("positive lightness raises each role's lightness (unless clamped)", () => {
    const out = tweakPalette(p, { lightness: 0.1, saturation: 1 });
    for (const r of ROLES) {
      const before = hexToHsl(p.roles[r]).l;
      const after = hexToHsl(out.roles[r]).l;
      if (before < 0.88) expect(after).toBeGreaterThan(before);
    }
  });

  it("marks the result custom and stays immutable", () => {
    const before = { ...p.roles };
    const out = tweakPalette(p, { lightness: 0.05, saturation: 1.2 });
    expect(out.custom).toBe(true);
    expect(p.roles).toEqual(before); // 原物件不被改
  });
});
