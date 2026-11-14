import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { getCategories } from "@/lib/data";
import { deleteCategory, saveCategory } from "../../actions";

const ERRORS: Record<string, string> = {
  missing: "A category needs a name and a type.",
  image: "The image could not be used. Use a JPG, PNG or WebP under 8 MB.",
  "in-use": "This category still has products. Move or delete them first.",
};

function Fields({ c }: { c?: { name: string; description: string; division: string; sort: number; image_url: string | null } }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block"><span className="label">Name</span><input name="name" required maxLength={80} defaultValue={c?.name} className="field" /></label>
      <label className="block"><span className="label">Type</span>
        <select name="division" defaultValue={c?.division ?? "detergents"} className="field">
          <option value="detergents">Detergents (ready-made)</option>
          <option value="chemicals">Raw chemicals</option>
        </select>
      </label>
      <label className="block sm:col-span-2"><span className="label">Short description</span><input name="description" maxLength={300} defaultValue={c?.description} className="field" /></label>
      <label className="block"><span className="label">Display order</span><input name="sort" type="number" defaultValue={c?.sort ?? 0} className="field" /></label>
      <label className="block"><span className="label">Category image</span><input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="block w-full pt-2 text-sm" /></label>
      {c?.image_url && <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" name="remove_image" /> Remove current image</label>}
    </div>
  );
}

export default async function AdminCategories({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string; deleted?: string }> }) {
  const sp = await searchParams;
  const categories = await getCategories();
  return (
    <>
      <h1 className="text-2xl font-extrabold">Categories</h1>
      {sp.error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{ERRORS[sp.error] ?? "Something went wrong."}</p>}
      {(sp.saved || sp.deleted) && <p role="status" className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">{sp.saved ? "Category saved." : "Category deleted."}</p>}

      <details className="card mt-6 p-5">
        <summary className="cursor-pointer font-bold text-navy">Add a category</summary>
        <form action={saveCategory} className="mt-5 grid gap-4">
          <Fields />
          <div><button className="btn btn-primary btn-sm">Add category</button></div>
        </form>
      </details>

      <ul className="mt-6 grid gap-3">
        {categories.map((c) => (
          <li key={c.id} className="card p-5">
            <details>
              <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-ink">{c.name}</span>
                <span className="text-sm text-muted">{c.division === "chemicals" ? "Raw chemicals" : "Detergents"} · {c.product_count} products</span>
              </summary>
              <form action={saveCategory} className="mt-5 grid gap-4">
                <input type="hidden" name="id" value={c.id} />
                <Fields c={c} />
                <div><button className="btn btn-primary btn-sm">Save changes</button></div>
              </form>
              <form action={deleteCategory} className="mt-4">
                <input type="hidden" name="id" value={c.id} />
                <ConfirmButton message={`Delete the category "${c.name}"?`} className="text-sm font-semibold text-red-700 hover:underline">Delete category</ConfirmButton>
              </form>
            </details>
          </li>
        ))}
      </ul>
    </>
  );
}
