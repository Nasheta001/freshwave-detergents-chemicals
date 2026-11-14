import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/data";

export default async function NewProduct() {
  return (
    <>
      <h1 className="text-2xl font-extrabold">Add product</h1>
      <ProductForm product={null} categories={await getCategories()} />
    </>
  );
}
