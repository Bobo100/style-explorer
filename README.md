# Style Explorer

**色票 + 真實網站預覽二合一,給沒學過色彩學的人用。**

選一組策展配色 → 即時看它套到 Landing / Blog / Dashboard 真實版型的樣子 → 讀懂「為什麼這樣搭好看」「每個顏色用在哪」「對比夠不夠」→ 一鍵匯出 CSS variables 或 Tailwind v4 config。

不是丟你一排 HEX 自己猜,而是**每個顏色都標好語意角色**(主色、背景、文字、強調…),帶走就能用。

## 功能

- **24 組策展配色** + **動態產生器**(HSL 色彩和諧,保證達到 AA / AAA),依 8 種風格篩選
- **從圖片 / Logo 取色**:上傳圖片,canvas 取主色自動配成一組(語意角色 + 中性骨架)
- **即時版型預覽**:5 種真實版型(Landing / Blog / Dashboard / 電商 / 表單)吃 CSS variables,換配色零延遲;**亮 / 暗主題切換**(自動推深色版)+ **色盲模擬**
- **白話說明**:每組配色的適用情境、為何好看(用例子不用術語)、每個角色用在哪
- **WCAG 對比度檢查**:文字/底色對比比值 + AA/AAA 徽章,可切**內文 / 大字**門檻;**一鍵修到 AA / AAA**
- **自訂微調**:9 個語意角色逐一改色,或用**整組明暗 / 鮮豔度滑桿**粗調
- **收藏 / 最愛**(localStorage)+ **URL 分享**(含自訂色值)
- **多格式匯出**:CSS variables(含漸層 / 陰影 token)/ Tailwind v4 `@theme` / SCSS / W3C Design Tokens JSON / shadcn/ui(含 `.dark`)
- **中 / 英雙語介面**
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
├─ contrast.ts             WCAG 對比度 + AA/AAA(含大字門檻)
├─ color.ts                hex ↔ HSL
├─ generate.ts             動態配色產生器(色彩和諧 + 保證達標)
├─ grade.ts                配色整體可讀性評級
├─ extract.ts              圖片主色 → 語意配色(取色為純函式)
├─ dark.ts                 亮色配色 → 深色版
├─ tweak.ts                整組明暗 / 鮮豔度微調
├─ adjust.ts               改單色 + 一鍵修到 AA/AAA
├─ colorblind.ts           色盲模擬(LMS 矩陣)
├─ favorites.ts / share.ts localStorage 收藏 / URL 分享編解碼
├─ export-*.ts             CSS / Tailwind / SCSS / JSON / shadcn 匯出
├─ css-vars.ts             配色 → React style 物件(--app-*)
├─ strings.ts              中 / 英雙語文案
└─ i18n.tsx                語系 context(useT / useLang)

components/
├─ PaletteGallery          左:瀏覽 / 篩選 / 產生 / 圖片取色
├─ PreviewPane             中:版型切換 + 亮暗 + 色盲 + 注入 CSS var
├─ templates/              Landing / Blog / Dashboard / 電商 / 表單
├─ InfoPanel               右:情境 / 為何 / 對比 / 角色 / 微調 / 收藏 / 匯出
├─ ExportModal             匯出 CSS / Tailwind / SCSS / JSON / shadcn
└─ ColorTheoryCards        色彩學小卡
```

設計規格見 [docs/superpowers/specs/](docs/superpowers/specs/)。

## Roadmap

AI 配色生成(給情境一句話生配色,需接 API)· 更多版型(部落格列表 / 定價頁)· 更多衍生 token(間距 / 圓角)
