import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { currentAdmin } from "@/lib/auth";
import { q } from "@/lib/db";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await currentAdmin()) redirect("/admin");
  const admins = await q("SELECT count(*)::int AS n FROM admins");
  return (
    <main className="grid min-h-screen place-items-center bg-mist px-5">
      <div className="card w-full max-w-sm p-8">
        <Logo />
        <h1 className="mt-6 text-xl font-bold">Admin sign in</h1>
        {admins[0].n === 0 ? (
          <p className="mt-4 rounded-lg bg-mist p-4 text-sm leading-relaxed text-navy">
            No admin account exists yet. Set <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code> in the site
            environment, then restart the site. The account is created on start.
          </p>
        ) : (
          <LoginForm />
        )}
      </div>
    </main>
  );
}
