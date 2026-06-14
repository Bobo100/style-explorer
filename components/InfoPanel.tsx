"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import type { Palette, Role } from "@/lib/types";
import { contrastRatio, wcagLevel, type WcagResult } from "@/lib/contrast";
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

export default function InfoPanel({ palette }: { palette: Palette }) {
  const [exportOpen, setExportOpen] = useState(false);
  const usageEntries = Object.entries(palette.roleUsage) as [Role, string][];

  return (
    <div className="flex h-full flex-col overflow-auto bg-white">
      <div className="space-y-6 p-5">
        <div>
          <h2 className="text-lg font-bold text-stone-900">{palette.name}</h2>
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
        </Section>

        {usageEntries.length > 0 && (
          <Section title={t.info.roles}>
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
          </Section>
        )}
      </div>

      <div className="sticky bottom-0 mt-auto border-t border-stone-200 bg-white p-4">
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
