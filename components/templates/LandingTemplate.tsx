import { Zap, CalendarClock, BarChart3 } from "lucide-react";

const FEATURE_ICONS = [Zap, CalendarClock, BarChart3];

// 示範版型:Landing 頁。只用 palette 角色 utility,換配色即時反映。
export default function LandingTemplate() {
  return (
    <div className="min-h-full bg-background text-text">
      {/* nav */}
      <header className="flex items-center justify-between border-b border-border px-8 py-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-primary" />
          <span className="font-semibold">Northwind</span>
        </div>
        <nav className="hidden gap-6 text-sm text-muted sm:flex">
          <span>產品</span>
          <span>方案</span>
          <span>定價</span>
          <span>關於</span>
        </nav>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg">
          免費試用
        </button>
      </header>

      {/* hero */}
      <section className="px-8 py-16 text-center">
        <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-fg">
          全新改版
        </span>
        <h1 className="mx-auto mt-5 max-w-xl text-4xl font-bold leading-tight">
          把雜亂的工作,變成一條清楚的線
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          一個地方管好專案、團隊與進度。不用再開十個分頁。
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <button className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-fg">
            開始使用
          </button>
          <button className="rounded-lg border border-border px-6 py-3 font-medium text-text">
            看示範
          </button>
        </div>
      </section>

      {/* features */}
      <section className="grid gap-4 px-8 pb-16 sm:grid-cols-3">
        {[
          { t: "即時協作", d: "團隊改動同步更新,不怕版本打架。" },
          { t: "自動排程", d: "把重複的事交給系統,專心做重要的。" },
          { t: "數據洞察", d: "一眼看懂進度與瓶頸在哪。" },
        ].map((f, i) => {
          const Icon = FEATURE_ICONS[i];
          return (
            <div
              key={f.t}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-fg">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{f.t}</h3>
              <p className="mt-1 text-sm text-muted">{f.d}</p>
            </div>
          );
        })}
      </section>

      <footer className="border-t border-border px-8 py-6 text-center text-sm text-muted">
        © 2026 Northwind. 用 Style Explorer 配色。
      </footer>
    </div>
  );
}
