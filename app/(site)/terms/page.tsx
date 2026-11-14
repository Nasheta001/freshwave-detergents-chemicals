import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & Conditions", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <section className="container-fw max-w-3xl py-12 lg:py-16">
      <h1 className="text-[30px] font-extrabold sm:text-[36px]">Terms &amp; Conditions</h1>
      <div className="prose-fw mt-6">
        <h2>Enquiries are not orders</h2>
        <p>Adding products to the enquiry basket or sending a WhatsApp message is a request for information. An order is only confirmed when FreshWave has agreed the products, quantities, price and payment with you directly.</p>
        <h2>Prices and availability</h2>
        <p>Prices and stock can change. Where a price is shown on the site, please confirm it with us before paying. Where no price is shown, ask us for a quotation.</p>
        <h2>Product information</h2>
        <p>Product descriptions are a general guide. Always read the product label before use.</p>
        <h2>Chemical raw materials</h2>
        <p>Raw materials are industrial chemicals intended for people who know how to handle them. Request the Safety Data Sheet, follow the label and use suitable protective equipment. The buyer is responsible for safe storage, handling and use, and for following the law.</p>
        <h2>Contact</h2>
        <p>If you have a question about these terms, use the contact page to reach us.</p>
      </div>
    </section>
  );
}
