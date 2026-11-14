"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";

export function WhatsAppFloat({ whatsappHref }: { whatsappHref: string | null }) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 1800);
    return () => clearTimeout(t);
  }, []);

  if (!whatsappHref || dismissed) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="relative w-[260px] rounded-2xl border border-line bg-white p-4 pr-8 shadow-[0_20px_44px_-18px_rgba(1,28,64,0.35)]">
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => {
              setOpen(false);
              setDismissed(true);
            }}
            className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full text-muted hover:bg-mist hover:text-navy"
          >
            <X size={14} />
          </button>
          <p className="text-[14px] font-bold text-navy">Chat with FreshWave</p>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">Ask questions or order custom batches.</p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm mt-3 w-full justify-center"
          >
            <MessageCircle size={15} /> Start chat
          </a>
        </div>
      )}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with FreshWave on WhatsApp"
        onClick={() => setOpen(false)}
        className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_14px_30px_-10px_rgba(37,211,102,0.65)] transition-transform hover:scale-105"
      >
        <MessageCircle size={26} fill="white" className="text-[#25D366]" />
      </a>
    </div>
  );
}
