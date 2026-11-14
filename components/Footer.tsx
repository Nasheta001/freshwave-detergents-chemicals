import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { SHOP, type Category, type Settings } from "@/lib/shared";

export function Footer({
  settings,
  categories,
  whatsappHref,
}: {
  settings: Settings;
  categories: Category[];
  whatsappHref: string | null;
}) {
  const detergents = categories.filter((c) => c.division === "detergents");
  const socials = [
    { label: "Facebook", href: settings.facebook },
    { label: "Instagram", href: settings.instagram },
    { label: "TikTok", href: settings.tiktok },
  ].filter((s) => /^https?:\/\//.test(s.href));

  return (
    <footer className="bg-ink text-white/75">
      <div className="container-fw grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            Cleaning products, household detergents and chemical raw materials, supplied from Bamburi, Mombasa.
          </p>
          {socials.length > 0 && (
            <ul className="mt-5 flex gap-4 text-sm font-semibold">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-ice hover:text-white">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Product categories">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-white">Categories</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {detergents.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/raw-chemicals" className="hover:text-white">
                Chemical Raw Materials
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Quick links">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-white">Quick links</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["/products", "Shop Products"],
              ["/detergents", "Detergents"],
              ["/raw-chemicals", "Raw Chemicals"],
              ["/wholesale", "Wholesale Quote"],
              ["/basket", "Enquiry Basket"],
              ["/contact#find-us", "Find Our Shop"],
              ["/about", "About Us"],
              ["/contact", "Contact"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-white">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin size={17} className="mt-0.5 shrink-0 text-teal" />
              <a href={SHOP.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white" aria-label={`${SHOP.area}. Open shop location in Google Maps`}>
                {SHOP.area}
              </a>
            </li>
            {settings.phone && (
              <li className="flex gap-3">
                <Phone size={17} className="mt-0.5 shrink-0 text-teal" />
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li className="flex gap-3">
                <Mail size={17} className="mt-0.5 shrink-0 text-teal" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </li>
            )}
            <li className="flex gap-3">
              <MessageCircle size={17} className="mt-0.5 shrink-0 text-teal" />
              {whatsappHref ? (
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Order on WhatsApp
                </a>
              ) : (
                <Link href="/contact" className="hover:text-white">
                  Send us an enquiry
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-fw flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} FreshWave Detergents &amp; Chemicals. All rights reserved.</p>
          <ul className="flex gap-5">
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white">
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
