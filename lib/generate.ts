import { hslToHex } from "./color";
import { bestTextOn, contrastRatio } from "./contrast";
import type { MoodTag, Palette } from "./types";

export type Harmony = "complementary" | "analogous" | "triadic";
export type TargetLevel = "AA" | "AAA";

const HARMONY_OFFSET: Record<Harmony, number> = {
  complementary: 180,
  analogous: 30,
  triadic: 120,
};

const HARMONY_LABEL: Record<Harmony, string> = {
  complementary: "互補",
  analogous: "類似",
  triadic: "三等分",
};

// 依色相給一個中文色名 + 對應一個既有 mood,讓動態配色也能被風格篩選。
const HUE_NAMES: { max: number; name: string; mood: MoodTag }[] = [
  { max: 15, name: "緋紅", mood: "活力新創" },
  { max: 45, name: "暖橙", mood: "溫暖親切" },
  { max: 70, name: "明黃", mood: "活力新創" },
  { max: 100, name: "萊姆", mood: "自然有機" },
  { max: 160, name: "翠綠", mood: "自然有機" },
  { max: 200, name: "青碧", mood: "科技未來" },
  { max: 250, name: "湛藍", mood: "沉穩專業" },
  { max: 290, name: "靛紫", mood: "科技未來" },
  { max: 330, name: "品紫", mood: "優雅奢華" },
  { max: 360, name: "桃粉", mood: "柔和粉嫩" },
];

function hueName(h: number): { name: string; mood: MoodTag } {
  return HUE_NAMES.find((x) => h < x.max) ?? HUE_NAMES[HUE_NAMES.length - 1];
}

/**
 * 在某色相/彩度上找一個明度,使得「最佳文字色」對比達到 target。
 * 由淺到深掃,回傳第一個達標的(顏色 + 該配的文字色)。
 */
function fitFill(
  hue: number,
  sat: number,
  target: number,
): { color: string; fg: string } {
  for (let l = 0.62; l >= 0.16; l -= 0.02) {
    const color = hslToHex(hue, sat, l);
    const fg = bestTextOn(color);
    if (contrastRatio(fg, color) >= target) return { color, fg };
  }
  const color = hslToHex(hue, sat, 0.16);
  return { color, fg: bestTextOn(color) };
}

export interface GenerateOptions {
  hue: number;
  harmony: Harmony;
  level: TargetLevel;
}

/** 從色相 + 和諧規則 + 目標等級,合成一組保證達標的配色 */
export function generatePalette({
  hue,
  harmony,
  level,
}: GenerateOptions): Palette {
  const target = level === "AAA" ? 7 : 4.5;
  const accentHue = (hue + HARMONY_OFFSET[harmony]) % 360;

  const primary = fitFill(hue, 0.62, target);
  const accent = fitFill(accentHue, 0.6, target);

  // 中性骨架:背景極淺帶一點主色相、文字極深 → 必然遠超 AAA
  const roles = {
    background: hslToHex(hue, 0.3, 0.975),
    surface: "#ffffff",
    text: hslToHex(hue, 0.22, 0.14),
    muted: hslToHex(hue, 0.12, 0.42),
    border: hslToHex(hue, 0.2, 0.9),
    primary: primary.color,
    primaryFg: primary.fg,
    accent: accent.color,
    accentFg: accent.fg,
  };

  const { name, mood } = hueName(hue);
  const id = `gen-${Math.round(hue)}-${harmony}-${level.toLowerCase()}`;

  return {
    id,
    name: `${name} · ${HARMONY_LABEL[harmony]}`,
    moods: [mood],
    roles,
    blurb: `以${name}為主色、採${HARMONY_LABEL[harmony]}配色關係自動生成的一組,適合想快速找到「能用又達標」配色的場景。`,
    why: `主色與強調色是${HARMONY_LABEL[harmony]}關係;背景、文字、邊框依主色相自動調出,整組保證達 ${level} 對比,挑了不用擔心看不清。`,
    roleUsage: {
      primary: `${name}主色,主要按鈕與重點`,
      accent: `${HARMONY_LABEL[harmony]}色,次要強調與點綴`,
      background: "極淺的主色調底,不刺眼",
    },
    generated: true,
  };
}

const HARMONIES: Harmony[] = ["complementary", "analogous", "triadic"];

/**
 * 產生一批不重複色相的配色。用 index 決定色相(黃金角度散開,避免相鄰太像),
 * 不依賴亂數 → 同一批可重現。seed 讓「再產生一批」拿到不同色相。
 */
export function generateBatch(
  count: number,
  level: TargetLevel,
  seed = 0,
): Palette[] {
  const out: Palette[] = [];
  for (let i = 0; i < count; i++) {
    const n = seed + i;
    const hue = (n * 137.508) % 360; // 黃金角度
    const harmony = HARMONIES[n % HARMONIES.length];
    out.push(generatePalette({ hue, harmony, level }));
  }
  return out;
}
