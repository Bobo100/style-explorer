import { describe, it, expect } from "vitest";
import { generatePalette, generateBatch } from "./generate";
import { paletteGrade, meetsGrade } from "./grade";
import { ROLES } from "./types";

describe("generatePalette", () => {
  it("produces a structurally valid palette", () => {
    const p = generatePalette({ hue: 220, harmony: "complementary", level: "AA" });
    for (const role of ROLES) {
      expect(p.roles[role]).toMatch(/^#[0-9a-f]{6}$/i);
    }
    expect(p.generated).toBe(true);
    expect(p.name.length).toBeGreaterThan(0);
    expect(p.moods.length).toBe(1);
  });

  it("is deterministic for the same inputs", () => {
    const a = generatePalette({ hue: 100, harmony: "triadic", level: "AAA" });
    const b = generatePalette({ hue: 100, harmony: "triadic", level: "AAA" });
    expect(a.roles).toEqual(b.roles);
  });
});

describe("generated palettes meet their target level", () => {
  it("AA batch all meet AA", () => {
    for (const p of generateBatch(12, "AA")) {
      expect(meetsGrade(p, "AA"), `${p.id} grade=${paletteGrade(p)}`).toBe(true);
    }
  });

  it("AAA batch all meet AAA", () => {
    for (const p of generateBatch(12, "AAA")) {
      expect(meetsGrade(p, "AAA"), `${p.id} grade=${paletteGrade(p)}`).toBe(
        true,
      );
    }
  });
});

describe("generateBatch", () => {
  it("gives distinct hues / ids within a batch", () => {
    const batch = generateBatch(8, "AA");
    expect(new Set(batch.map((p) => p.id)).size).toBe(batch.length);
  });

  it("seed shifts the produced hues", () => {
    const a = generateBatch(4, "AA", 0);
    const b = generateBatch(4, "AA", 4);
    expect(a.map((p) => p.id)).not.toEqual(b.map((p) => p.id));
  });
});
