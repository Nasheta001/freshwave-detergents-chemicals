import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { q } from "@/lib/db";
import { deleteEnquiry, setEnquiryStatus } from "../../actions";

const KIND: Record<string, string> = { basket: "Basket enquiry", wholesale: "Wholesale quote", contact: "Contact message" };
const STATUS: Record<string, string> = { new: "New", in_progress: "In progress", closed: "Closed" };

export default async function AdminEnquiries({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const valid = status && status in STATUS ? status : null;
  const rows = await q(
    `SELECT * FROM enquiries ${valid ? "WHERE status = $1" : ""} ORDER BY created_at DESC LIMIT 200`,
    valid ? [valid] : [],
  );
  return (
    <>
      <h1 className="text-2xl font-extrabold">Enquiries</h1>
      <p className="mt-2 text-sm text-muted">Enquiries sent from the basket, the wholesale form and the contact form. Basket enquiries sent through WhatsApp are also copied here.</p>
      <nav className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
        {[["", "All"], ...Object.entries(STATUS)].map(([value, label]) => (
          <a key={value} href={value ? `/admin/enquiries?status=${value}` : "/admin/enquiries"} className={`rounded-full border px-4 py-1.5 ${(valid ?? "") === value ? "border-navy bg-navy text-white" : "border-line bg-white text-navy"}`}>{label}</a>
        ))}
      </nav>
      {rows.length === 0 ? (
        <p className="card mt-5 p-8 text-center text-sm text-muted">No enquiries here yet.</p>
      ) : (
        <ul className="mt-5 grid gap-4">
          {rows.map((e) => {
            const items: { name: string; size?: string; option?: string; qty: number }[] = typeof e.items === "string" ? JSON.parse(e.items) : e.items ?? [];
            return (
              <li key={e.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-ocean">{KIND[e.kind]}</p>
                    <p className="mt-1 font-bold text-ink">{e.name || "No name given"}{e.business ? `, ${e.business}` : ""}</p>
                    <p className="mt-0.5 text-sm text-muted">
                      {[e.phone, e.email].filter(Boolean).join(" · ") || "No contact details"} · {new Date(e.created_at).toLocaleString("en-KE", { timeZone: "Africa/Nairobi" })}
                    </p>
                  </div>
                  <form action={setEnquiryStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={e.id} />
                    <select name="status" defaultValue={e.status} aria-label="Status" className="field !h-10 w-[150px]">
                      {Object.entries(STATUS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <button className="btn btn-outline btn-sm">Update</button>
                  </form>
                </div>
                {items.length > 0 && (
                  <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-navy">
                    {items.map((i, n) => <li key={n}>{i.name}{[i.option, i.size].filter(Boolean).length ? ` (${[i.option, i.size].filter(Boolean).join(", ")})` : ""} x {i.qty}</li>)}
                  </ul>
                )}
                {e.message && <p className="mt-4 whitespace-pre-line rounded-lg bg-mist p-3 text-sm text-navy">{e.message}</p>}
                <form action={deleteEnquiry} className="mt-4">
                  <input type="hidden" name="id" value={e.id} />
                  <ConfirmButton message="Delete this enquiry? This cannot be undone." className="text-sm font-semibold text-red-700 hover:underline">Delete</ConfirmButton>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
