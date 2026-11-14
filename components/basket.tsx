"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type BasketItem = {
  key: string;
  slug: string;
  name: string;
  category: string;
  division: "detergents" | "chemicals";
  size: string;
  option: string;
  qty: number;
};

type BasketApi = {
  items: BasketItem[];
  count: number;
  ready: boolean;
  add: (item: Omit<BasketItem, "key">) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const Ctx = createContext<BasketApi | null>(null);
const STORAGE_KEY = "freshwave-enquiry-basket";

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* storage unavailable: basket lives in memory only */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready]);

  const add = useCallback((item: Omit<BasketItem, "key">) => {
    const key = [item.slug, item.size, item.option].join("|");
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) return prev.map((i) => (i.key === key ? { ...i, qty: Math.min(9999, i.qty + item.qty) } : i));
      return [...prev, { ...item, key }];
    });
  }, []);
  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(9999, qty || 1)) } : i)));
  }, []);
  const remove = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, count: items.length, ready, add, setQty, remove, clear }),
    [items, ready, add, setQty, remove, clear],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBasket(): BasketApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBasket must be used inside BasketProvider");
  return ctx;
}
