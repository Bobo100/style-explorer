import { describe, it, expect } from "vitest";
import {
  relativeLuminance,
  contrastRatio,
  wcagLevel,
  bestTextOn,
} from "./contrast";

describe("relativeLuminance", () => {
  it("white is 1, black is 0", () => {
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1, 5);
    expect(relativeLuminance("#000000")).toBeCloseTo(0, 5);
  });

  it("accepts shorthand and uppercase hex", () => {
    expect(relativeLuminance("#FFF")).toBeCloseTo(1, 5);
    expect(relativeLuminance("#000")).toBeCloseTo(0, 5);
  });
});

describe("contrastRatio", () => {
  it("black on white is 21:1 (max)", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 2);
  });

  it("same colour is 1:1 (min)", () => {
    expect(contrastRatio("#3366cc", "#3366cc")).toBeCloseTo(1, 5);
  });

  it("is order-independent", () => {
    expect(contrastRatio("#000", "#fff")).toBeCloseTo(
      contrastRatio("#fff", "#000"),
      5,
    );
  });

  it("#767676 on white passes AA (>= 4.5)", () => {
    expect(contrastRatio("#767676", "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });

  it("#777777 on white fails AA (< 4.5)", () => {
    expect(contrastRatio("#777777", "#ffffff")).toBeLessThan(4.5);
  });
});

describe("wcagLevel", () => {
  it("classifies normal text thresholds", () => {
    expect(wcagLevel(21)).toBe("AAA");
    expect(wcagLevel(7)).toBe("AAA");
    expect(wcagLevel(4.5)).toBe("AA");
    expect(wcagLevel(4.49)).toBe("Fail");
    expect(wcagLevel(1)).toBe("Fail");
  });

  it("uses relaxed thresholds for large text", () => {
    expect(wcagLevel(4.5, true)).toBe("AAA");
    expect(wcagLevel(3, true)).toBe("AA");
    expect(wcagLevel(2.99, true)).toBe("Fail");
  });
});

describe("bestTextOn", () => {
  it("picks black text on a light background", () => {
    expect(bestTextOn("#ffffff")).toBe("#000000");
  });

  it("picks white text on a dark background", () => {
    expect(bestTextOn("#111111")).toBe("#ffffff");
  });
});
