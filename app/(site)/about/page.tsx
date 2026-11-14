import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "About FreshWave",
  description:
    "FreshWave Detergents & Chemicals is a supplier of cleaning products, detergents and chemical raw materials based in Bamburi, Mombasa.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const categories = await getCategories();
  return (
    <>
      <section className="border-b border-line bg-mist">
        <div className="container-fw py-12 lg:py-16">
          <p className="eyebrow">About us</p>
          <h1 className="mt-3 max-w-2xl text-[30px] font-extrabold leading-tight sm:text-[40px]">
            Cleaning products and raw materials, supplied from Bamburi, Mombasa.
          </h1>
        </div>
      </section>
      <section className="container-fw grid gap-12 py-12 lg:grid-cols-[1.3fr_1fr] lg:py-16">
        <div className="space-y-5 text-[17px] leading-relaxed text-muted">
          <p className="text-body">
            FreshWave Detergents &amp; Chemicals supplies quality cleaning products, household detergents and chemical
            raw materials.
          </p>
          <p>
            We serve households, businesses, manufacturers, hotels, cleaning companies and institutions. Whether you
            need a few items for the home or regular supply for a business, you can order from one place.
          </p>
          <p>
            Our range has two sides. The first is ready-made products for laundry, kitchens, bathrooms, floors, personal
            care and car care. The second is the raw materials used in detergent production, soap manufacturing and
            cleaning formulations.
          </p>
          <p>
            You can browse the catalogue, add items to an enquiry basket and send your request to us on WhatsApp. We
            confirm pricing and availability with you directly.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/products" className="btn btn-primary">Shop Products</Link>
            <Link href="/contact" className="btn btn-outline">Contact us</Link>
          </div>
        </div>
        <div className="card h-fit p-6">
          <h2 className="text-[15px] font-bold">Our product range</h2>
          <ul className="mt-4 divide-y divide-line text-[15px]">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="flex items-center justify-between py-2.5 text-navy hover:text-ocean">
                  <span>{c.name}</span>
                  <span className="text-xs text-muted">{c.division === "chemicals" ? "Raw materials" : "Detergents"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
