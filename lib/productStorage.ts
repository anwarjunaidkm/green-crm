import { DEFAULT_PRODUCTS, type Product } from "@/types/product";

export const PRODUCT_STORAGE_KEY = "greenvedha_products";

export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") {
    return DEFAULT_PRODUCTS;
  }

  try {
    const raw = window.localStorage.getItem(PRODUCT_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(
        PRODUCT_STORAGE_KEY,
        JSON.stringify(DEFAULT_PRODUCTS)
      );
      return DEFAULT_PRODUCTS;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }

    return DEFAULT_PRODUCTS;
  } catch (err) {
    console.error("Failed to load products from localStorage:", err);
    return DEFAULT_PRODUCTS;
  }
}

export function saveProduct(product: Product): Product[] {
  if (typeof window === "undefined") {
    return [product, ...DEFAULT_PRODUCTS];
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
    return DEFAULT_PRODUCTS;
  }
}

export function updateProduct(
  id: string,
  updates: Partial<Product>
): Product[] {
  if (typeof window === "undefined") return DEFAULT_PRODUCTS;

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
    return DEFAULT_PRODUCTS;
  }
}

export function deleteProduct(id: string): Product[] {
  if (typeof window === "undefined") return DEFAULT_PRODUCTS;

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
    return DEFAULT_PRODUCTS;
  }
}
