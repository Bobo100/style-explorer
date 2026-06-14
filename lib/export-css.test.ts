import { describe, it, expect } from "vitest";
import { roleToVarName, exportCss } from "./export-css";
import { exportTailwind } from "./export-tailwind";
import type { Palette } from "./types";

const sample: Palette = {
  id: "sample",
  name: "範例",
  moods: ["極簡黑白"],
  roles: {
    background: "#ffffff",
    surface: "#f5f5f5",
    text: "#171717",
    muted: "#737373",
    border: "#e5e5e5",
    primary: "#2563eb",
    primaryFg: "#ffffff",
    accent: "#f59e0b",
    accentFg: "#171717",
  },
  blurb: "",
  why: "",
  roleUsage: {},
};

describe("roleToVarName", () => {
  it("maps camelCase roles to kebab css vars", () => {
    expect(roleToVarName("background")).toBe("--color-background");
    expect(roleToVarName("primaryFg")).toBe("--color-primary-fg");
    expect(roleToVarName("accentFg")).toBe("--color-accent-fg");
  });
});

describe("exportCss", () => {
  it("wraps vars in :root and lists all 9 roles", () => {
    const css = exportCss(sample);
    expect(css.startsWith(":root {")).toBe(true);
    expect(css.trimEnd().endsWith("}")).toBe(true);
    expect(css).toContain("--color-background: #ffffff;");
    expect(css).toContain("--color-primary: #2563eb;");
    expect(css).toContain("--color-accent-fg: #171717;");
    // 9 個角色 = 9 行 var
    expect(css.match(/--color-/g)?.length).toBe(9);
  });
});

describe("exportTailwind", () => {
  it("wraps the same vars in @theme", () => {
    const tw = exportTailwind(sample);
    expect(tw.startsWith("@theme {")).toBe(true);
    expect(tw).toContain("--color-primary: #2563eb;");
    expect(tw.match(/--color-/g)?.length).toBe(9);
  });
});
