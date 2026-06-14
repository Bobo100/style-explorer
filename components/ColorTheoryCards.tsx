"use client";

import { useT } from "@/lib/i18n";

// 輕量、example-driven 的色彩學教學。文案走 i18n,色塊(非語言相關)依索引對齊。
const CARD_COLORS: string[][] = [
  ["#0a0a0a", "#ffffff"],
  ["#2563eb", "#ea580c"],
  ["#7c3aed", "#db2777", "#ec4899"],
  ["#f5f5f4", "#e7e5e4", "#78716c"],
];

export default function ColorTheoryCards() {
  const t = useT();
  return (
    <section className="border-t border-stone-200 bg-white px-5 py-8 sm:px-8">
      <h2 className="text-lg font-bold text-stone-900">{t.theory.title}</h2>
      <p className="mt-1 text-sm text-stone-500">{t.theory.subtitle}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.theory.cards.map((c, i) => (
          <div key={c.title} className="rounded-xl border border-stone-200 p-4">
            <div className="mb-3 flex overflow-hidden rounded-lg">
              {CARD_COLORS[i].map((col) => (
                <span
                  key={col}
                  className="h-12 flex-1"
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
            <div className="mb-1 flex items-center justify-between">
              <h3 className="font-semibold text-stone-800">{c.title}</h3>
              <span className="text-[11px] text-stone-400">{c.label}</span>
            </div>
            <p className="text-sm leading-relaxed text-stone-600">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
