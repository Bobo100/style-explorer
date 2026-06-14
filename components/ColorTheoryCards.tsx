import { t } from "@/lib/strings";

// 輕量、example-driven 的色彩學教學。不背術語,看色塊就懂。
const CARDS = [
  {
    title: "對比 Contrast",
    body: "深色配淺色,差距越大越好讀。文字跟背景對比不夠,再美的配色都沒用。",
    colors: ["#0a0a0a", "#ffffff"],
    label: "深 ↔ 淺",
  },
  {
    title: "互補 Complementary",
    body: "色輪上相對的兩色(藍↔橘、紅↔綠)放一起最跳。適合一主一輔,別五五分。",
    colors: ["#2563eb", "#ea580c"],
    label: "對撞最搶眼",
  },
  {
    title: "類似 Analogous",
    body: "色輪上相鄰的顏色(紫→粉、藍→青)天生和諧,整體調性統一、耐看不吵。",
    colors: ["#7c3aed", "#db2777", "#ec4899"],
    label: "相鄰最和諧",
  },
  {
    title: "中性色 Neutral",
    body: "灰、米、白本身沒情緒,當背景與骨架,讓那一兩個彩色真正被看見。",
    colors: ["#f5f5f4", "#e7e5e4", "#78716c"],
    label: "讓主色發光",
  },
];

export default function ColorTheoryCards() {
  return (
    <section className="border-t border-stone-200 bg-white px-5 py-8 sm:px-8">
      <h2 className="text-lg font-bold text-stone-900">{t.theory.title}</h2>
      <p className="mt-1 text-sm text-stone-500">{t.theory.subtitle}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c) => (
          <div
            key={c.title}
            className="rounded-xl border border-stone-200 p-4"
          >
            <div className="mb-3 flex overflow-hidden rounded-lg">
              {c.colors.map((col) => (
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
