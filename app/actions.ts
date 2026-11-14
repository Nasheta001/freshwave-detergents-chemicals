"use server";

import { headers } from "next/headers";
import { q } from "@/lib/db";
import { rateLimited } from "@/lib/auth";

export type EnquiryInput = {
  kind: "basket" | "wholesale" | "contact";
  name?: string;
  phone?: string;
  email?: string;
  business?: string;
  message?: string;
  items?: { name: string; size?: string; option?: string; qty?: number }[];
};

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, max) : "";

export async function submitEnquiry(input: EnquiryInput): Promise<{ ok: boolean; error?: string }> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(`enquiry:${ip}`, 12, 10 * 60 * 1000)) {
    return { ok: false, error: "Too many enquiries in a short time. Please try again in a few minutes." };
  }
  if (!input || !["basket", "wholesale", "contact"].includes(input.kind)) {
    return { ok: false, error: "Invalid enquiry." };
  }
  const name = clean(input.name, 120);
  const phone = clean(input.phone, 40);
  const email = clean(input.email, 160);
  const business = clean(input.business, 160);
  const message = clean(input.message, 2000);
  const items = Array.isArray(input.items)
    ? input.items.slice(0, 100).map((i) => ({
        name: clean(i?.name, 160),
        size: clean(i?.size, 80),
        option: clean(i?.option, 80),
        qty: Math.max(1, Math.min(9999, Math.floor(Number(i?.qty) || 1))),
      })).filter((i) => i.name)
    : [];

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Please check the email address." };
  if (input.kind === "basket" && items.length === 0) return { ok: false, error: "Your enquiry basket is empty." };
  if (input.kind !== "basket" && (!name || (!phone && !email))) {
    return { ok: false, error: "Please add your name and a phone number or email so we can reply." };
  }

  try {
    await q(
      `INSERT INTO enquiries (kind,name,phone,email,business,message,items) VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb)`,
      [input.kind, name || null, phone || null, email || null, business || null, message || null, JSON.stringify(items)],
    );
    return { ok: true };
  } catch (err) {
    console.error("[freshwave] enquiry failed", err);
    return { ok: false, error: "We could not save your enquiry. Please try again." };
  }
}
