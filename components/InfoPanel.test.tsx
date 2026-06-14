import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import InfoPanel from "./InfoPanel";
import { PALETTES } from "@/lib/palettes";
import type { Palette } from "@/lib/types";

function broken(): Palette {
  return {
    ...PALETTES[0],
    roles: {
      ...PALETTES[0].roles,
      primary: "#999999",
      primaryFg: "#ffffff",
    },
  };
}

// 主色按鈕對比 ~3.5:1 → 內文門檻 Fail、大字門檻 AA(其餘角色維持達標)
function primaryBorderline(): Palette {
  return {
    ...PALETTES[0],
    roles: {
      ...PALETTES[0].roles,
      primary: "#888888",
      primaryFg: "#ffffff",
    },
  };
}

function renderPanel(palette: Palette, overrides = {}) {
  const props = {
    palette,
    onEdit: vi.fn(),
    onAutoFix: vi.fn(),
    onTweak: vi.fn(),
    tweakKey: "0",
    isFav: false,
    onToggleFav: vi.fn(),
    ...overrides,
  };
  render(<InfoPanel {...props} />);
  return props;
}

describe("InfoPanel", () => {
  it("offers auto-fix on a sub-AAA palette and reports the chosen level", () => {
    const { onAutoFix } = renderPanel(broken());
    fireEvent.click(screen.getByText("一鍵修到 AAA"));
    expect(onAutoFix).toHaveBeenCalledWith("AAA");
  });

  it("emits edits from the colour pickers", () => {
    const { onEdit } = renderPanel(broken());
    fireEvent.click(screen.getByText("微調顏色"));
    fireEvent.change(screen.getByLabelText("主色"), {
      target: { value: "#123456" },
    });
    expect(onEdit).toHaveBeenCalledWith("primary", "#123456");
  });

  it("hides fix buttons when the palette is already AAA", () => {
    renderPanel(PALETTES.find((p) => p.id === "pure-mono")!);
    expect(screen.queryByText("一鍵修到 AAA")).toBeNull();
  });

  it("toggles favorite", () => {
    const { onToggleFav } = renderPanel(PALETTES[0]);
    fireEvent.click(screen.getByRole("button", { name: "收藏" }));
    expect(onToggleFav).toHaveBeenCalled();
  });

  it("reveals the global tweak sliders and emits onTweak", () => {
    const { onTweak } = renderPanel(PALETTES[0]);
    fireEvent.click(screen.getByText("整組微調"));
    fireEvent.change(screen.getByLabelText("鮮豔度"), {
      target: { value: "1.3" },
    });
    expect(onTweak).toHaveBeenCalledWith(0, 1.3);
  });

  it("relaxes the WCAG verdict when switching to large text", () => {
    renderPanel(primaryBorderline());
    expect(screen.getAllByText("不足").length).toBe(1); // 主色那列
    fireEvent.click(screen.getByRole("button", { name: "大字" }));
    expect(screen.queryByText("不足")).toBeNull(); // 大字門檻下過關
  });
});
