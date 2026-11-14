import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { BasketProvider } from "@/components/basket";
import { getCategories, getSettings, SHOP, SITE_URL, whatsappUrl } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);
  const wa = whatsappUrl(settings.whatsapp, "Hello FreshWave, I would like to make an enquiry.");

  const business: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "FreshWave Detergents & Chemicals",
    url: SITE_URL,
    description: "Supplier of cleaning products, household detergents and chemical raw materials.",
    address: { "@type": "PostalAddress", addressLocality: "Bamburi, Mombasa", addressCountry: "KE" },
    areaServed: "Kenya",
    geo: { "@type": "GeoCoordinates", latitude: SHOP.lat, longitude: SHOP.lng },
    hasMap: SHOP.mapUrl,
  };
  if (settings.phone) business.telephone = settings.phone;
  if (settings.email) business.email = settings.email;
  if (settings.hours) business.openingHours = settings.hours;

  return (
    <BasketProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-navy"
      >
        Skip to content
      </a>
      <Header whatsappHref={wa} />
      <main id="main" className="pt-[72px]">
        {children}
      </main>
      <Footer settings={settings} categories={categories} whatsappHref={wa} />
      <WhatsAppFloat whatsappHref={wa} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(business).replace(/</g, "\\u003c") }}
      />
    </BasketProvider>
  );
}
