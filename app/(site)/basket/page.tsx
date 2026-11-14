import type { Metadata } from "next";
import { BasketView } from "@/components/BasketView";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Enquiry Basket",
  robots: { index: false },
};

export default async function BasketPage() {
  const settings = await getSettings();
  return (
    <section className="container-fw py-10 lg:py-14">
      <p className="eyebrow">Enquiry basket</p>
      <h1 className="mt-2 text-[30px] font-extrabold sm:text-[36px]">Review and send your enquiry</h1>
      <div className="mt-8">
        <BasketView whatsapp={settings.whatsapp} />
      </div>
    </section>
  );
}
