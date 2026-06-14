import { describe, it, expect } from "vitest";
import { simulate, CB_LABELS } from "./colorblind";

describe("simulate", () => {
  it("returns a valid hex for every type", () => {
    for (const type of Object.keys(CB_LABELS) as (keyof typeof CB_LABELS)[]) {
      expect(simulate("#ea580c", type)).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it("keeps greys grey (matrix rows sum to 1)", () => {
    expect(simulate("#808080", "protanopia")).toBe("#808080");
    expect(simulate("#ffffff", "deuteranopia")).toBe("#ffffff");
    expect(simulate("#000000", "tritanopia")).toBe("#000000");
  });

  it("shifts a saturated red under protanopia", () => {
    expect(simulate("#ff0000", "protanopia")).not.toBe("#ff0000");
  });
});
