"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, MessageCircle, Minus, Plus, Send, ShoppingBasket, Trash2 } from "lucide-react";
import { submitEnquiry } from "@/app/actions";
import { whatsappUrl } from "@/lib/shared";
import { useBasket } from "./basket";

export function BasketView({ whatsapp }: { whatsapp: string }) {
  const { items, ready, setQty, remove, clear } = useBasket();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "whatsapp" | "saved">("idle");
  const [error, setError] = useState("");

  const message = useMemo(() => {
    const lines = items.map((i, n) => {
      const detail = [i.option, i.size].filter(Boolean).join(", ");
      return `${n + 1}. ${i.name}${detail ? ` (${detail})` : ""} - Qty: ${i.qty}`;
    });
    return [
      "Hello FreshWave, I would like to enquire about these products:",
      "",
      ...lines,
      "",
      name.trim() ? `Name: ${name.trim()}` : "",
      note.trim() ? `Note: ${note.trim()}` : "",
      "Please confirm price and availability.",
    ]
      .filter((l, i, a) => l !== "" || (a[i - 1] !== "" && i !== a.length - 1))
      .join("\n");
  }, [items, name, note]);

  const wa = whatsappUrl(whatsapp, message);
  const payload = () => ({
    kind: "basket" as const,
    name,
    phone,
    message: note,
    items: items.map((i) => ({ name: i.name, size: i.size, option: i.option, qty: i.qty })),
  });

  if (!ready) return <div className="h-64 animate-pulse rounded-[var(--radius-card)] bg-mist" aria-busy="true" />;

  if (state === "whatsapp" || state === "saved") {
    return (
      <div className="card mx-auto max-w-xl p-8 text-center" role="status">
        <CheckCircle2 size={38} className="mx-auto text-teal" />
        <h2 className="mt-4 text-xl font-bold">
          {state === "whatsapp" ? "Your enquiry is ready in WhatsApp" : "Enquiry received"}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-muted">
          {state === "whatsapp"
            ? "Press send in WhatsApp to deliver it to FreshWave. "
            : "FreshWave will contact you on the number you gave. "}
          This is an enquiry only. Nothing has been ordered or paid for until FreshWave confirms with you.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {state === "whatsapp" && wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
              Open WhatsApp again
            </a>
          )}
          <button type="button" className="btn btn-outline btn-sm" onClick={() => { clear(); setState("idle"); }}>
            Clear basket
          </button>
          <Link href="/products" className="btn btn-primary btn-sm">Continue browsing</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-line px-6 py-16 text-center">
        <ShoppingBasket size={34} className="mx-auto text-ocean" />
        <h2 className="mt-4 text-xl font-bold">Your enquiry basket is empty</h2>
        <p className="mx-auto mt-2 max-w-sm text-muted">Add products from the catalogue, then send them to us in one WhatsApp message.</p>
        <Link href="/products" className="btn btn-primary mt-6">Shop Products</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
      <div>
        <ul className="divide-y divide-line border-y border-line">
          {items.map((i) => (
            <li key={i.key} className="flex flex-wrap items-center gap-4 py-4">
              <div className="min-w-0 flex-1 basis-56">
                <Link href={`/products/${i.slug}`} className="font-bold text-ink hover:text-ocean">{i.name}</Link>
                <p className="mt-0.5 text-sm text-muted">
                  {[i.category, i.option, i.size].filter(Boolean).join(" · ")}
                  {!i.size && " · size to be confirmed"}
                </p>
              </div>
              <div className="inline-flex items-center rounded-full border border-line" role="group" aria-label={`Quantity of ${i.name}`}>
                <button type="button" aria-label="Decrease quantity" className="grid h-10 w-10 place-items-center text-navy hover:text-ocean" onClick={() => setQty(i.key, i.qty - 1)}>
                  <Minus size={15} />
                </button>
                <input
                  aria-label="Quantity"
                  inputMode="numeric"
                  value={i.qty}
                  onChange={(e) => setQty(i.key, parseInt(e.target.value.replace(/\D/g, ""), 10))}
                  className="w-12 bg-transparent text-center text-sm font-semibold outline-none"
                />
                <button type="button" aria-label="Increase quantity" className="grid h-10 w-10 place-items-center text-navy hover:text-ocean" onClick={() => setQty(i.key, i.qty + 1)}>
                  <Plus size={15} />
                </button>
              </div>
              <button type="button" aria-label={`Remove ${i.name}`} className="grid h-10 w-10 place-items-center rounded-full text-muted hover:bg-mist hover:text-red-700" onClick={() => remove(i.key)}>
                <Trash2 size={17} />
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between text-sm">
          <Link href="/products" className="font-semibold text-ocean hover:text-ink">Add more products</Link>
          <button type="button" className="font-semibold text-muted hover:text-red-700" onClick={clear}>Clear basket</button>
        </div>
      </div>

      <aside className="card h-fit p-6">
        <h2 className="text-lg font-bold">Send your enquiry</h2>
        <p className="mt-1 text-sm text-muted">
          {items.length} {items.length === 1 ? "product" : "products"}. We will confirm prices and availability.
        </p>
        <div className="mt-5 grid gap-4">
          <div>
            <label className="label" htmlFor="bk-name">Your name {wa ? "(optional)" : ""}</label>
            <input id="bk-name" className="field" value={name} maxLength={120} autoComplete="name" onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="bk-phone">Phone number {wa ? "(optional)" : ""}</label>
            <input id="bk-phone" type="tel" className="field" value={phone} maxLength={40} autoComplete="tel" onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="bk-note">Note (optional)</label>
            <textarea id="bk-note" rows={3} className="field" value={note} maxLength={600} onChange={(e) => setNote(e.target.value)} placeholder="Delivery area, preferred pack sizes, anything else" />
          </div>
        </div>

        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error}</p>}

        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-5 w-full"
            onClick={() => {
              void submitEnquiry(payload()); // keep a copy for FreshWave; the WhatsApp link opens regardless
              setState("whatsapp");
            }}
          >
            <MessageCircle size={17} /> Request via WhatsApp
          </a>
        ) : (
          <button
            type="button"
            className="btn btn-primary mt-5 w-full"
            disabled={state === "sending"}
            onClick={async () => {
              setError("");
              if (!name.trim() || !phone.trim()) {
                setError("Please add your name and phone number so we can reply.");
                return;
              }
              setState("sending");
              const res = await submitEnquiry(payload());
              if (res.ok) setState("saved");
              else {
                setError(res.error || "Something went wrong.");
                setState("idle");
              }
            }}
          >
            <Send size={16} /> {state === "sending" ? "Sending..." : "Send enquiry"}
          </button>
        )}
        <p className="mt-3 text-xs leading-relaxed text-muted">
          This sends an enquiry. It does not place, confirm or pay for an order.
        </p>

        {wa && (
          <details className="mt-4 text-sm">
            <summary className="cursor-pointer font-semibold text-ocean">Preview message</summary>
            <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-mist p-3 font-sans text-[13px] leading-relaxed text-navy">{message}</pre>
          </details>
        )}
      </aside>
    </div>
  );
}
