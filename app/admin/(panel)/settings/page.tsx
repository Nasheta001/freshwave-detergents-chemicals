import { getSettings } from "@/lib/data";
import { saveSettings } from "../../actions";

export default async function AdminSettings({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, s] = await Promise.all([searchParams, getSettings()]);
  const field = (name: keyof typeof s, label: string, hint?: string, type = "text") => (
    <label className="block">
      <span className="label">{label}</span>
      <input name={name} type={type} defaultValue={s[name]} maxLength={500} className="field" />
      {hint && <span className="mt-1.5 block text-[13px] text-muted">{hint}</span>}
    </label>
  );
  return (
    <>
      <h1 className="text-2xl font-extrabold">Business details</h1>
      <p className="mt-2 text-sm text-muted">Only details you enter here are shown on the website. Empty fields stay hidden.</p>
      {saved && <p role="status" className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">Details saved.</p>}
      <form action={saveSettings} className="card mt-6 grid gap-5 p-6 sm:grid-cols-2">
        {field("whatsapp", "WhatsApp number", "With country code, for example 254712345678. All WhatsApp buttons use this number.", "tel")}
        {field("phone", "Phone number", undefined, "tel")}
        {field("email", "Email address", undefined, "email")}
        {field("address", "Shop location", "The map and directions use the fixed shop coordinates.")}
        <label className="block sm:col-span-2">
          <span className="label">Opening hours</span>
          <textarea name="hours" rows={3} defaultValue={s.hours} maxLength={500} className="field" placeholder={"Monday to Saturday: 8am to 6pm\nSunday: closed"} />
        </label>
        {field("facebook", "Facebook link", "Full link starting with https://", "url")}
        {field("instagram", "Instagram link", "Full link starting with https://", "url")}
        {field("tiktok", "TikTok link", "Full link starting with https://", "url")}
        <div className="sm:col-span-2"><button className="btn btn-primary">Save details</button></div>
      </form>
    </>
  );
}
