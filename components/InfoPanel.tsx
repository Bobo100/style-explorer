"use client";

import { useState } from "react";
import { Download, Wand2, Pencil, Share2, Check, Heart, Sliders } from "lucide-react";
import type { Palette, Role } from "@/lib/types";
import { ROLES } from "@/lib/types";
import { contrastRatio, wcagLevel, type WcagResult } from "@/lib/contrast";
import { meetsGrade } from "@/lib/grade";
import { useT } from "@/lib/i18n";
import ExportModal from "./ExportModal";

const LEVEL_STYLE: Record<WcagResult, string> = {
  AAA: "bg-emerald-100 text-emerald-700",
  AA: "bg-amber-100 text-amber-700",
  Fail: "bg-red-100 text-red-700",
};

function ContrastRow({
  label,
  fg,
  bg,
  large,
  failLabel,
}: {
  label: string;
  fg: string;
  bg: string;
  large: boolean;
  failLabel: string;
}) {
  const ratio = contrastRatio(fg, bg);
  const level = wcagLevel(ratio, large);
  return (
    <div className="flex items-center justify-between gap-2 py-1.5">
      <div className="flex items-center gap-2">
        <span
          className="flex h-6 w-6 items-center justify-center rounded text-[11px] font-bold"
          style={{ backgroundColor: bg, color: fg }}
        >
          Aa
        </span>
        <span className="text-sm text-stone-600">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs tabular-nums text-stone-400">
          {ratio.toFixed(1)}
        </span>
        <span
          className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${LEVEL_STYLE[level]}`}
        >
          {level === "Fail" ? failLabel : level}
        </span>
      </div>
    </div>
  );
}

export default function InfoPanel({
  palette,
  onEdit,
  onAutoFix,
  onTweak,
  tweakKey,
  isFav,
  onToggleFav,
}: {
  palette: Palette;
  onEdit: (role: Role, hex: string) => void;
  onAutoFix: (level: "AA" | "AAA") => void;
  onTweak: (lightness: number, saturation: number) => void;
  tweakKey: string;
  isFav: boolean;
  onToggleFav: () => void;
}) {
  const t = useT();
  const [exportOpen, setExportOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [tweakOpen, setTweakOpen] = useState(false);
  const [shared, setShared] = useState(false);
  const [large, setLarge] = useState(false);
  const [lAdj, setLAdj] = useState(0);
  const [sAdj, setSAdj] = useState(1);

  // 換配色(select / 產生 / 取色 / 一鍵修)時把滑桿歸零。
  // React 官方「prop 變了就在 render 期重置 state」模式,免 effect。
  const [prevKey, setPrevKey] = useState(tweakKey);
  if (prevKey !== tweakKey) {
    setPrevKey(tweakKey);
    setLAdj(0);
    setSAdj(1);
  }

  const usageEntries = Object.entries(palette.roleUsage) as [Role, string][];

  const isAA = meetsGrade(palette, "AA");
  const isAAA = meetsGrade(palette, "AAA");

  const applyTweak = (l: number, s: number) => {
    setLAdj(l);
    setSAdj(s);
    onTweak(l, s);
  };

  const resetTweak = () => applyTweak(0, 1);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 1500);
    } catch {
      // 剪貼簿不可用時靜默
    }
  };

  return (
    <div className="flex h-full flex-col overflow-auto bg-white">
      <div className="space-y-6 p-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-stone-900">{palette.name}</h2>
            {palette.custom && (
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-medium text-violet-700">
                {t.info.customTag}
              </span>
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {palette.moods.map((m) => (
              <span
                key={m}
                className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500"
              >
                {t.moodNames[m] ?? m}
              </span>
            ))}
          </div>
        </div>

        <Section title={t.info.scene}>
          <p className="text-sm leading-relaxed text-stone-600">
            {palette.blurb}
          </p>
        </Section>

        <Section title={t.info.why}>
          <p className="text-sm leading-relaxed text-stone-600">{palette.why}</p>
        </Section>

        <Section title={t.info.contrast}>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <p className="text-xs text-stone-400">{t.info.contrastHint}</p>
            <div className="flex shrink-0 items-center gap-1">
              <SizeToggle active={!large} onClick={() => setLarge(false)}>
                {t.info.textNormal}
              </SizeToggle>
              <SizeToggle active={large} onClick={() => setLarge(true)}>
                {t.info.textLarge}
              </SizeToggle>
            </div>
          </div>
          {large && (
            <p className="mb-1 text-[11px] text-stone-400">
              {t.info.textSizeHint}
            </p>
          )}
          <ContrastRow
            label={t.contrast.textOnBg}
            fg={palette.roles.text}
            bg={palette.roles.background}
            large={large}
            failLabel={t.fail}
          />
          <ContrastRow
            label={t.contrast.textOnSurface}
            fg={palette.roles.text}
            bg={palette.roles.surface}
            large={large}
            failLabel={t.fail}
          />
          <ContrastRow
            label={t.contrast.primary}
            fg={palette.roles.primaryFg}
            bg={palette.roles.primary}
            large={large}
            failLabel={t.fail}
          />
          <ContrastRow
            label={t.contrast.accent}
            fg={palette.roles.accentFg}
            bg={palette.roles.accent}
            large={large}
            failLabel={t.fail}
          />

          {!isAAA && (
            <div className="mt-2.5">
              <div className="flex gap-2">
                {!isAA && (
                  <FixButton onClick={() => onAutoFix("AA")}>
                    {t.info.fixAA}
                  </FixButton>
                )}
                <FixButton onClick={() => onAutoFix("AAA")}>
                  {t.info.fixAAA}
                </FixButton>
              </div>
              <p className="mt-1.5 text-xs text-stone-400">{t.info.fixHint}</p>
            </div>
          )}
        </Section>

        <Section title={t.info.roles}>
          <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            <button
              onClick={() => setEditOpen((v) => !v)}
              aria-expanded={editOpen}
              className="flex items-center gap-1.5 text-sm font-medium text-stone-700 transition-colors hover:text-stone-900 cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" />
              {t.info.edit}
            </button>
            <button
              onClick={() => setTweakOpen((v) => !v)}
              aria-expanded={tweakOpen}
              className="flex items-center gap-1.5 text-sm font-medium text-stone-700 transition-colors hover:text-stone-900 cursor-pointer"
            >
              <Sliders className="h-3.5 w-3.5" />
              {t.info.tweak}
            </button>
          </div>

          {editOpen && (
            <div className="mb-3 grid grid-cols-2 gap-2 rounded-lg bg-stone-50 p-3">
              {ROLES.map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-2 text-xs text-stone-600"
                >
                  <input
                    type="color"
                    value={palette.roles[role]}
                    onChange={(e) => onEdit(role, e.target.value)}
                    aria-label={t.roleNames[role] ?? role}
                    className="h-7 w-7 shrink-0 cursor-pointer rounded border border-stone-200 bg-white"
                  />
                  <span className="truncate">{t.roleNames[role] ?? role}</span>
                </label>
              ))}
            </div>
          )}

          {tweakOpen && (
            <div className="mb-3 space-y-3 rounded-lg bg-stone-50 p-3">
              <p className="text-[11px] text-stone-400">{t.info.tweakHint}</p>
              <SliderRow
                label={t.info.tweakLightness}
                min={-0.2}
                max={0.2}
                step={0.01}
                value={lAdj}
                onChange={(v) => applyTweak(v, sAdj)}
              />
              <SliderRow
                label={t.info.tweakSaturation}
                min={0.5}
                max={1.5}
                step={0.05}
                value={sAdj}
                onChange={(v) => applyTweak(lAdj, v)}
              />
              <button
                onClick={resetTweak}
                className="text-xs font-medium text-stone-500 underline-offset-2 hover:underline cursor-pointer"
              >
                {t.info.tweakReset}
              </button>
            </div>
          )}

          {usageEntries.length > 0 && (
            <div className="space-y-2.5">
              {usageEntries.map(([role, desc]) => (
                <div key={role} className="flex gap-2.5">
                  <span
                    className="mt-0.5 h-5 w-5 shrink-0 rounded border border-stone-200"
                    style={{ backgroundColor: palette.roles[role] }}
                  />
                  <div className="text-sm">
                    <span className="font-medium text-stone-700">
                      {t.roleNames[role] ?? role}
                    </span>
                    <span className="text-stone-500"> — {desc}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      <div className="sticky bottom-0 mt-auto space-y-2 border-t border-stone-200 bg-white p-4">
        <div className="flex gap-2">
          <button
            onClick={onToggleFav}
            aria-pressed={isFav}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium transition-colors cursor-pointer ${
              isFav
                ? "border-rose-200 bg-rose-50 text-rose-600"
                : "border-stone-300 text-stone-700 hover:bg-stone-50"
            }`}
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
            {isFav ? t.faved : t.fav}
          </button>
          <button
            onClick={share}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-stone-300 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 cursor-pointer"
          >
            {shared ? (
              <Check className="h-4 w-4" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
            {shared ? t.info.shared : t.info.share}
          </button>
        </div>
        <button
          onClick={() => setExportOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-stone-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 cursor-pointer"
        >
          <Download className="h-4 w-4" />
          {t.info.export}
        </button>
      </div>

      <ExportModal
        key={String(exportOpen)}
        palette={palette}
        open={exportOpen}
        onClose={() => setExportOpen(false)}
      />
    </div>
  );
}

function SizeToggle({
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
      aria-pressed={active}
      className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
        active
          ? "bg-stone-900 text-white"
          : "bg-stone-100 text-stone-500 hover:bg-stone-200"
      }`}
    >
      {children}
    </button>
  );
}

function SliderRow({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-stone-500">
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={label}
        className="w-full cursor-pointer accent-stone-900"
      />
    </label>
  );
}

function FixButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 cursor-pointer"
    >
      <Wand2 className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
        {title}
      </h3>
      {children}
    </div>
  );
}
