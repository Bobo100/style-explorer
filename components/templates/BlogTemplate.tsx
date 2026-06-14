// 示範版型:部落格文章頁。
export default function BlogTemplate() {
  return (
    <div className="min-h-full bg-background text-text">
      <header className="border-b border-border px-8 py-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold">日常觀察誌</span>
          <div className="flex gap-4 text-sm text-muted">
            <span>文章</span>
            <span>關於</span>
            <span>訂閱</span>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-2xl px-8 py-12">
        <div className="flex gap-2">
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-fg">
            設計
          </span>
          <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
            5 分鐘
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-bold leading-snug">
          為什麼好的配色,是用「角色」而不是「顏色」在想
        </h1>
        <p className="mt-3 text-sm text-muted">
          作者 · 2026 年 6 月 14 日
        </p>

        <p className="mt-6 leading-relaxed">
          很多人挑顏色時,腦中想的是「我喜歡藍色」。但畫面之所以好看,
          靠的不是單一顏色漂亮,而是每個顏色都待在對的位置上。
        </p>

        <blockquote className="my-6 border-l-4 border-primary bg-surface px-5 py-4 text-lg italic">
          先決定「這裡需要一個主色」,再決定「那個主色是什麼」。
        </blockquote>

        <p className="leading-relaxed">
          當你用角色思考 —— 主色、背景、文字、強調 ——
          換色就只是替換,版面結構不會崩。這也是為什麼設計系統都用語意命名。
        </p>

        <div className="mt-8 flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
          <div className="h-10 w-10 rounded-full bg-primary" />
          <div className="text-sm">
            <p className="font-medium">喜歡這篇?</p>
            <p className="text-muted">訂閱每週一篇設計觀察。</p>
          </div>
          <button className="ml-auto rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg">
            訂閱
          </button>
        </div>
      </article>
    </div>
  );
}
