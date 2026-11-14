import Link from "next/link";
import { Clock, ExternalLink, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { SHOP, type Settings } from "@/lib/shared";

/* Shop location with a live, interactive Google Map (iframe embed, no API key). */
export function LocationSection({
  settings,
  whatsappHref,
  headingLevel = "h2",
  tall = false,
}: {
  settings: Settings;
  whatsappHref: string | null;
  headingLevel?: "h1" | "h2";
  tall?: boolean;
}) {
  const Heading = headingLevel;
  const mapHeight = tall ? "h-[380px] sm:h-[460px] lg:h-full lg:min-h-[560px]" : "h-[340px] sm:h-[420px] lg:h-full lg:min-h-[480px]";
  return (
    <section id="find-us" aria-labelledby="find-us-heading" className="scroll-mt-[88px] bg-mist py-16 lg:py-20">
      <div className="container-fw grid gap-8 lg:grid-cols-[1fr_1.35fr] lg:gap-12">
        <div className="flex flex-col">
          <p className="eyebrow">Find our shop</p>
          <Heading id="find-us-heading" className="mt-3 text-[28px] font-extrabold leading-tight sm:text-[36px]">
            Find FreshWave. We&apos;re Here in Bamburi.
          </Heading>
          <p className="mt-4 max-w-md leading-relaxed text-muted">
            Visit FreshWave Detergents &amp; Chemicals for quality cleaning products and chemical supplies. Find our
            physical shop in Bamburi, Mombasa.
          </p>

          <address className="mt-7 space-y-4 not-italic">
            <div className="flex gap-4">
              <MapPin size={20} className="mt-0.5 shrink-0 text-ocean" />
              <div>
                <p className="font-bold text-ink">{SHOP.name}</p>
                <p className="text-muted">{SHOP.area}</p>
                <p className="mt-1 text-[13px] tabular-nums text-muted">
                  Coordinates: {SHOP.lat}, {SHOP.lng}
                </p>
              </div>
            </div>
            {settings.phone && (
              <div className="flex gap-4">
                <Phone size={20} className="mt-0.5 shrink-0 text-ocean" />
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="text-muted hover:text-ocean">{settings.phone}</a>
              </div>
            )}
            {settings.email && (
              <div className="flex gap-4">
                <Mail size={20} className="mt-0.5 shrink-0 text-ocean" />
                <a href={`mailto:${settings.email}`} className="text-muted hover:text-ocean">{settings.email}</a>
              </div>
            )}
            {settings.hours && (
              <div className="flex gap-4">
                <Clock size={20} className="mt-0.5 shrink-0 text-ocean" />
                <p className="whitespace-pre-line text-muted">{settings.hours}</p>
              </div>
            )}
          </address>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={SHOP.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <Navigation size={17} /> Get Directions
            </a>
            {whatsappHref ? (
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <MessageCircle size={17} /> WhatsApp Contact
              </a>
            ) : (
              <Link href="/contact" className="btn btn-outline">
                <MessageCircle size={17} /> Contact Us
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <div className={`relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[0_18px_40px_-28px_rgba(1,28,64,0.45)] ${mapHeight}`}>
            <iframe
              title="Interactive Google Map showing the FreshWave Detergents & Chemicals shop in Bamburi, Mombasa"
              src={SHOP.embedUrl}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          <p className="mt-3 text-sm text-muted">
            Map not loading?{" "}
            <a href={SHOP.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-ocean underline underline-offset-4 hover:text-ink">
              Open the shop location in Google Maps <ExternalLink size={13} />
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
