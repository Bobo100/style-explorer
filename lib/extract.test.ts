import { describe, it, expect } from "vitest";
import {
  extractColors,
  rolesFromColors,
  paletteFromImage,
  type PixelSource,
} from "./extract";
import { contrastRatio, relativeLuminance } from "./contrast";
import { ROLES } from "./types";

// 10 像素:7 藍 + 3 橘,藍應為主色
function makeSource(): PixelSource {
  const blue = [37, 99, 235];
  const orange = [245, 158, 11];
  const data: number[] = [];
  for (let i = 0; i < 7; i++) data.push(...blue, 255);
  for (let i = 0; i < 3; i++) data.push(...orange, 255);
  return { data, width: 10, height: 1 };
}

describe("extractColors", () => {
  it("returns dominant colour first and skips transparent pixels", () => {
    const colors = extractColors(makeSource());
    expect(colors[0].toLowerCase()).toBe("#2563eb");
    expect(colors).toHaveLength(2);
  });

  it("ignores fully transparent pixels", () => {
    const data = [37, 99, 235, 0, 245, 158, 11, 0]; // 全透明
    const colors = extractColors({ data, width: 2, height: 1 });
    expect(colors).toHaveLength(0);
  });
});

describe("rolesFromColors", () => {
  it("produces all 9 roles with a readable neutral skeleton", () => {
    const roles = rolesFromColors(["#2563eb", "#f59e0b"]);
    for (const r of ROLES) expect(roles[r]).toMatch(/^#[0-9a-f]{6}$/i);
    expect(relativeLuminance(roles.background)).toBeGreaterThan(0.8);
    expect(relativeLuminance(roles.text)).toBeLessThan(0.15);
    // 中性骨架(內文/底色)保證 AAA
    expect(contrastRatio(roles.text, roles.background)).toBeGreaterThanOrEqual(7);
  });

  it("falls back gracefully when no chromatic colour is found", () => {
    const roles = rolesFromColors(["#ffffff", "#000000"]);
    for (const r of ROLES) expect(roles[r]).toMatch(/^#[0-9a-f]{6}$/i);
  });
});

describe("paletteFromImage", () => {
  it("builds a custom palette tagged from-image", () => {
    const p = paletteFromImage(["#2563eb", "#f59e0b"]);
    expect(p.id).toBe("from-image");
    expect(p.custom).toBe(true);
    expect(Object.keys(p.roles)).toHaveLength(9);
  });
});
