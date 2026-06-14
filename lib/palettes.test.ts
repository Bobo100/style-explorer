import { describe, it, expect } from "vitest";
import { PALETTES, getPalette } from "./palettes";
import { ROLES } from "./types";
import { contrastRatio } from "./contrast";

describe("PALETTES data integrity", () => {
  it("has a healthy library size", () => {
    expect(PALETTES.length).toBeGreaterThanOrEqual(20);
  });

  it("every palette id is unique and kebab-case", () => {
    const ids = PALETTES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("every palette defines all 9 roles with valid hex", () => {
    for (const p of PALETTES) {
      for (const role of ROLES) {
        expect(p.roles[role], `${p.id}.${role}`).toMatch(/^#[0-9a-f]{6}$/i);
      }
    }
  });

  it("every palette has non-empty copy", () => {
    for (const p of PALETTES) {
      expect(p.name.length, p.id).toBeGreaterThan(0);
      expect(p.blurb.length, p.id).toBeGreaterThan(0);
      expect(p.why.length, p.id).toBeGreaterThan(0);
      expect(p.moods.length, p.id).toBeGreaterThan(0);
    }
  });
});

describe("PALETTES readability (WCAG)", () => {
  it("body text passes AA on background and surface", () => {
    for (const p of PALETTES) {
      expect(
        contrastRatio(p.roles.text, p.roles.background),
        `${p.id} text/background`,
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrastRatio(p.roles.text, p.roles.surface),
        `${p.id} text/surface`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("foreground-on-fill colours meet UI contrast (>= 3)", () => {
    for (const p of PALETTES) {
      expect(
        contrastRatio(p.roles.primaryFg, p.roles.primary),
        `${p.id} primaryFg/primary`,
      ).toBeGreaterThanOrEqual(3);
      expect(
        contrastRatio(p.roles.accentFg, p.roles.accent),
        `${p.id} accentFg/accent`,
      ).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("getPalette", () => {
  it("finds by id and returns undefined for misses", () => {
    expect(getPalette(PALETTES[0].id)?.id).toBe(PALETTES[0].id);
    expect(getPalette("nope")).toBeUndefined();
  });
});
