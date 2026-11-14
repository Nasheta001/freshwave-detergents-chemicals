"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitEnquiry } from "@/app/actions";

export function EnquiryForm({
  kind,
  defaultMessage = "",
  submitLabel = "Send enquiry",
}: {
  kind: "wholesale" | "contact";
  defaultMessage?: string;
  submitLabel?: string;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="card p-8 text-center" role="status">
        <CheckCircle2 size={36} className="mx-auto text-teal" />
        <h2 className="mt-4 text-xl font-bold">Enquiry received</h2>
        <p className="mx-auto mt-2 max-w-sm text-muted">
          Thank you. FreshWave will contact you using the details you gave. This is an enquiry, not a confirmed order.
        </p>
      </div>
    );
  }

  return (
    <form
      className="card grid gap-5 p-6 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        if (f.get("website")) return; // spam trap
        setError("");
        start(async () => {
          const type = String(f.get("business_type") || "");
          const business = [String(f.get("business") || ""), type].filter(Boolean).join(" - ");
          const res = await submitEnquiry({
            kind,
            name: String(f.get("name") || ""),
            phone: String(f.get("phone") || ""),
            email: String(f.get("email") || ""),
            business,
            message: String(f.get("message") || ""),
          });
          if (res.ok) setSent(true);
          else setError(res.error || "Something went wrong.");
        });
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="ef-name">Your name</label>
          <input id="ef-name" name="name" required maxLength={120} autoComplete="name" className="field" />
        </div>
        <div>
          <label className="label" htmlFor="ef-phone">Phone or WhatsApp number</label>
          <input id="ef-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className="field" />
        </div>
        <div>
          <label className="label" htmlFor="ef-email">Email (optional)</label>
          <input id="ef-email" name="email" type="email" maxLength={160} autoComplete="email" className="field" />
        </div>
        {kind === "wholesale" && (
          <>
            <div>
              <label className="label" htmlFor="ef-business">Business name</label>
              <input id="ef-business" name="business" maxLength={120} autoComplete="organization" className="field" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="ef-type">Type of business</label>
              <select id="ef-type" name="business_type" className="field" defaultValue="">
                <option value="">Select one</option>
                {["Hotel", "Laundromat", "Cleaning company", "School", "Hospital", "Restaurant", "Detergent manufacturer", "Commercial cleaning business", "Other"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
      <div>
        <label className="label" htmlFor="ef-message">
          {kind === "wholesale" ? "Products and quantities you need" : "Your message"}
        </label>
        <textarea id="ef-message" name="message" rows={5} maxLength={2000} required defaultValue={defaultMessage} className="field" />
      </div>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {error}
        </p>
      )}
      <div>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Sending..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
