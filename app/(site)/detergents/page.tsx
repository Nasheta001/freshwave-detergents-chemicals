import type { Metadata } from "next";
import { CatalogueView } from "@/components/CatalogueView";

export const metadata: Metadata = {
  title: "Detergents in Mombasa | Wholesale & Retail",
  description:
    "Ready-made detergents and cleaning products in Mombasa: laundry, kitchen, bathroom, floor care, personal care, car care and institutional cleaning.",
  alternates: { canonical: "/detergents" },
};

export default function DetergentsPage() {
  return (
    <CatalogueView
      title="Detergents & Cleaning Products"
      intro="Ready-made products for laundry, kitchens, bathrooms, floors, personal care, car care and institutions."
      division="detergents"
    />
  );
}
