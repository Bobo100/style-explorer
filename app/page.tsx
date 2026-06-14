"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Languages } from "lucide-react";
import { PALETTES } from "@/lib/palettes";
import { generateBatch, type TargetLevel } from "@/lib/generate";
import { setRole, autoFix } from "@/lib/adjust";
import { tweakPalette } from "@/lib/tweak";
import { encodeState, decodeState } from "@/lib/share";
import {
  loadFavorites,
  saveFavorites,
  toggleFavorite,
  isFavorite,
} from "@/lib/favorites";
import type { Palette, Role, TemplateKey } from "@/lib/types";
import { LangProvider, useT, useLang } from "@/lib/i18n";
import PaletteGallery from "@/components/PaletteGallery";
import PreviewPane from "@/components/PreviewPane";
import InfoPanel from "@/components/InfoPanel";
import ColorTheoryCards from "@/components/ColorTheoryCards";

export default function Home() {
  return (
    <LangProvider>
      <App />
    </LangProvider>
  );
}

function App() {
  const t = useT();
  const [generated, setGenerated] = useState<Palette[]>([]);
  const [seed, setSeed] = useState(0);
  const [palette, setPalette] = useState<Palette>(PALETTES[0]);
  const [base, setBase] = useState<Palette>(PALETTES[0]); // 整組微調的未調基準
  const [baseVer, setBaseVer] = useState(0); // 變動 → InfoPanel 滑桿歸零
  const [template, setTemplate] = useState<TemplateKey>("landing");
  const [favorites, setFavorites] = useState<Palette[]>([]);
  const ready = useRef(false);

  // 換到一組全新的基準配色(select / 取色 / 產生),並重置微調滑桿
  const rebase = (p: Palette) => {
    setPalette(p);
    setBase(p);
    setBaseVer((v) => v + 1);
  };

  // 掛載時:還原分享連結 + 載入收藏(只跑一次)。讀 URL / localStorage 等外部來源,
  // 必須掛載後才跑(SSR 安全、避免 hydration mismatch),非衍生 state。
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const { palette: p, template: tk } = decodeState(window.location.search);
    if (p) {
      setPalette(p);
      setBase(p);
    }
    if (tk) setTemplate(tk);
    setFavorites(loadFavorites());
    ready.current = true;
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // 把目前狀態同步到 URL(分享按鈕複製的就是它)
  useEffect(() => {
    if (!ready.current) return;
    window.history.replaceState(null, "", "?" + encodeState(palette, template));
  }, [palette, template]);

  // 收藏變動時存回 localStorage
  useEffect(() => {
    if (!ready.current) return;
    saveFavorites(favorites);
  }, [favorites]);

  // 動態產生的放最上面,新的一眼看得到
  const all = useMemo(() => [...generated, ...PALETTES], [generated]);

  const handleGenerate = (level: TargetLevel) => {
    const batch = generateBatch(6, level, seed);
    setGenerated((prev) => {
      const seen = new Set(prev.map((p) => p.id));
      return [...batch.filter((p) => !seen.has(p.id)), ...prev];
    });
    setSeed((s) => s + 6);
    rebase(batch[0]);
  };

  const editRole = (role: Role, hex: string) => {
    const np = setRole(palette, role, hex);
    rebase(np); // 編輯後以新色為基準,微調建立在改過的色上
  };
  const fix = (level: "AA" | "AAA") => rebase(autoFix(palette, level));
  const tweak = (lightness: number, saturation: number) =>
    setPalette(tweakPalette(base, { lightness, saturation }));
  const toggleFav = () => setFavorites((prev) => toggleFavorite(prev, palette));

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white px-5 py-4 sm:px-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="text-xl font-bold">{t.appName}</h1>
              <p className="text-sm text-stone-500">{t.tagline}</p>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-stone-400">{t.intro}</p>
          </div>
          <LangToggle />
        </div>
      </header>

      <main className="flex flex-1 flex-col lg:h-[calc(100dvh-85px)] lg:flex-none lg:flex-row lg:overflow-hidden">
        <div className="h-[46vh] shrink-0 border-b border-stone-200 lg:h-full lg:min-h-0 lg:w-80 lg:border-b-0 lg:border-r">
          <PaletteGallery
            palettes={all}
            favorites={favorites}
            selectedId={palette.id}
            onSelect={rebase}
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
          <InfoPanel
            palette={palette}
            onEdit={editRole}
            onAutoFix={fix}
            onTweak={tweak}
            tweakKey={String(baseVer)}
            isFav={isFavorite(favorites, palette)}
            onToggleFav={toggleFav}
          />
        </div>
      </main>

      <ColorTheoryCards />

      <footer className="border-t border-stone-200 bg-white px-5 py-5 text-center text-sm text-stone-400 sm:px-8">
        {t.appName} — {t.footer}
      </footer>
    </div>
  );
}

function LangToggle() {
  const [lang, setLang] = useLang();
  const t = useT();
  return (
    <button
      onClick={() => setLang(lang === "zh" ? "en" : "zh")}
      aria-label="language"
      className="flex shrink-0 items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 cursor-pointer"
    >
      <Languages className="h-4 w-4" />
      {t.langToggle}
    </button>
  );
}
