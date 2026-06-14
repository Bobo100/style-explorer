// 示範版型:後台儀表板。
export default function DashboardTemplate() {
  const stats = [
    { label: "本月營收", value: "$48,250", delta: "+12%" },
    { label: "新增用戶", value: "1,204", delta: "+8%" },
    { label: "轉換率", value: "3.6%", delta: "+0.4%" },
  ];
  const rows = [
    { name: "陳曉明", plan: "專業版", status: "啟用中" },
    { name: "林雅婷", plan: "團隊版", status: "啟用中" },
    { name: "王建國", plan: "免費版", status: "試用" },
  ];
  return (
    <div className="flex min-h-full bg-background text-text">
      {/* sidebar */}
      <aside className="hidden w-48 shrink-0 border-r border-border bg-surface p-4 sm:block">
        <div className="mb-6 flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-primary" />
          <span className="font-semibold">Console</span>
        </div>
        <nav className="space-y-1 text-sm">
          <div className="rounded-lg bg-primary px-3 py-2 font-medium text-primary-fg">
            總覽
          </div>
          {["用戶", "訂單", "報表", "設定"].map((i) => (
            <div key={i} className="rounded-lg px-3 py-2 text-muted">
              {i}
            </div>
          ))}
        </nav>
      </aside>

      {/* main */}
      <div className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold">總覽</h1>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg">
            匯出報表
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <p className="text-sm text-muted">{s.label}</p>
              <p className="mt-1 text-2xl font-bold">{s.value}</p>
              <span className="mt-2 inline-block rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-fg">
                {s.delta}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
          <div className="border-b border-border px-4 py-3 font-medium">
            最近用戶
          </div>
          <table className="w-full text-sm">
            <thead className="text-muted">
              <tr className="border-b border-border">
                <th className="px-4 py-2 text-left font-medium">姓名</th>
                <th className="px-4 py-2 text-left font-medium">方案</th>
                <th className="px-4 py-2 text-left font-medium">狀態</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3 text-muted">{r.plan}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
