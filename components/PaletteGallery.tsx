"use client";

import { useMemo, useRef, useState } from "react";
import { Sparkles, Check, Heart, Image as ImageIcon } from "lucide-react";
import type { MoodTag, Palette } from "@/lib/types";
import { paletteGrade, meetsGrade } from "@/lib/grade";
import { isFavorite, paletteSig } from "@/lib/favorites";
import { extractColors, paletteFromImage } from "@/lib/extract";
import type { WcagResult } from "@/lib/contrast";
import type { TargetLevel } from "@/lib/generate";
import { useT } from "@/lib/i18n";

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
  favorites,
  selectedId,
  onSelect,
  onGenerate,
}: {
  palettes: Palette[];
  favorites: Palette[];
  selectedId: string;
  onSelect: (p: Palette) => void;
  onGenerate: (level: TargetLevel) => void;
}) {
  const t = useT();
  const [mood, setMood] = useState<MoodTag | null>(null);
  const [wcag, setWcag] = useState<"AA" | "AAA" | null>(null);
  const [favsOnly, setFavsOnly] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // 允許重選同一張
    if (!file) return;
    setImgErr(false);
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      try {
        const max = 100; // 縮圖後取色,夠準又快
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no canvas ctx");
        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);
        const colors = extractColors({ data, width: w, height: h }, 6);
        if (!colors.length) throw new Error("no colours");
        onSelect(paletteFromImage(colors));
      } catch {
        setImgErr(true);
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      setImgErr(true);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const list = useMemo(
    () =>
      (favsOnly ? favorites : palettes).filter(
        (p) =>
          (mood === null || p.moods.includes(mood)) &&
          (wcag === null || meetsGrade(p, wcag)),
      ),
    [palettes, favorites, favsOnly, mood, wcag],
  );

  return (
    <div className="flex h-full flex-col bg-white">
      {/* 篩選 + 產生(固定不滾) */}
      <div className="shrink-0 space-y-3 border-b border-stone-200 p-3">
        <div className="flex gap-2">
          <button
            onClick={() => onGenerate(wcag ?? "AA")}
            title={t.generateHint}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-stone-900 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            {t.generate}
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            title={t.fromImageHint}
            aria-label={t.fromImage}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 cursor-pointer"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFile}
            className="hidden"
          />
        </div>
        {imgErr && <p className="text-xs text-red-600">{t.imageError}</p>}

        <button
          onClick={() => setFavsOnly((v) => !v)}
          aria-pressed={favsOnly}
          className={`flex w-full items-center justify-center gap-2 rounded-lg border py-1.5 text-sm font-medium transition-colors cursor-pointer ${
            favsOnly
              ? "border-rose-200 bg-rose-50 text-rose-600"
              : "border-stone-200 text-stone-600 hover:bg-stone-50"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${favsOnly ? "fill-current" : ""}`} />
          {t.favsOnly} {favorites.length > 0 && `(${favorites.length})`}
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
              {t.moodNames[m] ?? m}
            </Chip>
          ))}
        </Filter>
      </div>

      {/* 配色清單(唯一的滾動區) */}
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {list.length === 0 && (
          <p className="px-1 py-8 text-center text-sm text-stone-400">
            {favsOnly && favorites.length === 0 ? t.favsEmpty : t.empty}
          </p>
        )}
        {list.map((p) => {
          const grade = paletteGrade(p);
          const selected = selectedId === p.id;
          const faved = isFavorite(favorites, p);
          return (
            <button
              key={paletteSig(p)}
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
                  {faved && (
                    <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
                  )}
                  {p.generated && (
                    <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-medium text-violet-700">
                      {t.generatedTag}
                    </span>
                  )}
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${GRADE_STYLE[grade]}`}
                  >
                    {grade === "Fail" ? t.fail : grade}
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
