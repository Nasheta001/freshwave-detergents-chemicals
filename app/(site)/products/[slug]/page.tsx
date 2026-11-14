import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileDown, FlaskConical, Home, ShieldAlert } from "lucide-react";
import { EnquiryPanel } from "@/components/EnquiryPanel";
import { ProductCard } from "@/components/ProductCard";
import { ProductVisual } from "@/components/ProductVisual";
import { AVAILABILITY_LABEL, SITE_URL, getProduct, getSettings, lowestPrice, relatedProducts } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  const place = product.division === "chemicals" ? "Kenya" : "Mombasa";
  return {
    title: `${product.name} in ${place}`,
    description: `${product.name} from FreshWave Detergents & Chemicals, Bamburi, Mombasa. ${product.category_name}. Enquire on WhatsApp for sizes, price and availability.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: product.image_url ? { images: [product.image_url] } : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const [settings, related] = await Promise.all([getSettings(), relatedProducts(product)]);
  const chemical = product.division === "chemicals";
  const price = lowestPrice(product);

  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category_name,
    url: `${SITE_URL}/products/${product.slug}`,
    brand: { "@type": "Brand", name: "FreshWave" },
  };
  if (product.image_url) ld.image = product.image_url.startsWith("http") ? product.image_url : `${SITE_URL}${product.image_url}`;
  if (price !== null) {
    const offer: Record<string, unknown> = { "@type": "Offer", priceCurrency: "KES", price };
    if (product.availability === "in_stock") offer.availability = "https://schema.org/InStock";
    if (product.availability === "out_of_stock") offer.availability = "https://schema.org/OutOfStock";
    ld.offers = offer;
  }

  return (
    <>
      <div className="container-fw py-8 lg:py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link href="/" className="hover:text-ocean">Home</Link>
          <span className="mx-2">/</span>
          <Link href={chemical ? "/raw-chemicals" : "/detergents"} className="hover:text-ocean">
            {chemical ? "Raw Chemicals" : "Detergents"}
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/category/${product.category_slug}`} className="hover:text-ocean">{product.category_name}</Link>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="aspect-square overflow-hidden rounded-[var(--radius-card)] border border-line lg:sticky lg:top-[96px] lg:self-start">
            <ProductVisual src={product.image_url} alt={product.name} kind={product.division} priority />
          </div>

          <div>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] ${
                chemical ? "bg-ink text-ice" : "bg-mist text-ocean"
              }`}
            >
              {chemical ? <FlaskConical size={13} /> : <Home size={13} />}
              {chemical ? "Industrial chemical, raw material" : "Household cleaning product"}
            </span>
            <h1 className="mt-4 text-[28px] font-extrabold leading-tight sm:text-[36px]">{product.name}</h1>
            <p className="mt-2 text-[15px] text-muted">
              Category:{" "}
              <Link href={`/category/${product.category_slug}`} className="font-semibold text-ocean hover:text-ink">
                {product.category_name}
              </Link>
            </p>

            <p className="mt-5 leading-relaxed text-muted">{product.description}</p>

            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-[15px]">
              {chemical && (
                <>
                  <dt className="font-semibold text-navy">Chemical name</dt>
                  <dd className="text-muted">{product.name}</dd>
                </>
              )}
              {product.trade_name && (
                <>
                  <dt className="font-semibold text-navy">Common / trade name</dt>
                  <dd className="text-muted">{product.trade_name}</dd>
                </>
              )}
              {product.grade && (
                <>
                  <dt className="font-semibold text-navy">Grade</dt>
                  <dd className="text-muted">{product.grade}</dd>
                </>
              )}
              <dt className="font-semibold text-navy">Availability</dt>
              <dd className="text-muted">{AVAILABILITY_LABEL[product.availability]}</dd>
              {product.sizes.length > 0 && (
                <>
                  <dt className="font-semibold text-navy">Packaging</dt>
                  <dd className="text-muted">{product.sizes.map((s) => s.label).join(", ")}</dd>
                </>
              )}
            </dl>

            <EnquiryPanel product={product} whatsapp={settings.whatsapp} />

            {chemical && (
              <section aria-labelledby="safety-heading" className="mt-8 rounded-[var(--radius-card)] border border-line bg-mist p-5">
                <h2 id="safety-heading" className="flex items-center gap-2 text-[15px] font-bold">
                  <ShieldAlert size={18} className="text-ocean" /> Safety and handling
                </h2>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
                  <li>This is an industrial chemical. It is not a ready-to-use household product.</li>
                  <li>Read the Safety Data Sheet and the supplier label before handling, storing or transporting it.</li>
                  <li>Use the protective equipment the Safety Data Sheet recommends, and keep out of reach of children.</li>
                  <li>Do not mix chemicals unless the manufacturer&apos;s documentation says it is safe to do so.</li>
                </ul>
                {product.sds_url ? (
                  <a href={product.sds_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm mt-4">
                    <FileDown size={16} /> Download Safety Data Sheet (PDF)
                  </a>
                ) : (
                  <p className="mt-4 text-sm font-semibold text-navy">
                    Safety Data Sheet: ask us for it when you request a quotation.
                  </p>
                )}
              </section>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-mist py-12 lg:py-16">
          <div className="container-fw">
            <h2 className="text-[24px] font-extrabold">Related products</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} whatsapp={settings.whatsapp} />
              ))}
            </div>
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
    </>
  );
}
