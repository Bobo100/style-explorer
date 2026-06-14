import { describe, it, expect, beforeEach } from "vitest";
import {
  paletteSig,
  isFavorite,
  toggleFavorite,
  loadFavorites,
  saveFavorites,
} from "./favorites";
import { PALETTES } from "./palettes";

const a = PALETTES[0];
const b = PALETTES[1];

describe("toggleFavorite / isFavorite", () => {
  it("adds then removes by colour signature", () => {
    let favs = toggleFavorite([], a);
    expect(isFavorite(favs, a)).toBe(true);
    expect(isFavorite(favs, b)).toBe(false);
    favs = toggleFavorite(favs, a);
    expect(isFavorite(favs, a)).toBe(false);
  });

  it("treats same-colours-different-name as the same favorite", () => {
    const renamed = { ...a, name: "改個名", custom: true };
    const favs = toggleFavorite([], a);
    expect(isFavorite(favs, renamed)).toBe(true);
    expect(toggleFavorite(favs, renamed)).toHaveLength(0); // 移除掉
  });

  it("does not mutate the input array", () => {
    const favs: typeof PALETTES = [];
    toggleFavorite(favs, a);
    expect(favs).toHaveLength(0);
  });
});

describe("localStorage persistence", () => {
  beforeEach(() => localStorage.clear());

  it("roundtrips through save/load", () => {
    saveFavorites([a, b]);
    const loaded = loadFavorites();
    expect(loaded.map(paletteSig)).toEqual([a, b].map(paletteSig));
  });

  it("returns [] when nothing stored or data is corrupt", () => {
    expect(loadFavorites()).toEqual([]);
    localStorage.setItem("style-explorer:favorites", "{not json");
    expect(loadFavorites()).toEqual([]);
  });
});
