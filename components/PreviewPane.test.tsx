import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PreviewPane from "./PreviewPane";
import { PALETTES } from "@/lib/palettes";

describe("PreviewPane", () => {
  it("toggles the light/dark preview theme", () => {
    render(
      <PreviewPane
        palette={PALETTES[0]}
        template="landing"
        onTemplateChange={vi.fn()}
      />,
    );
    const dark = screen.getByRole("button", { name: "暗色" });
    expect(dark).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(dark);
    expect(dark).toHaveAttribute("aria-pressed", "true");
  });

  it("switches templates via the tab bar", () => {
    const onTemplateChange = vi.fn();
    render(
      <PreviewPane
        palette={PALETTES[0]}
        template="landing"
        onTemplateChange={onTemplateChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "儀表板" }));
    expect(onTemplateChange).toHaveBeenCalledWith("dashboard");
  });
});
