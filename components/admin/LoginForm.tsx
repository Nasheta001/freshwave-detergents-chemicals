"use client";

import { useState, useTransition } from "react";
import { login } from "@/app/admin/actions";

export function LoginForm() {
  const [pending, start] = useTransition();
  const [state, setState] = useState<{ error: string } | undefined>();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // submit by hand so the fields keep their values after an error
    const data = new FormData(e.currentTarget);
    start(async () => setState(await login(undefined, data)));
  };
  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4">
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="field" />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="field" />
      </div>
      {state?.error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{state.error}</p>}
      <button className="btn btn-primary" disabled={pending}>{pending ? "Signing in..." : "Sign in"}</button>
    </form>
  );
}
