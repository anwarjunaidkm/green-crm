import type { Product } from "@/types/product";

export const PRODUCT_STORAGE_KEY = "greenvedha_products";

export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(PRODUCT_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }

    return [];
  } catch (err) {
    console.error("Failed to load products from localStorage:", err);
    return [];
  }
}

export function saveProduct(product: Product): Product[] {
  if (typeof window === "undefined") {
    return [product];
  }

  try {
    const currentList = getStoredProducts();
    const updatedList = [product, ...currentList];
    window.localStorage.setItem(
      PRODUCT_STORAGE_KEY,
      JSON.stringify(updatedList)
    );
    return updatedList;
  } catch (err) {
    console.error("Failed to save product:", err);
    return [];
  }
}

export function updateProduct(
  id: string,
  updates: Partial<Product>
): Product[] {
  if (typeof window === "undefined") return [];

  try {
    const currentList = getStoredProducts();
    const updatedList = currentList.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    window.localStorage.setItem(
      PRODUCT_STORAGE_KEY,
      JSON.stringify(updatedList)
    );
    return updatedList;
  } catch (err) {
    console.error("Failed to update product:", err);
    return [];
  }
}

export function deleteProduct(id: string): Product[] {
  if (typeof window === "undefined") return [];

  try {
    const currentList = getStoredProducts();
    const updatedList = currentList.filter((item) => item.id !== id);
    window.localStorage.setItem(
      PRODUCT_STORAGE_KEY,
      JSON.stringify(updatedList)
    );
    return updatedList;
  } catch (err) {
    console.error("Failed to delete product:", err);
    return [];
  }
}
