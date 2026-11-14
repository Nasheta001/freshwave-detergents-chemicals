"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useBasket, type BasketItem } from "./basket";

export function QuickAdd({ item }: { item: Pick<BasketItem, "slug" | "name" | "category" | "division"> }) {
  const { add } = useBasket();
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={`Add ${item.name} to enquiry basket`}
      title="Add to enquiry basket"
      onClick={() => {
        add({ ...item, size: "", option: "", qty: 1 });
        setDone(true);
        window.setTimeout(() => setDone(false), 1600);
      }}
      className={`grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full border transition-colors ${
        done ? "border-teal bg-teal text-ink" : "border-line text-navy hover:border-ocean hover:bg-mist"
      }`}
    >
      {done ? <Check size={17} /> : <Plus size={17} />}
      <span className="sr-only" aria-live="polite">
        {done ? "Added to basket" : ""}
      </span>
    </button>
  );
}
