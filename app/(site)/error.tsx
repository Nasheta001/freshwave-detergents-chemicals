"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="container-fw py-24 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-3 text-3xl font-extrabold">This page could not be loaded.</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">Please try again. If the problem continues, contact us directly.</p>
      <button type="button" onClick={reset} className="btn btn-primary mt-8">
        Try again
      </button>
    </section>
  );
}
