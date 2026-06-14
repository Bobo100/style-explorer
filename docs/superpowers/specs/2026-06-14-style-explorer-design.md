# style-explorer — 設計規格(spec)

> 2026-06-14 · 由 Claude 代理 PM/設計師/RD 角色拍板。使用者授權綠區自主開發,本檔為合約。
> 構想池來源:`ObsidianVault/side-project-ideas.md` `^style-explorer`

## 一句話

色票 + 實際網站預覽二合一工具,**給沒學過色彩學的人用**。選配色 → 即時套到示範頁看效果 + 白話解釋為什麼好看 + 一鍵匯出 CSS variables / Tailwind config。

## 為什麼做(差異化)

Coolors / Color Hunt 等工具丟你一排 HEX,但不教你**怎麼用**:哪個當主色、哪個當背景、為什麼這樣搭好看、對比夠不夠。style-explorer 鎖定的縫隙是「**配色 + 語意角色 + 白話說明 + 真實版型預覽**」四合一,讓不懂色彩學的人也能挑到能用的配色並直接帶走 code。

## 範圍(MVP — YAGNI)

### 做

1. **策展配色庫**:~24 組,每組預先指定 9 個語意角色 + 情緒/用途標籤 + 白話文案(情境 / 為何好看 / 角色用途)
2. **即時版型預覽**:3 種真實版型(Landing / Blog / Dashboard)吃 CSS variables,切配色即時反映
3. **資訊面板**:選中配色的情境、為何好看(對比/和諧,用例子不用術語)、每個角色用在哪、WCAG 對比度徽章
4. **WCAG 對比度檢查**:文字/背景組合算對比比值 + AA/AAA 判定(既教學又可測試)
5. **匯出**:CSS variables(`:root{}`)+ Tailwind v4(`@theme`)
6. **色彩學小卡**:對比 / 互補 / 類似色,example-driven 輕量教學

### 不做(MVP 砍,列未來)

- Figma tokens 匯出
- 英文 i18n(MVP 先繁中;字串集中放 `lib/strings.ts` 留擴充)
- 自訂/手調配色(hue slider 等)→ 未來
- 後端 / DB / 帳號 → 無,純前端靜態
- 配色自動生成(AI)→ 未來

## 架構

純前端 Next.js 16 App Router,單頁工具,無後端。狀態 = 選中配色 id + 選中版型 + 是否開匯出 modal,用 React `useState` 即可(URL 不持久化,MVP 砍)。

### 即時換色機制(關鍵)

- `globals.css` 用 Tailwind 4 `@theme inline` 把 `--color-primary`…映到 `var(--app-primary)`…,`:root` 給 fallback 預設值
- `<PreviewPane>` 外層 div 用 inline style 設 `--app-primary: {palette.roles.primary}` 等 9 個 var
- 版型內用 `bg-primary` / `text-text` / `bg-surface` 等 utility → CSS var 級聯,換配色零重渲染邏輯、即時生效

### 9 個語意角色

`background`(頁底)· `surface`(卡片底)· `text`(主文字)· `muted`(次要文字)· `border`(邊框)· `primary`(品牌/行動)· `primaryFg`(主色上的文字)· `accent`(強調)· `accentFg`(強調上的文字)

### 模組

| 層 | 檔 | 職責 | 測試 |
|---|---|---|---|
| 型別 | `lib/types.ts` | `Palette`、`Role`、`MoodTag` | — |
| 資料 | `lib/palettes.ts` | ~24 組策展配色(角色 + 文案) | 結構驗證測試 |
| 引擎 | `lib/contrast.ts` | hex→相對亮度→對比比值→AA/AAA | ✅ TDD |
| 引擎 | `lib/export-css.ts` | Palette → CSS variables 字串 | ✅ TDD |
| 引擎 | `lib/export-tailwind.ts` | Palette → Tailwind v4 `@theme` 字串 | ✅ TDD |
| 文案 | `lib/strings.ts` | 繁中 UI 字串集中 | — |
| UI | `components/PaletteGallery.tsx` | 左:依情緒/用途瀏覽 + 篩選 | smoke |
| UI | `components/PreviewPane.tsx` | 中:版型切換 + 注入 CSS var | smoke |
| UI | `components/templates/*` | Landing / Blog / Dashboard | — |
| UI | `components/InfoPanel.tsx` | 右:情境/為何/角色用途/對比徽章 | smoke |
| UI | `components/ExportModal.tsx` | 匯出 CSS / Tailwind + 複製 | smoke |
| UI | `components/ColorTheoryCards.tsx` | 色彩學小卡 | — |

## 資料模型

```ts
type Role =
  | 'background' | 'surface' | 'text' | 'muted' | 'border'
  | 'primary' | 'primaryFg' | 'accent' | 'accentFg';

type MoodTag = '沉穩專業' | '溫暖親切' | '活力新創' | '極簡黑白'
  | '自然有機' | '優雅奢華' | '柔和粉嫩' | '科技未來';

interface Palette {
  id: string;            // kebab-case
  name: string;          // 中文名
  moods: MoodTag[];
  roles: Record<Role, string>;   // hex (#rrggbb)
  blurb: string;         // 情境:適合什麼網站/品牌
  why: string;           // 為何好看(白話拆解,不用術語)
  roleUsage: Partial<Record<Role, string>>;  // 各角色用在哪的白話
}
```

## 對比度引擎(WCAG 2.1)

- `relativeLuminance(hex)`:sRGB → 線性 → 0.2126R+0.7152G+0.0722B
- `contrastRatio(fg, bg)`:`(L1+0.05)/(L2+0.05)`,1~21
- `wcagLevel(ratio, large?)`:normal text AA≥4.5 / AAA≥7;large text AA≥3 / AAA≥4.5
- 用於:資訊面板顯示 text/background、text/surface、primaryFg/primary、accentFg/accent 的徽章

## 匯出格式

**CSS variables**:
```css
:root {
  --color-background: #...;
  --color-primary: #...;
  /* …9 roles… */
}
```

**Tailwind v4**:
```css
@theme {
  --color-background: #...;
  --color-primary: #...;
}
```

兩者皆純函式 `(palette) => string`,deterministic,易測。

## 測試策略(綠區驗證標準)

- **引擎 TDD**:`contrast`(已知比值驗證:#000/#fff=21、AA/AAA 邊界)、`export-css`、`export-tailwind`(snapshot 對拍)
- **資料驗證**:每組 palette 都有 9 個角色、hex 格式合法、id 唯一
- **元件 smoke**:渲染不爆、切配色/版型互動
- **成功標準**:`bun run build` 綠 + `vitest run` 全綠 + lint 乾淨

## 紅區閘門(需使用者授權才做)

- push 到 GitHub 遠端
- deploy Vercel

本機建構、commit 到 local git = 綠區自主。

## 未來(收進 backlog,非 MVP)

Figma tokens 匯出 · 英文 i18n · 自訂配色(hue/明度微調)· AI 配色生成 · URL 分享狀態 · 收藏/最愛 · 深色模式版型變體
