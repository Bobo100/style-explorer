"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { ROLES, type Palette, type TemplateKey } from "@/lib/types";
import { paletteStyleVars } from "@/lib/css-vars";
import { simulate, CB_LABELS, type CbType } from "@/lib/colorblind";
import { t } from "@/lib/strings";
import LandingTemplate from "./templates/LandingTemplate";
import BlogTemplate from "./templates/BlogTemplate";
import DashboardTemplate from "./templates/DashboardTemplate";
import EcommerceTemplate from "./templates/EcommerceTemplate";
import FormTemplate from "./templates/FormTemplate";

const TABS: { key: TemplateKey; label: string }[] = [
  { key: "landing", label: t.preview.landing },
  { key: "blog", label: t.preview.blog },
  { key: "dashboard", label: t.preview.dashboard },
  { key: "ecommerce", label: t.preview.ecommerce },
  { key: "form", label: t.preview.form },
];

const CB_OPTIONS: { key: CbType | "none"; label: string }[] = [
  { key: "none", label: t.preview.cbNormal },
  { key: "protanopia", label: CB_LABELS.protanopia },
  { key: "deuteranopia", label: CB_LABELS.deuteranopia },
  { key: "tritanopia", label: CB_LABELS.tritanopia },
];

function simulatedVars(palette: Palette, cb: CbType) {
  const roles = { ...palette.roles };
  for (const role of ROLES) roles[role] = simulate(roles[role], cb);
  return paletteStyleVars({ ...palette, roles });
}

export default function PreviewPane({
  palette,
  template,
  onTemplateChange,
}: {
  palette: Palette;
  template: TemplateKey;
  onTemplateChange: (t: TemplateKey) => void;
}) {
  const [cb, setCb] = useState<CbType | "none">("none");

  const vars =
    cb === "none" ? paletteStyleVars(palette) : simulatedVars(palette, cb);

  return (
    <div className="flex h-full flex-col">
      {/* 工具列:版型切換 + 色覺模擬 */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-stone-200 bg-white px-3 py-2">
        <div className="flex items-center gap-1">
          <span className="mr-1 text-xs font-medium text-stone-400">
            {t.preview.label}
          </span>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTemplateChange(tab.key)}
              aria-pressed={template === tab.key}
              className={`rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                template === tab.key
                  ? "bg-stone-900 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Eye className="mr-0.5 h-3.5 w-3.5 text-stone-400" />
          <span className="mr-1 text-xs font-medium text-stone-400">
            {t.preview.colorblind}
          </span>
          {CB_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setCb(opt.key)}
              aria-pressed={cb === opt.key}
              className={`rounded-md px-2 py-1 text-xs font-medium transition-colors cursor-pointer ${
                cb === opt.key
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* preview scope */}
      <div className="min-h-0 flex-1 overflow-auto bg-stone-100 p-4">
        <div
          style={vars}
          className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-stone-200 shadow-sm"
        >
          {template === "landing" && <LandingTemplate />}
          {template === "blog" && <BlogTemplate />}
          {template === "dashboard" && <DashboardTemplate />}
          {template === "ecommerce" && <EcommerceTemplate />}
          {template === "form" && <FormTemplate />}
        </div>
      </div>
    </div>
  );
}
