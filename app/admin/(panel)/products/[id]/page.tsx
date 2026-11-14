import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories, getProductById } from "@/lib/data";
import { deleteProduct } from "../../../actions";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(Number(id) || 0);
  if (!product) notFound();
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Edit product</h1>
        <Link href={`/products/${product.slug}`} target="_blank" className="text-sm font-semibold text-ocean hover:text-ink">View on website</Link>
      </div>
      <ProductForm product={product} categories={await getCategories()} />
      <form action={deleteProduct} className="mt-10 border-t border-line pt-6">
        <input type="hidden" name="id" value={product.id} />
        <ConfirmButton message={`Delete "${product.name}"? This cannot be undone.`} className="text-sm font-semibold text-red-700 hover:underline">
          Delete this product
        </ConfirmButton>
      </form>
    </>
  );
}
