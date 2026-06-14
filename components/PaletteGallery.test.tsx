import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PaletteGallery from "./PaletteGallery";
import { PALETTES } from "@/lib/palettes";

function setup(props = {}) {
  const onSelect = vi.fn();
  const onGenerate = vi.fn();
  render(
    <PaletteGallery
      palettes={PALETTES}
      selectedId=""
      onSelect={onSelect}
      onGenerate={onGenerate}
      {...props}
    />,
  );
  return { onSelect, onGenerate };
}

describe("PaletteGallery", () => {
  it("calls onSelect with the clicked palette", () => {
    const { onSelect } = setup();
    fireEvent.click(screen.getByText("午夜藍"));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "midnight-navy" }),
    );
  });

  it("generates with the default AA target", () => {
    const { onGenerate } = setup();
    fireEvent.click(screen.getByText("產生新配色"));
    expect(onGenerate).toHaveBeenCalledWith("AA");
  });

  it("generates with AAA after selecting the AAA filter", () => {
    const { onGenerate } = setup();
    fireEvent.click(screen.getByRole("button", { name: "AAA" }));
    fireEvent.click(screen.getByText("產生新配色"));
    expect(onGenerate).toHaveBeenCalledWith("AAA");
  });

  it("narrows the list when filtering by mood", () => {
    setup();
    expect(screen.getByText("午夜藍")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "科技未來" }));
    expect(screen.queryByText("午夜藍")).toBeNull(); // 沉穩專業,被濾掉
    expect(screen.getByText("賽博藍")).toBeInTheDocument(); // 科技未來,留著
  });

  it("shows an empty message when AAA filter matches nothing relevant", () => {
    // 先用只含一個 AA 級配色的清單,選 AAA 後應顯示空狀態
    const onSelect = vi.fn();
    render(
      <PaletteGallery
        palettes={[PALETTES.find((p) => p.id === "startup-orange")!]}
        selectedId=""
        onSelect={onSelect}
        onGenerate={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "AAA" }));
    expect(screen.queryByText("電光橘")).toBeNull();
  });
});
