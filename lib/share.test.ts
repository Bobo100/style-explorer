import { describe, it, expect } from "vitest";
import { encodeState, decodeState, customPalette } from "./share";
import { PALETTES } from "./palettes";
import { ROLES } from "./types";

describe("encode/decode curated palette", () => {
  it("roundtrips a curated palette by id", () => {
    const { palette, template } = decodeState(
      "?" + encodeState(PALETTES[3], "dashboard"),
    );
    expect(palette?.id).toBe(PALETTES[3].id);
    expect(template).toBe("dashboard");
  });
});

describe("encode/decode custom palette", () => {
  it("roundtrips all 9 role colours", () => {
    const custom = { ...PALETTES[0], custom: true, name: "我的配色" };
    const encoded = encodeState(custom, "form");
    const { palette, template } = decodeState("?" + encoded);
    expect(template).toBe("form");
    expect(palette?.custom).toBe(true);
    expect(palette?.name).toBe("我的配色");
    for (const r of ROLES) {
      expect(palette?.roles[r]).toBe(custom.roles[r]);
    }
  });
});

describe("decodeState robustness", () => {
  it("returns nulls for empty / garbage input", () => {
    expect(decodeState("").palette).toBeNull();
    expect(decodeState("?t=nope&p=nope").palette).toBeNull();
    expect(decodeState("?t=nope").template).toBeNull();
    expect(decodeState("?c=xyz").palette).toBeNull();
  });
});

describe("customPalette", () => {
  it("builds a custom palette from roles", () => {
    const roles = Object.fromEntries(
      ROLES.map((r) => [r, "#123456"]),
    ) as Record<(typeof ROLES)[number], string>;
    const p = customPalette(roles);
    expect(p.custom).toBe(true);
    expect(p.roles.primary).toBe("#123456");
  });
});
