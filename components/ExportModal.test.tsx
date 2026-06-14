import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ExportModal from "./ExportModal";
import { PALETTES } from "@/lib/palettes";

describe("ExportModal", () => {
  it("switches to the shadcn/ui format and shows a .dark block", () => {
    const { container } = render(
      <ExportModal palette={PALETTES[0]} open onClose={vi.fn()} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "shadcn/ui" }));
    expect(container.textContent).toContain(".dark {");
    expect(container.textContent).toContain("--primary:");
  });

  it("renders nothing when closed", () => {
    const { container } = render(
      <ExportModal palette={PALETTES[0]} open={false} onClose={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
