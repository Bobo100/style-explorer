// 配色語意角色 —— 不是「6 個 hex 自己猜」,而是每個顏色都標好用途
export type Role =
  | "background" // 頁面底色
  | "surface" // 卡片 / 區塊底色
  | "text" // 主要文字
  | "muted" // 次要文字 / 說明
  | "border" // 邊框 / 分隔線
  | "primary" // 品牌 / 主要行動
  | "primaryFg" // 疊在 primary 上的文字
  | "accent" // 強調 / 點綴
  | "accentFg"; // 疊在 accent 上的文字

export const ROLES: Role[] = [
  "background",
  "surface",
  "text",
  "muted",
  "border",
  "primary",
  "primaryFg",
  "accent",
  "accentFg",
];

export type MoodTag =
  | "沉穩專業"
  | "溫暖親切"
  | "活力新創"
  | "極簡黑白"
  | "自然有機"
  | "優雅奢華"
  | "柔和粉嫩"
  | "科技未來";

export interface Palette {
  id: string; // kebab-case 英文,當 stable id
  name: string; // 中文顯示名
  moods: MoodTag[];
  roles: Record<Role, string>; // #rrggbb
  blurb: string; // 情境:適合什麼網站 / 品牌
  why: string; // 為何好看(白話,不用術語)
  roleUsage: Partial<Record<Role, string>>; // 各角色用在哪的白話說明
}
