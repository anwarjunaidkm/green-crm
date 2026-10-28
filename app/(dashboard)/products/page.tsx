import ProductListContainer from "@/Containers/ProductContainer/ProductListContainer";

export const metadata = {
  title: "Products Catalog | GreenVedha CRM",
  description: "Manage products, pricing, categories and inventory levels",
};

export default function ProductsPage() {
  return <ProductListContainer />;
}
