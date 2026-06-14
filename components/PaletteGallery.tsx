"use client";

import { useMemo, useState } from "react";
import { Sparkles, Check } from "lucide-react";
import type { MoodTag, Palette } from "@/lib/types";
import { paletteGrade, meetsGrade } from "@/lib/grade";
import type { WcagResult } from "@/lib/contrast";
import type { TargetLevel } from "@/lib/generate";
import { t } from "@/lib/strings";

const SWATCH_ROLES = [
  "background",
  "surface",
  "primary",
  "accent",
  "text",
] as const;

const ALL_MOODS: MoodTag[] = [
  "沉穩專業",
  "活力新創",
  "自然有機",
  "科技未來",
  "優雅奢華",
  "柔和粉嫩",
  "溫暖親切",
  "極簡黑白",
];

const GRADE_STYLE: Record<WcagResult, string> = {
  AAA: "bg-emerald-100 text-emerald-700",
  AA: "bg-amber-100 text-amber-700",
  Fail: "bg-stone-200 text-stone-500",
};

export default function PaletteGallery({
  palettes,
  selectedId,
  onSelect,
  onGenerate,
}: {
  palettes: Palette[];
  selectedId: string;
  onSelect: (p: Palette) => void;
  onGenerate: (level: TargetLevel) => void;
}) {
  const [mood, setMood] = useState<MoodTag | null>(null);
  const [wcag, setWcag] = useState<"AA" | "AAA" | null>(null);

  const list = useMemo(
    () =>
      palettes.filter(
        (p) =>
          (mood === null || p.moods.includes(mood)) &&
          (wcag === null || meetsGrade(p, wcag)),
      ),
    [palettes, mood, wcag],
  );

  return (
    <div className="flex h-full flex-col bg-white">
      {/* 篩選 + 產生(固定不滾) */}
      <div className="shrink-0 space-y-3 border-b border-stone-200 p-3">
        <button
          onClick={() => onGenerate(wcag ?? "AA")}
          title={t.generateHint}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-stone-900 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          {t.generate}
        </button>

        <Filter label={t.wcagLabel}>
          <Seg active={wcag === null} onClick={() => setWcag(null)}>
            {t.wcagAll}
          </Seg>
          <Seg active={wcag === "AA"} onClick={() => setWcag("AA")}>
            {t.wcagAA}
          </Seg>
          <Seg active={wcag === "AAA"} onClick={() => setWcag("AAA")}>
            {t.wcagAAA}
          </Seg>
        </Filter>

        <Filter label={`${t.filterLabel} · ${t.paletteCount(list.length)}`}>
          <Chip active={mood === null} onClick={() => setMood(null)}>
            {t.filterAll}
          </Chip>
          {ALL_MOODS.map((m) => (
            <Chip
              key={m}
              active={mood === m}
              onClick={() => setMood(mood === m ? null : m)}
            >
              {m}
            </Chip>
          ))}
        </Filter>
      </div>

      {/* 配色清單(唯一的滾動區) */}
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {list.length === 0 && (
          <p className="px-1 py-8 text-center text-sm text-stone-400">
            {t.empty}
          </p>
        )}
        {list.map((p) => {
          const grade = paletteGrade(p);
          const selected = selectedId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className={`block w-full rounded-xl border p-3 text-left transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 ${
                selected
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
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 truncate text-sm font-semibold text-stone-800">
                  {selected && <Check className="h-3.5 w-3.5 shrink-0" />}
                  {p.name}
                </span>
                <span className="flex shrink-0 items-center gap-1">
                  {p.generated && (
                    <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-medium text-violet-700">
                      {t.generatedTag}
                    </span>
                  )}
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${GRADE_STYLE[grade]}`}
                  >
                    {grade === "Fail" ? "不足" : grade}
                  </span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Filter({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-stone-400">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
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
      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
        active
          ? "bg-stone-900 text-white"
          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
      }`}
    >
      {children}
    </button>
  );
}

function Seg({
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
      className={`rounded-md px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
        active
          ? "bg-stone-900 text-white"
          : "bg-stone-100 text-stone-500 hover:bg-stone-200"
      }`}
    >
      {children}
    </button>
  );
}
