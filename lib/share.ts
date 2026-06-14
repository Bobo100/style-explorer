// URL 分享狀態的編 / 解碼。可測,跟 React 無關。
import { getPalette } from "./palettes";
import {
  ROLES,
  TEMPLATE_KEYS,
  type Palette,
  type Role,
  type TemplateKey,
} from "./types";

export interface ShareState {
  palette: Palette;
  template: TemplateKey;
}

/** 9 個角色色值串成 54 字 hex(無 #),固定 ROLES 順序 */
function packRoles(p: Palette): string {
  return ROLES.map((r) => p.roles[r].replace("#", "")).join("");
}

function unpackRoles(packed: string): Record<Role, string> | null {
  if (!/^[0-9a-fA-F]{54}$/.test(packed)) return null;
  const roles = {} as Record<Role, string>;
  ROLES.forEach((r, i) => {
    roles[r] = "#" + packed.slice(i * 6, i * 6 + 6).toLowerCase();
  });
  return roles;
}

/** 從 hex 重建一組 custom 配色(分享連結還原用,文案用通用版) */
export function customPalette(
  roles: Record<Role, string>,
  name = "分享的配色",
): Palette {
  return {
    id: "shared",
    name,
    moods: ["極簡黑白"],
    roles,
    blurb: "從分享連結還原的配色,可繼續微調或匯出。",
    why: "可讀性以右側對比檢查為準;不達標可一鍵修到 AA / AAA。",
    roleUsage: {},
    custom: true,
  };
}

/** 狀態 → query string(不含 ?)。策展配色用 id,其餘存完整色值 */
export function encodeState(palette: Palette, template: TemplateKey): string {
  const params = new URLSearchParams();
  params.set("t", template);
  if (!palette.custom && getPalette(palette.id)) {
    params.set("p", palette.id);
  } else {
    params.set("c", packRoles(palette));
    params.set("n", palette.name);
  }
  return params.toString();
}

/** query string → 狀態(解不出來的部分回 null) */
export function decodeState(search: string): {
  palette: Palette | null;
  template: TemplateKey | null;
} {
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );

  const tParam = params.get("t");
  const template =
    tParam && (TEMPLATE_KEYS as string[]).includes(tParam)
      ? (tParam as TemplateKey)
      : null;

  let palette: Palette | null = null;
  const p = params.get("p");
  const c = params.get("c");
  if (p) {
    palette = getPalette(p) ?? null;
  } else if (c) {
    const roles = unpackRoles(c);
    if (roles) palette = customPalette(roles, params.get("n") || undefined);
  }

  return { palette, template };
}
