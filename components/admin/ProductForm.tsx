"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { saveProduct } from "@/app/admin/actions";
import type { Category, Product } from "@/lib/shared";

export function ProductForm({ product, categories }: { product: Product | null; categories: Category[] }) {
  const [pending, start] = useTransition();
  const [state, setState] = useState<{ error: string } | undefined>();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // submit by hand so the fields keep their values after an error
    const data = new FormData(e.currentTarget);
    start(async () => setState(await saveProduct(undefined, data)));
  };
  const sizes = product?.sizes.map((s) => (s.price === null ? s.label : `${s.label} | ${s.price}`)).join("\n") ?? "";
  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-6">
      {product && <input type="hidden" name="id" value={product.id} />}
      <fieldset className="card grid gap-5 p-6">
        <legend className="sr-only">Basic details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">Product name</label>
            <input id="name" name="name" required maxLength={160} defaultValue={product?.name} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="category_id">Category</label>
            <select id="category_id" name="category_id" required defaultValue={product?.category_id ?? ""} className="field">
              <option value="" disabled>Choose a category</option>
              <optgroup label="Detergents">
                {categories.filter((c) => c.division === "detergents").map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </optgroup>
              <optgroup label="Raw chemicals">
                {categories.filter((c) => c.division === "chemicals").map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </optgroup>
            </select>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={4} maxLength={4000} defaultValue={product?.description} className="field" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="availability">Stock availability</label>
            <select id="availability" name="availability" defaultValue={product?.availability ?? "unconfirmed"} className="field">
              <option value="unconfirmed">Not set (shows "Ask for availability")</option>
              <option value="in_stock">In stock</option>
              <option value="out_of_stock">Out of stock</option>
              <option value="on_request">Available on request</option>
            </select>
          </div>
          <label className="flex items-center gap-3 self-end pb-3 text-sm font-semibold text-navy">
            <input type="checkbox" name="featured" defaultChecked={product?.featured} className="h-5 w-5 accent-[#023859]" />
            Show in Featured Products on the homepage
          </label>
        </div>
      </fieldset>

      <fieldset className="card grid gap-5 p-6">
        <legend className="sr-only">Sizes and prices</legend>
        <div>
          <label className="label" htmlFor="sizes">Packaging sizes and prices</label>
          <textarea id="sizes" name="sizes" rows={4} defaultValue={sizes} className="field font-mono" placeholder={"500 ml | 120\n5 L | 850\n20 L"} />
          <p className="mt-2 text-[13px] text-muted">One size per line. Add the price in KES after a | sign. Leave the price out if it is not fixed.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="options_label">Choice name (optional)</label>
            <input id="options_label" name="options_label" maxLength={40} defaultValue={product?.options_label ?? ""} placeholder="For example Fragrance or Colour" className="field" />
          </div>
          <div>
            <label className="label" htmlFor="options">Choices (comma separated)</label>
            <input id="options" name="options" maxLength={1000} defaultValue={product?.options.join(", ")} placeholder="Lemon, Lavender, Pine" className="field" />
          </div>
        </div>
      </fieldset>

      <fieldset className="card grid gap-5 p-6">
        <legend className="sr-only">Chemical information</legend>
        <p className="text-sm font-bold text-ink">Chemical information (raw materials only)</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="trade_name">Common / trade name</label>
            <input id="trade_name" name="trade_name" maxLength={160} defaultValue={product?.trade_name ?? ""} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="grade">Grade (only if verified)</label>
            <input id="grade" name="grade" maxLength={120} defaultValue={product?.grade ?? ""} className="field" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="sds">Safety Data Sheet (PDF)</label>
          <input id="sds" name="sds" type="file" accept="application/pdf" className="block w-full text-sm" />
          {product?.sds_url && (
            <p className="mt-2 flex flex-wrap items-center gap-4 text-sm">
              <a href={product.sds_url} target="_blank" className="font-semibold text-ocean underline">View current SDS</a>
              <label className="flex items-center gap-2 text-muted"><input type="checkbox" name="remove_sds" /> Remove SDS</label>
            </p>
          )}
        </div>
      </fieldset>

      <fieldset className="card grid gap-4 p-6">
        <legend className="sr-only">Photo</legend>
        <label className="label !mb-0" htmlFor="image">Product photo (JPG, PNG or WebP, up to 8 MB)</label>
        {product?.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt="" className="h-32 w-32 rounded-lg border border-line object-cover" />
        )}
        <input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-sm" />
        {product?.image_url && (
          <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" name="remove_image" /> Remove photo</label>
        )}
        <p className="text-[13px] text-muted">Use your own photos or photos you have permission to use.</p>
      </fieldset>

      {product && (
        <div className="card p-6">
          <label className="label" htmlFor="slug">Web address</label>
          <input id="slug" name="slug" maxLength={80} defaultValue={product.slug} className="field font-mono" />
          <p className="mt-2 text-[13px] text-muted">Changing this changes the product link. Leave it alone unless you need to.</p>
        </div>
      )}

      {state?.error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{state.error}</p>}
      <div className="flex gap-3">
        <button className="btn btn-primary" disabled={pending}>{pending ? "Saving..." : "Save product"}</button>
        <Link href="/admin/products" className="btn btn-outline">Cancel</Link>
      </div>
    </form>
  );
}
