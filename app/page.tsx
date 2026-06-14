"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PALETTES } from "@/lib/palettes";
import { generateBatch, type TargetLevel } from "@/lib/generate";
import { setRole, autoFix } from "@/lib/adjust";
import { encodeState, decodeState } from "@/lib/share";
import type { Palette, Role, TemplateKey } from "@/lib/types";
import PaletteGallery from "@/components/PaletteGallery";
import PreviewPane from "@/components/PreviewPane";
import InfoPanel from "@/components/InfoPanel";
import ColorTheoryCards from "@/components/ColorTheoryCards";
import { t } from "@/lib/strings";

export default function Home() {
  const [generated, setGenerated] = useState<Palette[]>([]);
  const [seed, setSeed] = useState(0);
  const [palette, setPalette] = useState<Palette>(PALETTES[0]);
  const [template, setTemplate] = useState<TemplateKey>("landing");
  const ready = useRef(false);

  // 還原分享連結(只在掛載時跑一次)
  useEffect(() => {
    const { palette: p, template: tk } = decodeState(window.location.search);
    if (p) setPalette(p);
    if (tk) setTemplate(tk);
    ready.current = true;
  }, []);

  // 把目前狀態同步到 URL(分享按鈕複製的就是它)
  useEffect(() => {
    if (!ready.current) return;
    window.history.replaceState(null, "", "?" + encodeState(palette, template));
  }, [palette, template]);

  // 動態產生的放最上面,新的一眼看得到
  const all = useMemo(() => [...generated, ...PALETTES], [generated]);

  const handleGenerate = (level: TargetLevel) => {
    const batch = generateBatch(6, level, seed);
    setGenerated((prev) => {
      const seen = new Set(prev.map((p) => p.id));
      return [...batch.filter((p) => !seen.has(p.id)), ...prev];
    });
    setSeed((s) => s + 6);
    setPalette(batch[0]);
  };

  const editRole = (role: Role, hex: string) =>
    setPalette((p) => setRole(p, role, hex));
  const fix = (level: "AA" | "AAA") => setPalette((p) => autoFix(p, level));

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white px-5 py-4 sm:px-8">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-xl font-bold">{t.appName}</h1>
          <p className="text-sm text-stone-500">{t.tagline}</p>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-stone-400">{t.intro}</p>
      </header>

      <main className="flex flex-1 flex-col lg:h-[calc(100dvh-85px)] lg:flex-none lg:flex-row lg:overflow-hidden">
        <div className="h-[46vh] shrink-0 border-b border-stone-200 lg:h-full lg:min-h-0 lg:w-80 lg:border-b-0 lg:border-r">
          <PaletteGallery
            palettes={all}
            selectedId={palette.id}
            onSelect={setPalette}
            onGenerate={handleGenerate}
          />
        </div>

        <div className="min-h-[60vh] flex-1 lg:h-full lg:min-h-0">
          <PreviewPane
            palette={palette}
            template={template}
            onTemplateChange={setTemplate}
          />
        </div>

        <div className="border-t border-stone-200 lg:h-full lg:w-85 lg:shrink-0 lg:border-l lg:border-t-0">
          <InfoPanel palette={palette} onEdit={editRole} onAutoFix={fix} />
        </div>
      </main>

      <ColorTheoryCards />

      <footer className="border-t border-stone-200 bg-white px-5 py-5 text-center text-sm text-stone-400 sm:px-8">
        {t.appName} — 配色 + 真實預覽 + 白話說明,給每個想把網站弄好看的人。
      </footer>
    </div>
  );
}
