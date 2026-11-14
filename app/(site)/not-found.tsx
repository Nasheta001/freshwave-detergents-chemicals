import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-fw py-24 text-center">
      <p className="eyebrow">Page not found</p>
      <h1 className="mt-3 text-3xl font-extrabold">We could not find that page.</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">The product or page may have moved. Browse the full catalogue instead.</p>
      <Link href="/products" className="btn btn-primary mt-8">
        Shop Products
      </Link>
    </section>
  );
}
