"use client";

import { useState } from "react";
import { Download, Wand2, Pencil, Share2, Check, Heart } from "lucide-react";
import type { Palette, Role } from "@/lib/types";
import { ROLES } from "@/lib/types";
import { contrastRatio, wcagLevel, type WcagResult } from "@/lib/contrast";
import { meetsGrade } from "@/lib/grade";
import { t } from "@/lib/strings";
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
}: {
  label: string;
  fg: string;
  bg: string;
}) {
  const ratio = contrastRatio(fg, bg);
  const level = wcagLevel(ratio);
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
          {level === "Fail" ? "不足" : level}
        </span>
      </div>
    </div>
  );
}

export default function InfoPanel({
  palette,
  onEdit,
  onAutoFix,
  isFav,
  onToggleFav,
}: {
  palette: Palette;
  onEdit: (role: Role, hex: string) => void;
  onAutoFix: (level: "AA" | "AAA") => void;
  isFav: boolean;
  onToggleFav: () => void;
}) {
  const [exportOpen, setExportOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [shared, setShared] = useState(false);
  const usageEntries = Object.entries(palette.roleUsage) as [Role, string][];

  const isAA = meetsGrade(palette, "AA");
  const isAAA = meetsGrade(palette, "AAA");

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
                {m}
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
          <p className="mb-1 text-xs text-stone-400">{t.info.contrastHint}</p>
          <ContrastRow
            label={t.contrast.textOnBg}
            fg={palette.roles.text}
            bg={palette.roles.background}
          />
          <ContrastRow
            label={t.contrast.textOnSurface}
            fg={palette.roles.text}
            bg={palette.roles.surface}
          />
          <ContrastRow
            label={t.contrast.primary}
            fg={palette.roles.primaryFg}
            bg={palette.roles.primary}
          />
          <ContrastRow
            label={t.contrast.accent}
            fg={palette.roles.accentFg}
            bg={palette.roles.accent}
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
          <button
            onClick={() => setEditOpen((v) => !v)}
            aria-expanded={editOpen}
            className="mb-2 flex items-center gap-1.5 text-sm font-medium text-stone-700 transition-colors hover:text-stone-900 cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5" />
            {t.info.edit}
          </button>

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
        palette={palette}
        open={exportOpen}
        onClose={() => setExportOpen(false)}
      />
    </div>
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
