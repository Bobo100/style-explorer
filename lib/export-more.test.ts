import { describe, it, expect } from "vitest";
import { exportScss } from "./export-scss";
import { exportJson } from "./export-json";
import { PALETTES } from "./palettes";

const p = PALETTES[0];

describe("exportScss", () => {
  it("emits $-prefixed SCSS variables for all 9 roles", () => {
    const scss = exportScss(p);
    expect(scss).toContain(`$color-primary: ${p.roles.primary};`);
    expect(scss).toContain(`$color-accent-fg: ${p.roles.accentFg};`);
    expect(scss.match(/\$color-/g)?.length).toBe(9);
  });
});

describe("exportJson", () => {
  it("emits valid W3C design-token JSON", () => {
    const obj = JSON.parse(exportJson(p));
    expect(Object.keys(obj.color)).toHaveLength(9);
    expect(obj.color.primary).toEqual({
      $value: p.roles.primary,
      $type: "color",
    });
    expect(obj.color["primary-fg"].$value).toBe(p.roles.primaryFg);
  });
});
