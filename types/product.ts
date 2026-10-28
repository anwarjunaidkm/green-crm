export type ProductStatus = "Active" | "Out of Stock" | "Draft" | "Archived";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  mrp?: number;
  stock: number;
  unit: string;
  status: ProductStatus;
  description?: string;
  createdAt: string;
}

export const PRODUCT_CATEGORIES = [
  "Herbal Wellness",
  "Ayurvedic Medicines",
  "Personal Care",
  "Health Supplements",
  "Immunity & Nutrition",
  "Organic Products",
  "Software & Services",
  "Other",
] as const;

export const PRODUCT_UNITS = [
  "Bottle",
  "Box",
  "Pack",
  "Piece",
  "Kg",
  "Gram",
  "Litre",
  "Ml",
  "Unit",
] as const;

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "GreenVedha Herbal Hair Vitalizer",
    sku: "GV-HHV-200",
    category: "Personal Care",
    price: 349,
    mrp: 499,
    stock: 120,
    unit: "Bottle",
    status: "Active",
    description: "Natural herbal formula enriched with Bhringraj, Amla and Brahmi for strong hair roots.",
    createdAt: "2026-10-15",
  },
  {
    id: "prod-2",
    name: "Ayurvedic Immunity Booster Kadha",
    sku: "GV-IBK-100",
    category: "Herbal Wellness",
    price: 249,
    mrp: 320,
    stock: 85,
    unit: "Pack",
    status: "Active",
    description: "Traditional 15-herb decoction blend for daily immune defense and respiratory health.",
    createdAt: "2026-10-18",
  },
  {
    id: "prod-3",
    name: "Organic Pure Aloe Vera Gel",
    sku: "GV-AVG-250",
    category: "Personal Care",
    price: 199,
    mrp: 260,
    stock: 45,
    unit: "Bottle",
    status: "Active",
    description: "99% pure cold-pressed aloe vera gel for deep skin hydration and soothing care.",
    createdAt: "2026-10-20",
  },
  {
    id: "prod-4",
    name: "Digestive Wellness Triphala Churna",
    sku: "GV-DWT-150",
    category: "Ayurvedic Medicines",
    price: 180,
    mrp: 220,
    stock: 0,
    unit: "Box",
    status: "Out of Stock",
    description: "Certified organic Triphala powder for healthy colon cleanse and natural digestion.",
    createdAt: "2026-10-22",
  },
  {
    id: "prod-5",
    name: "GreenVedha CRM Annual Plan",
    sku: "GV-CRM-ANNUAL",
    category: "Software & Services",
    price: 1499,
    mrp: 1999,
    stock: 999,
    unit: "Unit",
    status: "Active",
    description: "All-in-one lead management, staff tracking, and follow-up CRM package for sales teams.",
    createdAt: "2026-10-25",
  },
];
