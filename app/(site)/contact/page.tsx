import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { LocationSection } from "@/components/LocationSection";
import { EnquiryForm } from "@/components/EnquiryForm";
import { SHOP, getSettings, whatsappUrl } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact FreshWave | Cleaning Products in Bamburi, Mombasa",
  description: "Contact FreshWave Detergents & Chemicals in Bamburi, Mombasa. Order on WhatsApp or send us an enquiry.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSettings();
  const wa = whatsappUrl(settings.whatsapp, "Hello FreshWave, I would like to make an enquiry.");
  const rows = [
    wa && { icon: MessageCircle, label: "WhatsApp ordering", value: "Start a chat with FreshWave", href: wa, external: true },
    settings.phone && { icon: Phone, label: "Phone", value: settings.phone, href: `tel:${settings.phone.replace(/[^\d+]/g, "")}` },
    settings.email && { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { icon: MapPin, label: "Shop location", value: SHOP.area, href: SHOP.mapUrl, external: true },
    settings.hours && { icon: Clock, label: "Opening hours", value: settings.hours },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href?: string; external?: boolean }[];

  return (
    <>
      <section className="container-fw grid gap-10 py-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:py-16">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 text-[30px] font-extrabold leading-tight sm:text-[38px]">Get in touch with FreshWave</h1>
          <p className="mt-4 max-w-md leading-relaxed text-muted">
            Ask about a product, a bulk order or availability. Send us a message and we will get back to you.
          </p>
          <ul className="mt-8 space-y-5">
            {rows.map((r) => (
              <li key={r.label} className="flex gap-4">
                <r.icon size={20} className="mt-0.5 shrink-0 text-ocean" />
                <div>
                  <p className="font-bold text-ink">{r.label}</p>
                  {r.href ? (
                    <a href={r.href} target={r.external ? "_blank" : undefined} rel={r.external ? "noopener noreferrer" : undefined} className="text-muted hover:text-ocean">
                      {r.value}
                    </a>
                  ) : (
                    <p className="whitespace-pre-line text-muted">{r.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <EnquiryForm kind="contact" submitLabel="Send message" />
      </section>
      <LocationSection settings={settings} whatsappHref={wa} tall />
    </>
  );
}
