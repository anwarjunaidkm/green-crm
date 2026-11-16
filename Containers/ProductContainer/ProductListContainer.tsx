"use client";

import { useEffect, useState } from "react";
import ProductList from "@/components/Products/ProductList";
import { getStoredProducts } from "@/lib/productStorage";
import type { Product } from "@/types/product";

export default function ProductListContainer() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  return <ProductList initialProducts={products} />;
}
