"use client";

import { useState } from "react";
import { PALETTES } from "@/lib/palettes";
import type { Palette } from "@/lib/types";
import PaletteGallery from "@/components/PaletteGallery";
import PreviewPane from "@/components/PreviewPane";
import InfoPanel from "@/components/InfoPanel";
import ColorTheoryCards from "@/components/ColorTheoryCards";
import { t } from "@/lib/strings";

export default function Home() {
  const [palette, setPalette] = useState<Palette>(PALETTES[0]);

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white px-5 py-4 sm:px-8">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-xl font-bold">{t.appName}</h1>
          <p className="text-sm text-stone-500">{t.tagline}</p>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-stone-400">{t.intro}</p>
      </header>

      <main className="flex flex-1 flex-col lg:h-[calc(100vh-150px)] lg:flex-row lg:overflow-hidden">
        <div className="max-h-[44vh] border-b border-stone-200 lg:max-h-full lg:w-80 lg:shrink-0 lg:border-b-0 lg:border-r">
          <PaletteGallery
            selectedId={palette.id}
            onSelect={setPalette}
          />
        </div>

        <div className="min-h-[60vh] flex-1 lg:h-full lg:min-h-0">
          <PreviewPane palette={palette} />
        </div>

        <div className="border-t border-stone-200 lg:h-full lg:w-85 lg:shrink-0 lg:border-l lg:border-t-0">
          <InfoPanel palette={palette} />
        </div>
      </main>

      <ColorTheoryCards />

      <footer className="border-t border-stone-200 bg-white px-5 py-5 text-center text-sm text-stone-400 sm:px-8">
        {t.appName} — 配色 + 真實預覽 + 白話說明,給每個想把網站弄好看的人。
      </footer>
    </div>
  );
}
