# Style Explorer — CLAUDE.md

色票 + 真實網站預覽二合一的配色工具。功能、即時換色機制與 `lib/` 架構見 [README.md](README.md)。

## 架構心智模型

`lib/` 是純函式引擎與資料(對比度、產生器、取色、匯出等),畫面只負責呈現。換色靠預覽 scope 上的 `--app-*` CSS 變數，經 Tailwind 4 `@theme inline` 映到 `bg-primary` 等 utility,不靠 React 重渲染。

## 指令

```bash
bun install
bun run dev
bun run test     # Vitest
bun run lint
bun run build
```

## 文件地圖

- [README.md](README.md):功能、技術、架構
- `docs/archive/`:已完成的設計(歷史，不代表現況)
- 進行中的工作：`docs/<initiative>/design.md`、`plan.md`
- 決策經過、backlog:vault `_memory/style-explorer/`

## Commit

`type: 中文描述`(feat / fix / docs / refactor / chore / test),走 branch → PR。

@AGENTS.md
