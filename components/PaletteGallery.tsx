"use client";

import { useMemo, useState } from "react";
import { PALETTES } from "@/lib/palettes";
import type { MoodTag, Palette } from "@/lib/types";
import { t } from "@/lib/strings";

const SWATCH_ROLES = [
  "background",
  "surface",
  "primary",
  "accent",
  "text",
] as const;

function allMoods(): MoodTag[] {
  const set = new Set<MoodTag>();
  for (const p of PALETTES) for (const m of p.moods) set.add(m);
  return [...set];
}

export default function PaletteGallery({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (p: Palette) => void;
}) {
  const [mood, setMood] = useState<MoodTag | null>(null);
  const moods = useMemo(allMoods, []);
  const list = useMemo(
    () => (mood ? PALETTES.filter((p) => p.moods.includes(mood)) : PALETTES),
    [mood],
  );

  return (
    <div className="flex h-full flex-col bg-white">
      {/* 篩選 */}
      <div className="border-b border-stone-200 p-3">
        <p className="mb-2 text-xs font-medium text-stone-400">
          {t.filterLabel} · {t.paletteCount(list.length)}
        </p>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={mood === null} onClick={() => setMood(null)}>
            {t.filterAll}
          </FilterChip>
          {moods.map((m) => (
            <FilterChip
              key={m}
              active={mood === m}
              onClick={() => setMood(mood === m ? null : m)}
            >
              {m}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* 配色清單 */}
      <div className="flex-1 space-y-2 overflow-auto p-3">
        {list.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className={`block w-full rounded-xl border p-3 text-left transition-all ${
              selectedId === p.id
                ? "border-stone-900 ring-1 ring-stone-900"
                : "border-stone-200 hover:border-stone-400"
            }`}
          >
            <div className="mb-2 flex overflow-hidden rounded-lg">
              {SWATCH_ROLES.map((role) => (
                <span
                  key={role}
                  className="h-8 flex-1"
                  style={{ backgroundColor: p.roles[role] }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-stone-800">
                {p.name}
              </span>
              <span className="text-xs text-stone-400">{p.moods[0]}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "bg-stone-900 text-white"
          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
      }`}
    >
      {children}
    </button>
  );
}
