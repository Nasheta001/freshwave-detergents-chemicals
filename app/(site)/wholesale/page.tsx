import type { Metadata } from "next";
import { EnquiryForm } from "@/components/EnquiryForm";
import { getProduct } from "@/lib/data";

export const metadata: Metadata = {
  title: "Wholesale Detergents & Cleaning Chemicals in Mombasa",
  description:
    "Request a wholesale quote for detergents, laundry chemicals and raw materials. FreshWave supplies hotels, laundromats, schools, hospitals and manufacturers.",
  alternates: { canonical: "/wholesale" },
};

export default async function WholesalePage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const { product } = await searchParams;
  const found = typeof product === "string" ? await getProduct(product.slice(0, 100)) : null;
  return (
    <section className="container-fw grid gap-10 py-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:py-16">
      <div>
        <p className="eyebrow">Wholesale &amp; business supply</p>
        <h1 className="mt-3 text-[30px] font-extrabold leading-tight sm:text-[38px]">Request a Wholesale Quote</h1>
        <p className="mt-4 max-w-md leading-relaxed text-muted">
          Tell us what you need and in what quantities. We will reply with pricing and availability for bulk orders and
          regular business supply.
        </p>
        <ul className="mt-8 space-y-3 text-[15px] text-navy">
          {["Bulk orders of detergents and cleaning products", "Chemical raw materials for manufacturers", "Regular supply for hotels, laundromats, schools and hospitals"].map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
              {t}
            </li>
          ))}
        </ul>
      </div>
      <EnquiryForm
        kind="wholesale"
        submitLabel="Request quote"
        defaultMessage={found ? `Please send me a quotation for: ${found.name}\nQuantity: ` : ""}
      />
    </section>
  );
}
