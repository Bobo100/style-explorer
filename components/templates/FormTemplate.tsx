import { Check } from "lucide-react";

// 示範版型:表單頁(註冊 / 設定)。
export default function FormTemplate() {
  return (
    <div className="flex min-h-full items-center justify-center bg-background p-8 text-text">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-7">
        <h1 className="text-xl font-bold">建立帳號</h1>
        <p className="mt-1 text-sm text-muted">30 秒完成,馬上開始使用。</p>

        <div className="mt-6 space-y-4">
          <Field label="姓名">
            <input
              readOnly
              value="陳曉明"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
            />
          </Field>

          <Field label="電子郵件">
            <input
              readOnly
              value="ming@example.com"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
            />
          </Field>

          <Field label="密碼">
            <input
              readOnly
              type="password"
              value="password"
              className="w-full rounded-lg border-2 border-primary bg-background px-3 py-2 text-sm outline-none"
            />
            <p className="mt-1 text-xs text-muted">至少 8 個字元,含數字。</p>
          </Field>

          <label className="flex items-center gap-2 text-sm text-muted">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-primary text-primary-fg">
              <Check className="h-3.5 w-3.5" />
            </span>
            我同意服務條款
          </label>

          <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-fg">
            建立帳號
          </button>

          <p className="text-center text-sm text-muted">
            已經有帳號了?
            <span className="ml-1 font-medium text-accent">登入</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
