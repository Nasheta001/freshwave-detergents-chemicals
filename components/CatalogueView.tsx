import Link from "next/link";
import { FlaskConical, Search, SearchX } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { DIVISION_LABEL, getCategories, getSettings, listProducts, type Division } from "@/lib/data";

export async function CatalogueView({
  title,
  intro,
  division,
  category,
  query,
}: {
  title: string;
  intro: string;
  division?: Division;
  category?: string;
  query?: string;
}) {
  const [settings, categories, products] = await Promise.all([
    getSettings(),
    getCategories(),
    listProducts({ q: query, division, category }),
  ]);
  const showChemicalNote = division === "chemicals" || products.some((p) => p.division === "chemicals");
  const groups: Division[] = ["detergents", "chemicals"];
  const linkCls = (active: boolean) =>
    `flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
      active ? "bg-navy font-semibold text-white" : "text-navy hover:bg-mist"
    }`;
  const chipCls = (active: boolean) =>
    `shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${
      active ? "border-navy bg-navy text-white" : "border-line bg-white text-navy"
    }`;

  return (
    <>
      <section className="border-b border-line bg-mist">
        <div className="container-fw py-10 lg:py-12">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/" className="hover:text-ocean">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-ocean">Products</Link>
          </nav>
          <h1 className="mt-3 text-[30px] font-extrabold sm:text-[38px]">{title}</h1>
          <p className="mt-2 max-w-2xl text-muted">{intro}</p>
          <form action="/products" role="search" className="mt-6 flex max-w-xl gap-2">
            <div className="relative flex-1">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ocean" />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search by product name"
                aria-label="Search by product name"
                className="field !rounded-full !pl-11"
              />
            </div>
            <button className="btn btn-primary" type="submit">Search</button>
          </form>
        </div>
      </section>

      <div className="container-fw grid gap-8 py-10 lg:grid-cols-[250px_1fr] lg:gap-12 lg:py-14">
        {/* Mobile filters */}
        <nav aria-label="Filter by category" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:hidden">
          <Link href="/products" className={chipCls(!division && !category && !query)}>All</Link>
          <Link href="/detergents" className={chipCls(division === "detergents" && !category)}>Detergents</Link>
          <Link href="/raw-chemicals" className={chipCls(division === "chemicals" && !category)}>Raw Chemicals</Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className={chipCls(category === c.slug)}>
              {c.name}
            </Link>
          ))}
        </nav>

        {/* Desktop filters */}
        <aside className="hidden lg:block">
          <nav aria-label="Filter by category" className="sticky top-[96px] max-h-[calc(100vh-120px)] overflow-y-auto pr-1">
            <Link href="/products" className={linkCls(!division && !category && !query)}>All products</Link>
            {groups.map((g) => (
              <div key={g} className="mt-6">
                <Link
                  href={g === "detergents" ? "/detergents" : "/raw-chemicals"}
                  className={`block px-3 text-[11px] font-bold uppercase tracking-[0.14em] ${
                    division === g && !category ? "text-ink underline underline-offset-4" : "text-ocean hover:text-ink"
                  }`}
                >
                  {DIVISION_LABEL[g]}
                </Link>
                <ul className="mt-2 space-y-0.5">
                  {categories.filter((c) => c.division === g).map((c) => (
                    <li key={c.slug}>
                      <Link href={`/category/${c.slug}`} className={linkCls(category === c.slug)} aria-current={category === c.slug ? "page" : undefined}>
                        <span>{c.name}</span>
                        <span className={`text-xs tabular-nums ${category === c.slug ? "text-ice" : "text-muted"}`}>{c.product_count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted" aria-live="polite">
              {products.length} {products.length === 1 ? "product" : "products"}
              {query ? ` for "${query}"` : ""}
            </p>
            {query && (
              <Link href="/products" className="text-sm font-semibold text-ocean hover:text-ink">Clear search</Link>
            )}
          </div>

          {showChemicalNote && products.length > 0 && (
            <div className="mt-4 flex gap-3 rounded-[var(--radius-card)] border border-line bg-mist p-4 text-sm leading-relaxed text-navy">
              <FlaskConical size={18} className="mt-0.5 shrink-0 text-ocean" />
              <p>
                Items marked <strong>Raw material</strong> are industrial chemicals, not household products. Request the
                Safety Data Sheet and follow the supplier label when handling them.
              </p>
            </div>
          )}

          {products.length === 0 ? (
            <div className="mt-6 rounded-[var(--radius-card)] border border-dashed border-line px-6 py-16 text-center">
              <SearchX size={32} className="mx-auto text-ocean" />
              <h2 className="mt-4 text-xl font-bold">No products found</h2>
              <p className="mx-auto mt-2 max-w-sm text-muted">
                Try a different name or browse a category. You can also ask us directly if we stock what you need.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/products" className="btn btn-primary btn-sm">View all products</Link>
                <Link href="/contact" className="btn btn-outline btn-sm">Ask FreshWave</Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} whatsapp={settings.whatsapp} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
