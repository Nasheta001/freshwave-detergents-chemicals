import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Factory,
  ShoppingBasket,
  Tags,
} from "lucide-react";
import { LocationSection } from "@/components/LocationSection";
import { HeroVisual } from "@/components/HeroVisual";
import { ProductCard } from "@/components/ProductCard";
import { ProductVisual } from "@/components/ProductVisual";
import { Reveal } from "@/components/Reveal";
import { getCategories, getSettings, listProducts, whatsappUrl } from "@/lib/data";

const TRUST = [
  { icon: BadgeCheck, title: "Quality Products", text: "A carefully selected range of detergents, cleaning products and raw materials." },
  { icon: Factory, title: "Household & Industrial Supply", text: "From a single bottle for the home to bulk supply for businesses and manufacturers." },
  { icon: Tags, title: "Competitive Wholesale Options", text: "Ask about bulk quantities and regular supply for your business or institution." },
  { icon: ShoppingBasket, title: "Convenient Ordering", text: "Build an enquiry basket on the site and send it straight to us on WhatsApp." },
];

const CHEMICAL_GROUPS = [
  ["Surfactants", "surfactants"],
  ["Alkalis", "alkalis"],
  ["Builders", "builders-water-softeners"],
  ["Acids", "acids"],
  ["Bleaching Agents", "bleaching-disinfecting-agents"],
  ["Thickeners", "thickeners"],
  ["Preservatives", "preservatives"],
  ["Fragrances & Additives", "finishing-additives"],
  ["Solvents", "solvents"],
  ["Soap-Making Materials", "soap-making-oils-bases"],
];

const SECTORS = [
  "Hotels",
  "Laundromats",
  "Cleaning companies",
  "Schools",
  "Hospitals",
  "Restaurants",
  "Detergent manufacturers",
  "Commercial cleaning businesses",
];

