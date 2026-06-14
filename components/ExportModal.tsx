"use client";

import { useEffect, useState } from "react";
import type { Palette } from "@/lib/types";
import { exportCss } from "@/lib/export-css";
import { exportTailwind } from "@/lib/export-tailwind";
import { t } from "@/lib/strings";

type Format = "css" | "tailwind";

export default function ExportModal({
  palette,
  open,
  onClose,
}: {
  palette: Palette;
  open: boolean;
  onClose: () => void;
}) {
  const [format, setFormat] = useState<Format>("css");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setCopied(false);
      setFormat("css");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const code = format === "css" ? exportCss(palette) : exportTailwind(palette);
  const hint =
    format === "css" ? t.exportModal.cssHint : t.exportModal.twHint;

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
            className="text-sm text-stone-400 hover:text-stone-700"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-1 px-5 pt-4">
          {(["css", "tailwind"] as Format[]).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                format === f
                  ? "bg-stone-900 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {f === "css" ? t.exportModal.css : t.exportModal.tailwind}
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
            className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
          >
            {t.exportModal.close}
          </button>
          <button
            onClick={copy}
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
          >
            {copied ? t.exportModal.copied : t.exportModal.copy}
          </button>
        </div>
      </div>
    </div>
  );
}
