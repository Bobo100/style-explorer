"use client";

import { useEffect, useState } from "react";
import { X, Copy, Check } from "lucide-react";
import type { Palette } from "@/lib/types";
import { exportCss } from "@/lib/export-css";
import { exportTailwind } from "@/lib/export-tailwind";
import { exportScss } from "@/lib/export-scss";
import { exportJson } from "@/lib/export-json";
import { exportShadcn } from "@/lib/export-shadcn";
import { useT } from "@/lib/i18n";

type Format = "css" | "tailwind" | "scss" | "json" | "shadcn";

const RENDER: Record<Format, (p: Palette) => string> = {
  css: exportCss,
  tailwind: exportTailwind,
  scss: exportScss,
  json: exportJson,
  shadcn: exportShadcn,
};

export default function ExportModal({
  palette,
  open,
  onClose,
}: {
  palette: Palette;
  open: boolean;
  onClose: () => void;
}) {
  const t = useT();
  const [format, setFormat] = useState<Format>("css");
  const [copied, setCopied] = useState(false);

  const FORMATS: { key: Format; label: string }[] = [
    { key: "css", label: t.exportModal.css },
    { key: "tailwind", label: t.exportModal.tailwind },
    { key: "scss", label: t.exportModal.scss },
    { key: "json", label: t.exportModal.json },
    { key: "shadcn", label: t.exportModal.shadcn },
  ];

  const HINTS: Record<Format, string> = {
    css: t.exportModal.cssHint,
    tailwind: t.exportModal.twHint,
    scss: t.exportModal.scssHint,
    json: t.exportModal.jsonHint,
    shadcn: t.exportModal.shadcnHint,
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const code = RENDER[format](palette);
  const hint = HINTS[format];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 剪貼簿不可用時靜默(例如非 https)
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-3">
          <h3 className="font-bold text-stone-900">
            {t.exportModal.title} · {palette.name}
          </h3>
          <button
            onClick={onClose}
            aria-label={t.exportModal.close}
            className="text-stone-400 transition-colors hover:text-stone-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-1 px-5 pt-4">
          {FORMATS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFormat(f.key)}
              aria-pressed={format === f.key}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                format === f.key
                  ? "bg-stone-900 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="px-5 pb-2 pt-3">
          <p className="mb-2 text-xs text-stone-400">{hint}</p>
          <pre className="max-h-72 overflow-auto rounded-lg bg-stone-950 p-4 text-xs leading-relaxed text-stone-100">
            <code>{code}</code>
          </pre>
        </div>

        <div className="flex justify-end gap-2 px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 cursor-pointer"
          >
            {t.exportModal.close}
          </button>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700 cursor-pointer"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? t.exportModal.copied : t.exportModal.copy}
          </button>
        </div>
      </div>
    </div>
  );
}
