"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, FileText, MessageCircle, Minus, Plus, ShoppingBasket } from "lucide-react";
import { formatKes, whatsappUrl, type Product } from "@/lib/shared";
import { useBasket } from "./basket";

export function EnquiryPanel({ product, whatsapp }: { product: Product; whatsapp: string }) {
  const { add } = useBasket();
  const hasSizes = product.sizes.length > 0;
  const [size, setSize] = useState(hasSizes ? product.sizes[0].label : "");
  const [option, setOption] = useState(product.options[0] ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const chemical = product.division === "chemicals";
  const selected = product.sizes.find((s) => s.label === size);

  const detail = [option, size].filter(Boolean).join(", ");
  const wa = whatsappUrl(
    whatsapp,
    `Hello FreshWave, I would like to enquire about:\n- ${product.name}${detail ? ` (${detail})` : ""} x ${qty}\n\nPlease confirm price and availability.`,
  );

  return (
    <div className="mt-7 grid gap-5 border-t border-line pt-7">
      {product.options.length > 0 && (
        <div>
          <label className="label" htmlFor="ep-option">{product.options_label || "Option"}</label>
          <select id="ep-option" className="field" value={option} onChange={(e) => setOption(e.target.value)}>
            {product.options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        {hasSizes ? (
          <fieldset>
            <legend className="label">Packaging size</legend>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={size === s.label}
                  onClick={() => setSize(s.label)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    size === s.label ? "border-navy bg-navy text-white" : "border-line text-navy hover:border-ocean"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            {selected?.price != null && (
              <p className="mt-4 text-2xl font-extrabold text-ink">{formatKes(selected.price)}</p>
            )}
          </fieldset>
        ) : (
          <>
            <label className="label" htmlFor="ep-size">Size or pack you need (optional)</label>
            <input
              id="ep-size"
              className="field"
              value={size}
              maxLength={60}
              onChange={(e) => setSize(e.target.value)}
              placeholder={chemical ? "For example 25 kg" : "For example 5 litres"}
            />
            <p className="mt-2 text-[13px] text-muted">Ask us for the packaging sizes and current price.</p>
          </>
        )}
      </div>

      <div>
        <span className="label" id="ep-qty-label">Quantity</span>
        <div className="inline-flex items-center rounded-full border border-line" role="group" aria-labelledby="ep-qty-label">
          <button type="button" aria-label="Decrease quantity" className="grid h-11 w-11 place-items-center text-navy hover:text-ocean" onClick={() => setQty((v) => Math.max(1, v - 1))}>
            <Minus size={16} />
          </button>
          <input
            aria-labelledby="ep-qty-label"
            inputMode="numeric"
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(9999, parseInt(e.target.value.replace(/\D/g, ""), 10) || 1)))}
            className="w-14 bg-transparent text-center font-semibold outline-none"
          />
          <button type="button" aria-label="Increase quantity" className="grid h-11 w-11 place-items-center text-navy hover:text-ocean" onClick={() => setQty((v) => Math.min(9999, v + 1))}>
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            add({ slug: product.slug, name: product.name, category: product.category_name, division: product.division, size: size.trim(), option, qty });
            setAdded(true);
            window.setTimeout(() => setAdded(false), 2500);
          }}
        >
          {added ? <Check size={17} /> : <ShoppingBasket size={17} />}
          {added ? "Added to basket" : "Add to Enquiry Basket"}
        </button>
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            <MessageCircle size={17} /> Enquire on WhatsApp
          </a>
        )}
        {(chemical || !wa) && (
          <Link href={`/wholesale?product=${product.slug}`} className="btn btn-outline">
            <FileText size={17} /> Request a Quotation
          </Link>
        )}
      </div>
      <p aria-live="polite" className="text-sm text-muted">
        {added ? (
          <>
            Added. <Link href="/basket" className="font-semibold text-ocean underline underline-offset-4">View your enquiry basket</Link>
          </>
        ) : (
          "Sending an enquiry does not place or confirm an order."
        )}
      </p>
    </div>
  );
}
