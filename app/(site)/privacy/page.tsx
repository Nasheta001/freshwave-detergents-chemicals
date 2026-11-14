import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <section className="container-fw max-w-3xl py-12 lg:py-16">
      <h1 className="text-[30px] font-extrabold sm:text-[36px]">Privacy Policy</h1>
      <div className="prose-fw mt-6">
        <p>This page explains what information FreshWave Detergents &amp; Chemicals collects through this website and how it is used.</p>
        <h2>Information we collect</h2>
        <p>When you send an enquiry or request a quote, we receive the details you enter: your name, phone number, email address, business name, your message and the products in your enquiry basket.</p>
        <h2>How we use it</h2>
        <p>We use these details only to reply to your enquiry, prepare quotations and arrange supply. We do not sell your information.</p>
        <h2>Your enquiry basket</h2>
        <p>The basket is saved in your own browser so it is still there when you return. You can clear it at any time from the basket page.</p>
        <h2>WhatsApp and maps</h2>
        <p>If you choose to send an enquiry on WhatsApp, your message is sent through WhatsApp and their terms apply. Maps on this site are provided by Google Maps.</p>
        <h2>Your choices</h2>
        <p>You can ask us to correct or delete the details you have sent us. Use the contact page to reach us.</p>
      </div>
    </section>
  );
}
