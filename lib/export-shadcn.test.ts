import { describe, it, expect } from "vitest";
import { exportShadcn } from "./export-shadcn";
import { PALETTES } from "./palettes";

const out = exportShadcn(PALETTES[0]);

describe("exportShadcn", () => {
  it("emits :root and .dark blocks", () => {
    expect(out).toContain(":root {");
    expect(out).toContain(".dark {");
  });

  it("maps semantic roles to shadcn tokens in H S% L% format", () => {
    expect(out).toMatch(/--background: \d+ \d+% \d+%;/);
    expect(out).toMatch(/--primary: \d+ \d+% \d+%;/);
    expect(out).toContain("--primary-foreground:");
    expect(out).toContain("--ring:");
    expect(out).toContain("--radius: 0.5rem;");
  });
});
