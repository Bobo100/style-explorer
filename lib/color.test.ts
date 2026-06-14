import { describe, it, expect } from "vitest";
import { hexToHsl, hslToHex } from "./color";

describe("hexToHsl", () => {
  it("reads primaries and greys", () => {
    expect(hexToHsl("#ffffff").l).toBeCloseTo(1, 2);
    expect(hexToHsl("#000000").l).toBeCloseTo(0, 2);
    const red = hexToHsl("#ff0000");
    expect(red.h).toBeCloseTo(0, 0);
    expect(red.s).toBeCloseTo(1, 2);
    expect(red.l).toBeCloseTo(0.5, 2);
    expect(hexToHsl("#808080").s).toBeCloseTo(0, 2);
  });

  it("reads hue of green and blue", () => {
    expect(hexToHsl("#00ff00").h).toBeCloseTo(120, 0);
    expect(hexToHsl("#0000ff").h).toBeCloseTo(240, 0);
  });
});

describe("hslToHex", () => {
  it("renders primaries", () => {
    expect(hslToHex(0, 1, 0.5)).toBe("#ff0000");
    expect(hslToHex(120, 1, 0.5)).toBe("#00ff00");
    expect(hslToHex(240, 1, 0.5)).toBe("#0000ff");
    expect(hslToHex(0, 0, 1)).toBe("#ffffff");
  });

  it("wraps and clamps out-of-range inputs", () => {
    expect(hslToHex(360, 1, 0.5)).toBe("#ff0000");
    expect(hslToHex(-360, 1, 0.5)).toBe("#ff0000");
  });
});

describe("hex ↔ hsl roundtrip", () => {
  it("survives a roundtrip within rounding tolerance", () => {
    for (const hex of ["#2563eb", "#ea580c", "#0d9488", "#7c3aed", "#1a2417"]) {
      const { h, s, l } = hexToHsl(hex);
      expect(hslToHex(h, s, l)).toBe(hex);
    }
  });
});
