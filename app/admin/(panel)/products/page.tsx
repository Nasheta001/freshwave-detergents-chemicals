import Link from "next/link";
import { Plus } from "lucide-react";
import { getCategories, listProducts, formatKes, lowestPrice, AVAILABILITY_LABEL } from "@/lib/data";

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; photo?: string; saved?: string; deleted?: string }>;
}) {
  const sp = await searchParams;
  const [categories, all] = await Promise.all([
    getCategories(),
    listProducts({ q: sp.q?.trim() || undefined, category: sp.category || undefined }),
  ]);
  const products = sp.photo === "missing" ? all.filter((p) => !p.image_url) : all;
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Products</h1>
        <Link href="/admin/products/new" className="btn btn-primary btn-sm"><Plus size={16} /> Add product</Link>
      </div>
      {(sp.saved || sp.deleted) && (
        <p role="status" className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
          {sp.saved ? "Product saved." : "Product deleted."}
        </p>
      )}
      <form className="mt-5 flex flex-wrap gap-2">
        <input name="q" defaultValue={sp.q} placeholder="Search products" aria-label="Search products" className="field max-w-xs" />
        <select name="category" defaultValue={sp.category ?? ""} aria-label="Category" className="field max-w-[230px]">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <select name="photo" defaultValue={sp.photo ?? ""} aria-label="Photo filter" className="field max-w-[180px]">
          <option value="">Any photo status</option>
          <option value="missing">Photo missing</option>
        </select>
        <button className="btn btn-outline">Filter</button>
      </form>
      <p className="mt-4 text-sm text-muted">{products.length} products</p>
      {products.length === 0 ? (
        <p className="card mt-3 p-8 text-center text-sm text-muted">No products match.</p>
      ) : (
        <div className="card mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Availability</th>
                <th className="px-4 py-3 font-semibold">Photo</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((p) => {
                const price = lowestPrice(p);
                return (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-semibold text-ink">
                      {p.name}
                      {p.featured && <span className="ml-2 rounded-full bg-ice px-2 py-0.5 text-[10px] font-bold uppercase text-ink">Featured</span>}
                    </td>
                    <td className="px-4 py-3 text-muted">{p.category_name}</td>
                    <td className="px-4 py-3 text-muted">{price === null ? "Not set" : `From ${formatKes(price)}`}</td>
                    <td className="px-4 py-3 text-muted">{p.availability === "unconfirmed" ? "Not set" : AVAILABILITY_LABEL[p.availability]}</td>
                    <td className="px-4 py-3 text-muted">{p.image_url ? "Yes" : "Missing"}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/products/${p.id}`} className="font-semibold text-ocean hover:text-ink">Edit</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
