import { ShoppingCart, Star } from "lucide-react";

// 示範版型:電商商品列表頁。
const PRODUCTS = [
  { name: "羊毛針織衫", price: "$1,280", sale: "-20%" },
  { name: "帆布托特包", price: "$890", sale: null },
  { name: "陶瓷馬克杯", price: "$420", sale: "新品" },
];

export default function EcommerceTemplate() {
  return (
    <div className="min-h-full bg-background text-text">
      <header className="flex items-center justify-between border-b border-border px-8 py-4">
        <span className="font-semibold">good goods.</span>
        <div className="flex items-center gap-4 text-sm text-muted">
          <span>新品</span>
          <span>分類</span>
          <button className="relative rounded-lg bg-primary p-2 text-primary-fg">
            <ShoppingCart className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-fg">
              2
            </span>
          </button>
        </div>
      </header>

      <div className="px-8 py-8">
        <h1 className="mb-1 text-2xl font-bold">本季嚴選</h1>
        <p className="mb-6 text-sm text-muted">耐看、耐用、值得帶回家。</p>

        <div className="grid gap-5 sm:grid-cols-3">
          {PRODUCTS.map((p) => (
            <div
              key={p.name}
              className="overflow-hidden rounded-xl border border-border bg-surface"
            >
              <div className="relative aspect-[4/3] bg-background">
                {p.sale && (
                  <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-fg">
                    {p.sale}
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="mb-1 flex items-center gap-1 text-xs text-muted">
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3" />
                </div>
                <h3 className="font-medium">{p.name}</h3>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold">{p.price}</span>
                  <button className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-fg">
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
