"use client";

// 語系 context。預設中文,localStorage 記住選擇。
// 元件用 useT() 拿當前文案;沒包 Provider 時(例如單元測試)回退中文 → 既有測試不受影響。
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { dict, type Lang, type Strings } from "./strings";

const KEY = "style-explorer:lang";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Strings;
}

const Ctx = createContext<LangCtx>({
  lang: "zh",
  setLang: () => {},
  t: dict.zh,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("zh");

  // 掛載後才讀 localStorage(SSR 安全、避免 hydration mismatch);這是外部來源同步,非衍生 state。
  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "zh" || saved === "en") setLang(saved);
  }, []);

  const update = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      // localStorage 不可用時靜默
    }
  };

  return (
    <Ctx.Provider value={{ lang, setLang: update, t: dict[lang] }}>
      {children}
    </Ctx.Provider>
  );
}

/** 當前語系的文案 */
export function useT(): Strings {
  return useContext(Ctx).t;
}

/** [lang, setLang] —— 給語言切換鈕用 */
export function useLang(): [Lang, (l: Lang) => void] {
  const { lang, setLang } = useContext(Ctx);
  return [lang, setLang];
}
