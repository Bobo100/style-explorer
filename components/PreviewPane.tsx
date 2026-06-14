"use client";

import { useState } from "react";
import type { Palette } from "@/lib/types";
import { paletteStyleVars } from "@/lib/css-vars";
import { t } from "@/lib/strings";
import LandingTemplate from "./templates/LandingTemplate";
import BlogTemplate from "./templates/BlogTemplate";
import DashboardTemplate from "./templates/DashboardTemplate";

type TemplateKey = "landing" | "blog" | "dashboard";

const TABS: { key: TemplateKey; label: string }[] = [
  { key: "landing", label: t.preview.landing },
  { key: "blog", label: t.preview.blog },
  { key: "dashboard", label: t.preview.dashboard },
];

export default function PreviewPane({ palette }: { palette: Palette }) {
  const [tab, setTab] = useState<TemplateKey>("landing");

  return (
    <div className="flex h-full flex-col">
      {/* 版型切換(chrome,固定中性色) */}
      <div className="flex items-center gap-1 border-b border-stone-200 bg-white px-3 py-2">
        <span className="mr-2 text-xs font-medium text-stone-400">
          {t.preview.label}
        </span>
        {TABS.map((tabItem) => (
          <button
            key={tabItem.key}
            onClick={() => setTab(tabItem.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === tabItem.key
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      {/* preview scope —— 在這裡注入選中配色的 CSS 變數 */}
      <div className="flex-1 overflow-auto bg-stone-100 p-4">
        <div
          style={paletteStyleVars(palette)}
          className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-stone-200 shadow-sm"
        >
          {tab === "landing" && <LandingTemplate />}
          {tab === "blog" && <BlogTemplate />}
          {tab === "dashboard" && <DashboardTemplate />}
        </div>
      </div>
    </div>
  );
}
