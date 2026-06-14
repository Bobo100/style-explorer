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

describe("InfoPanel", () => {
  it("offers auto-fix on a sub-AAA palette and reports the chosen level", () => {
    const onAutoFix = vi.fn();
    render(
      <InfoPanel palette={broken()} onEdit={vi.fn()} onAutoFix={onAutoFix} />,
    );
    fireEvent.click(screen.getByText("一鍵修到 AAA"));
    expect(onAutoFix).toHaveBeenCalledWith("AAA");
  });

  it("emits edits from the colour pickers", () => {
    const onEdit = vi.fn();
    render(<InfoPanel palette={broken()} onEdit={onEdit} onAutoFix={vi.fn()} />);
    fireEvent.click(screen.getByText("微調顏色"));
    fireEvent.change(screen.getByLabelText("主色"), {
      target: { value: "#123456" },
    });
    expect(onEdit).toHaveBeenCalledWith("primary", "#123456");
  });

  it("hides fix buttons when the palette is already AAA", () => {
    const aaa = PALETTES.find((p) => p.id === "pure-mono")!; // 全黑白,AAA
    render(<InfoPanel palette={aaa} onEdit={vi.fn()} onAutoFix={vi.fn()} />);
    expect(screen.queryByText("一鍵修到 AAA")).toBeNull();
  });
});