export default async function HomePage() {
  const [settings, categories, featured] = await Promise.all([
    getSettings(),
    getCategories(),
    listProducts({ featured: true, limit: 8 }),
  ]);
  const detergentCats = categories.filter((c) => c.division === "detergents");
  const chemicalSlugs = new Set(categories.filter((c) => c.division === "chemicals").map((c) => c.slug));
  const wa = whatsappUrl(settings.whatsapp, "Hello FreshWave, I would like to make an enquiry.");

  return (
    <>
      {/* Hero */}
      <section className="relative -mt-[72px] overflow-hidden bg-ink text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(60% 70% at 78% 45%, rgba(38,101,140,0.55), transparent 70%)" }}
        />
        <div className="container-fw relative grid items-center gap-6 pb-24 pt-[120px] lg:grid-cols-[1.05fr_1fr] lg:pb-32 lg:pt-[150px]">
          <div>
            <p className="eyebrow eyebrow-dark">Bamburi, Mombasa</p>
            <h1 className="mt-4 max-w-xl text-[38px] font-extrabold leading-[1.08] text-white sm:text-[48px] lg:text-[56px]">
              Everything You Need for a Cleaner World.
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-white/75">
              From everyday cleaning essentials to professional-grade chemical raw materials, FreshWave supplies
              products that keep homes, businesses and industries running.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn btn-light">
                Shop Products <ArrowRight size={17} />
              </Link>
              <Link href="/raw-chemicals" className="btn btn-ghost-dark">
                Explore Raw Chemicals
              </Link>
            </div>
          </div>
          <div className="relative h-[300px] sm:h-[380px] lg:h-[460px]">
            <HeroVisual />
          </div>
        </div>
        <svg className="absolute inset-x-0 bottom-[-1px] block w-full text-white" viewBox="0 0 1440 80" preserveAspectRatio="none" height="60" aria-hidden="true">
          <path fill="currentColor" d="M0 44c180-36 360-36 540 0s360 36 540 0 240-30 360-12v48H0z" />
        </svg>
      </section>

      {/* Trust */}
      <section aria-label="Why FreshWave" className="container-fw py-12 lg:py-14">
        <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-line">
          {TRUST.map((t, i) => (
            <li key={t.title} className={i > 0 ? "lg:pl-8" : ""}>
              <t.icon size={24} className="text-ocean" strokeWidth={1.75} />
              <h2 className="mt-3 text-[16px] font-bold">{t.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{t.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Categories */}
      <section className="bg-mist py-16 lg:py-20">
        <div className="container-fw">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Shop by category</p>
              <h2 className="mt-2 text-[28px] font-extrabold sm:text-[34px]">Find what you need, fast.</h2>
            </div>
            <Link href="/products" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-ocean hover:text-ink">
              View all products <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[232px]">
            {detergentCats.map((c, i) => (
              <Reveal key={c.slug} delay={Math.min(i, 4) * 0.04} className={i === 0 ? "sm:col-span-2 lg:row-span-2" : ""}>
                <Link
                  href={`/category/${c.slug}`}
                  className="group relative flex h-full min-h-[210px] flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-shadow duration-300 hover:shadow-[0_20px_44px_-26px_rgba(1,28,64,0.5)]"
                >
                  <div className={`relative overflow-hidden ${i === 0 ? "h-44 lg:h-auto lg:flex-1" : "h-24 lg:h-[92px]"}`}>
                    <ProductVisual src={c.image_url} alt={c.name} kind="detergents" className={`transition-transform duration-500 group-hover:scale-[1.04] ${i === 0 ? "" : "!justify-end pr-8"}`} />
                  </div>
                  <div className="flex flex-1 flex-col p-5 lg:flex-none">
                    <h3 className={`font-bold ${i === 0 ? "text-[22px]" : "text-[17px]"}`}>{c.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{c.description}</p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-ocean group-hover:text-ink">
                      Explore Category <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
            <Reveal className="sm:col-span-2" delay={0.12}>
              <Link
                href="/raw-chemicals"
                className="group relative flex h-full min-h-[210px] overflow-hidden rounded-[var(--radius-card)] bg-navy text-white transition-shadow duration-300 hover:shadow-[0_20px_44px_-22px_rgba(1,28,64,0.7)]"
              >
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow eyebrow-dark">For manufacturers</p>
                  <h3 className="mt-2 text-[22px] font-bold text-white">Chemical Raw Materials</h3>
                  <p className="mt-1 max-w-xs text-sm text-white/70">
                    Surfactants, alkalis, acids, fragrances, solvents and soap-making materials.
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-ice">
                    Explore Category <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
                <div className="hidden w-[38%] sm:block">
                  <ProductVisual src={null} alt="Chemical raw materials" kind="chemicals" dark />
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container-fw py-16 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Featured products</p>
              <h2 className="mt-2 text-[28px] font-extrabold sm:text-[34px]">Everyday cleaning essentials.</h2>
            </div>
            <Link href="/detergents" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-ocean hover:text-ink">
              All detergents <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.05} className="flex">
                <div className="flex w-full [&>article]:w-full">
                  <ProductCard product={p} whatsapp={settings.whatsapp} />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Raw chemicals */}
      <section className="relative overflow-hidden bg-ink py-16 text-white lg:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#A7EBF2 1px, transparent 1px), linear-gradient(90deg, #A7EBF2 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="container-fw relative grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow eyebrow-dark">Raw chemical supply</p>
            <h2 className="mt-3 text-[28px] font-extrabold leading-tight text-white sm:text-[36px]">
              The Raw Materials Behind Better Cleaning Products.
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-white/70">
              Discover a wide selection of chemical ingredients and raw materials used in detergent production, soap
              manufacturing, cleaning formulations and industrial applications.
            </p>
            <Link href="/raw-chemicals" className="btn btn-light mt-8">
              Explore Chemical Catalogue <ArrowRight size={17} />
            </Link>
            <p className="mt-8 max-w-md border-l-2 border-teal pl-4 text-sm leading-relaxed text-white/60">
              Industrial chemicals are listed separately from household products. Ask us for the Safety Data Sheet
              before you buy.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ol className="grid border-t border-white/15 sm:grid-cols-2 sm:gap-x-10">
              {CHEMICAL_GROUPS.filter(([, slug]) => chemicalSlugs.has(slug)).map(([label, slug], i) => (
                <li key={slug} className="border-b border-white/15">
                  <Link href={`/category/${slug}`} className="group flex items-center gap-4 py-4 transition-colors hover:text-ice">
                    <span className="w-6 text-xs font-bold tabular-nums text-teal">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-[17px] font-semibold">{label}</span>
                    <ArrowUpRight size={17} className="text-white/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ice" />
                  </Link>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Wholesale */}
      <section className="container-fw py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          <Reveal>
            <p className="eyebrow">Wholesale &amp; business supply</p>
            <h2 className="mt-3 text-[28px] font-extrabold leading-tight sm:text-[36px]">
              Your Reliable Partner for Cleaning &amp; Chemical Supplies.
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-muted">
              Buying for a business or institution? Send us an enquiry about bulk orders, regular business supplies and
              product availability, and we will get back to you with a quotation.
            </p>
            <Link href="/wholesale" className="btn btn-primary mt-8">
              Request a Wholesale Quote <ArrowRight size={17} />
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-[var(--radius-card)] bg-mist p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Building2 size={20} className="text-ocean" />
                <h3 className="text-[15px] font-bold">Who we supply</h3>
              </div>
              <ul className="mt-5 grid grid-cols-1 gap-x-8 min-[420px]:grid-cols-2">
                {SECTORS.map((s) => (
                  <li key={s} className="flex items-center gap-3 border-b border-line py-3 text-[15px] font-medium text-navy">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* About */}
      <section className="border-y border-line bg-white">
        <div className="container-fw grid gap-8 py-16 lg:grid-cols-[1fr_1.4fr] lg:gap-16 lg:py-20">
          <div>
            <p className="eyebrow">About FreshWave</p>
            <h2 className="mt-3 text-[28px] font-extrabold leading-tight sm:text-[34px]">A dependable local supplier.</h2>
          </div>
          <div>
            <p className="text-[17px] leading-relaxed text-body">
              FreshWave Detergents &amp; Chemicals supplies cleaning products, household detergents and chemical raw
              materials from Bamburi, Mombasa.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Our range covers laundry, kitchen, bathroom, floor care, personal care and car care products, along with
              the raw materials used to make them. We serve households, businesses, manufacturers, hotels, cleaning
              companies and institutions.
            </p>
            <Link href="/about" className="mt-6 inline-flex items-center gap-1.5 font-semibold text-ocean hover:text-ink">
              More about us <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <LocationSection settings={settings} whatsappHref={wa} />
    </>
  );
}
