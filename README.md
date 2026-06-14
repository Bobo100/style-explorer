# Style Explorer

**色票 + 真實網站預覽二合一,給沒學過色彩學的人用。**

選一組策展配色 → 即時看它套到 Landing / Blog / Dashboard 真實版型的樣子 → 讀懂「為什麼這樣搭好看」「每個顏色用在哪」「對比夠不夠」→ 一鍵匯出 CSS variables 或 Tailwind v4 config。

不是丟你一排 HEX 自己猜,而是**每個顏色都標好語意角色**(主色、背景、文字、強調…),帶走就能用。

## 功能

- **24 組策展配色**,依 8 種風格(沉穩專業 / 活力新創 / 自然有機 / 科技未來…)篩選
- **即時版型預覽**:3 種真實版型吃 CSS variables,換配色零延遲反映
- **白話說明**:每組配色的適用情境、為何好看(用例子不用術語)、每個角色用在哪
- **WCAG 對比度檢查**:文字/底色組合自動算對比比值 + AA/AAA 徽章
- **一鍵匯出**:CSS variables(`:root`)或 Tailwind v4(`@theme`),可直接複製
- **內嵌色彩學**:對比 / 互補 / 類似色 / 中性色,看色塊就懂

## 技術

| | |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Runtime | Bun |
| Styling | Tailwind CSS 4(`@theme inline` 把語意角色映到 CSS var) |
| Lang | TypeScript |
| Test | Vitest(對比度演算法 + 匯出 serializer + 配色資料驗證) |

**即時換色機制**:選中的配色把 `--app-*` CSS 變數寫在預覽 scope 元素上,Tailwind 4 `@theme inline` 把 `--color-primary` 等映到那些變數,版型內用 `bg-primary` / `text-surface` 等 utility,CSS 變數級聯讓換色零重渲染邏輯。

## 開發

```bash
bun install
bun run dev      # 開發
bun run test     # 跑測試
bun run build    # production build
```

## 架構

```
lib/                       引擎與資料(純函式,TDD)
├─ types.ts                Palette / Role / MoodTag
├─ palettes.ts             24 組策展配色
├─ contrast.ts             WCAG 對比度 + AA/AAA
├─ export-css.ts           配色 → CSS variables
├─ export-tailwind.ts      配色 → Tailwind v4 @theme
├─ css-vars.ts             配色 → React style 物件(--app-*)
└─ strings.ts              繁中文案集中(留 i18n 擴充)

components/
├─ PaletteGallery          左:瀏覽 + 風格篩選
├─ PreviewPane             中:版型切換 + 注入 CSS var
├─ templates/              Landing / Blog / Dashboard
├─ InfoPanel               右:情境 / 為何 / 對比徽章 / 角色用途
├─ ExportModal             匯出 CSS / Tailwind
└─ ColorTheoryCards        色彩學小卡
```

設計規格見 [docs/superpowers/specs/](docs/superpowers/specs/)。

## Roadmap

Figma tokens 匯出 · 英文 i18n · 自訂配色(色相/明度微調)· AI 配色生成 · URL 分享狀態 · 收藏最愛
