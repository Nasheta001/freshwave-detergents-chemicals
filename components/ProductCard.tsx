import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { formatKes, lowestPrice, whatsappUrl, type Product } from "@/lib/shared";
import { ProductVisual } from "./ProductVisual";
import { QuickAdd } from "./QuickAdd";

export function ProductCard({ product, whatsapp }: { product: Product; whatsapp: string }) {
  const price = lowestPrice(product);
  const chemical = product.division === "chemicals";
  const wa = whatsappUrl(
    whatsapp,
    `Hello FreshWave, I would like to enquire about: ${product.name}. Please share available sizes and pricing.`,
  );
  return (
    <article className="group card flex flex-col overflow-hidden transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-teal/60 hover:shadow-[0_18px_40px_-24px_rgba(1,28,64,0.45)]">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden" tabIndex={-1} aria-hidden="true">
        <ProductVisual src={product.image_url} alt={product.name} kind={product.division} className="transition-transform duration-500 group-hover:scale-[1.03]" />
        {chemical && (
          <span className="absolute right-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-ice">
            Raw material
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ocean">{product.category_name}</p>
        <h3 className="mt-1.5 text-[16px] font-bold leading-snug">
          <Link href={`/products/${product.slug}`} className="hover:text-ocean">
            {product.name}
          </Link>
        </h3>
        {product.sizes.length > 0 && (
          <p className="mt-1.5 text-[13px] text-muted">Sizes: {product.sizes.map((s) => s.label).join(", ")}</p>
        )}
        {price !== null && <p className="mt-2 text-[15px] font-bold text-ink">From {formatKes(price)}</p>}
        <div className="mt-auto flex items-center gap-2 pt-4">
          <Link href={`/products/${product.slug}`} className="btn btn-outline btn-sm flex-1">
            View Details
          </Link>
          <QuickAdd
            item={{ slug: product.slug, name: product.name, category: product.category_name, division: product.division }}
          />
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Enquire about ${product.name} on WhatsApp`}
              title="Enquire on WhatsApp"
              className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full border border-line text-navy transition-colors hover:border-ocean hover:bg-mist"
            >
              <MessageCircle size={17} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
