import type { Metadata } from "next";
import { CatalogueView } from "@/components/CatalogueView";

export const metadata: Metadata = {
  title: "Chemical Raw Materials in Kenya | Soap-Making & Cleaning Chemicals",
  description:
    "Chemical raw materials in Kenya for detergent and soap making: surfactants, alkalis, acids, bleaching agents, thickeners, preservatives, fragrances and solvents.",
  alternates: { canonical: "/raw-chemicals" },
};

export default function RawChemicalsPage() {
  return (
    <CatalogueView
      title="Chemical Raw Materials"
      intro="Ingredients and raw materials for detergent production, soap manufacturing, cleaning formulations and industrial use."
      division="chemicals"
    />
  );
}
