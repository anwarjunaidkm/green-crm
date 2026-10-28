"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  Package,
  Plus,
  RefreshCw,
  Sparkles,
  Tag,
} from "lucide-react";

import { saveProduct } from "@/lib/productStorage";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_UNITS,
  type Product,
  type ProductStatus,
} from "@/types/product";

export default function AddProduct() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "Herbal Wellness",
    price: "",
    mrp: "",
    stock: "50",
    unit: "Bottle",
    status: "Active" as ProductStatus,
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const generateSKU = () => {
    const prefix = formData.name
      ? formData.name
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase())
          .slice(0, 3)
          .join("")
      : "GV";
    const random = Math.floor(100 + Math.random() * 900);
    setFormData((prev) => ({
      ...prev,
      sku: `${prefix || "GV"}-${random}`,
    }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = "Product name is required";
    }
    if (!formData.sku.trim()) {
      errs.sku = "SKU / Code is required";
    }
    if (!formData.price || Number(formData.price) <= 0) {
      errs.price = "Enter a valid selling price";
    }
    if (formData.mrp && Number(formData.mrp) < Number(formData.price)) {
      errs.mrp = "MRP cannot be less than selling price";
    }
    if (formData.stock === "" || Number(formData.stock) < 0) {
      errs.stock = "Stock quantity cannot be negative";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const priceNum = Number(formData.price);
    const mrpNum = formData.mrp ? Number(formData.mrp) : undefined;
    const stockNum = Number(formData.stock);

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: formData.name.trim(),
      sku: formData.sku.trim().toUpperCase(),
      category: formData.category,
      price: priceNum,
      mrp: mrpNum,
      stock: stockNum,
      unit: formData.unit,
      status: stockNum === 0 ? "Out of Stock" : formData.status,
      description: formData.description.trim(),
      createdAt: new Date().toISOString().split("T")[0],
    };

    saveProduct(newProduct);
    setIsSuccess(true);

    setTimeout(() => {
      router.push("/products");
    }, 900);
  };

  const discountPercent =
    formData.mrp && formData.price && Number(formData.mrp) > Number(formData.price)
      ? Math.round(
          ((Number(formData.mrp) - Number(formData.price)) /
            Number(formData.mrp)) *
            100
        )
      : null;

  return (
    <div className="min-h-full bg-[#f8fafc]">
      {/* ================= HEADER ================= */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[62px] max-w-[1100px] items-center justify-between px-4 sm:px-6 lg:h-[70px]">
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Back to products list"
            >
              <ArrowLeft size={19} />
            </Link>

            <div>
              <h1 className="text-[17px] font-semibold text-slate-900 sm:text-lg">
                Add New Product
              </h1>
              <p className="hidden text-xs text-slate-400 sm:block">
                Add products or services to your sales catalog
              </p>
            </div>
          </div>

          <Link
            href="/products"
            className="text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            Cancel
          </Link>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6">
        {isSuccess && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold">Product Added Successfully!</p>
              <p className="text-xs text-emerald-600">Redirecting to product directory...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
            {/* ================= LEFT COLUMN: FORM FIELDS ================= */}
            <div className="space-y-6">
              {/* SECTION 1: BASIC INFORMATION */}
              <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-[#176b32]">
                    <Package size={15} />
                  </div>
                  <h2 className="text-sm font-semibold text-slate-800">
                    1. Product Overview
                  </h2>
                </div>

                <div className="mt-5 space-y-4">
                  {/* Product Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block text-xs font-medium text-slate-700"
                    >
                      Product / Service Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="e.g. GreenVedha Herbal Hair Oil"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`h-11 w-full rounded-xl border px-3.5 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.name
                          ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200 bg-slate-50/30 focus:border-[#176b32] focus:bg-white focus:ring-[#176b32]/15"
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-[11px] font-medium text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* SKU & Category Grid */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* SKU */}
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <label
                          htmlFor="sku"
                          className="text-xs font-medium text-slate-700"
                        >
                          SKU / Item Code <span className="text-red-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={generateSKU}
                          className="flex items-center gap-1 text-[11px] font-medium text-[#176b32] hover:underline"
                        >
                          <RefreshCw size={11} /> Auto Generate
                        </button>
                      </div>
                      <input
                        id="sku"
                        name="sku"
                        type="text"
                        placeholder="e.g. GV-HHO-200"
                        value={formData.sku}
                        onChange={handleInputChange}
                        className={`h-11 w-full rounded-xl border px-3.5 text-xs text-slate-900 uppercase outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                          errors.sku
                            ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-100"
                            : "border-slate-200 bg-slate-50/30 focus:border-[#176b32] focus:bg-white focus:ring-[#176b32]/15"
                        }`}
                      />
                      {errors.sku && (
                        <p className="mt-1 text-[11px] font-medium text-red-500">
                          {errors.sku}
                        </p>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <label
                        htmlFor="category"
                        className="mb-1.5 block text-xs font-medium text-slate-700"
                      >
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3 text-xs text-slate-800 outline-none transition focus:border-[#176b32] focus:bg-white focus:ring-2 focus:ring-[#176b32]/15"
                      >
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Unit */}
                  <div>
                    <label
                      htmlFor="unit"
                      className="mb-1.5 block text-xs font-medium text-slate-700"
                    >
                      Unit of Measurement
                    </label>
                    <select
                      id="unit"
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3 text-xs text-slate-800 outline-none transition focus:border-[#176b32] focus:bg-white focus:ring-2 focus:ring-[#176b32]/15"
                    >
                      {PRODUCT_UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* SECTION 2: PRICING & INVENTORY */}
              <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <DollarSign size={15} />
                  </div>
                  <h2 className="text-sm font-semibold text-slate-800">
                    2. Pricing & Inventory
                  </h2>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Selling Price */}
                    <div>
                      <label
                        htmlFor="price"
                        className="mb-1.5 block text-xs font-medium text-slate-700"
                      >
                        Selling Price (₹ / AED) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="any"
                        placeholder="299"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={`h-11 w-full rounded-xl border px-3.5 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                          errors.price
                            ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-100"
                            : "border-slate-200 bg-slate-50/30 focus:border-[#176b32] focus:bg-white focus:ring-[#176b32]/15"
                        }`}
                      />
                      {errors.price && (
                        <p className="mt-1 text-[11px] font-medium text-red-500">
                          {errors.price}
                        </p>
                      )}
                    </div>

                    {/* MRP / Original Price */}
                    <div>
                      <label
                        htmlFor="mrp"
                        className="mb-1.5 block text-xs font-medium text-slate-700"
                      >
                        MRP / Original Price (Optional)
                      </label>
                      <input
                        id="mrp"
                        name="mrp"
                        type="number"
                        min="0"
                        step="any"
                        placeholder="399"
                        value={formData.mrp}
                        onChange={handleInputChange}
                        className={`h-11 w-full rounded-xl border px-3.5 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                          errors.mrp
                            ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-100"
                            : "border-slate-200 bg-slate-50/30 focus:border-[#176b32] focus:bg-white focus:ring-[#176b32]/15"
                        }`}
                      />
                      {errors.mrp && (
                        <p className="mt-1 text-[11px] font-medium text-red-500">
                          {errors.mrp}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Stock Quantity */}
                  <div>
                    <label
                      htmlFor="stock"
                      className="mb-1.5 block text-xs font-medium text-slate-700"
                    >
                      Initial Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      placeholder="50"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className={`h-11 w-full rounded-xl border px-3.5 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.stock
                          ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200 bg-slate-50/30 focus:border-[#176b32] focus:bg-white focus:ring-[#176b32]/15"
                      }`}
                    />
                    {errors.stock && (
                      <p className="mt-1 text-[11px] font-medium text-red-500">
                        {errors.stock}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* SECTION 3: DESCRIPTION */}
              <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                    <Tag size={15} />
                  </div>
                  <h2 className="text-sm font-semibold text-slate-800">
                    3. Description & Details
                  </h2>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="description"
                    className="mb-1.5 block text-xs font-medium text-slate-700"
                  >
                    Product Description / Features
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Describe benefits, ingredients, usage instructions, or package details..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/30 p-3.5 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#176b32] focus:bg-white focus:ring-2 focus:ring-[#176b32]/15"
                  />
                </div>
              </section>
            </div>

            {/* ================= RIGHT COLUMN: STATUS & PREVIEW ================= */}
            <div className="space-y-6">
              {/* STATUS CARD */}
              <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Publication Status
                </h3>

                <div className="mt-3.5 space-y-2">
                  {(["Active", "Draft", "Out of Stock"] as ProductStatus[]).map(
                    (st) => (
                      <label
                        key={st}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition select-none ${
                          formData.status === st
                            ? "border-[#176b32] bg-[#f4faf5] text-[#16391f]"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-xs font-medium">{st}</span>
                        <input
                          type="radio"
                          name="status"
                          value={st}
                          checked={formData.status === st}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-[#176b32] focus:ring-[#176b32]"
                        />
                      </label>
                    )
                  )}
                </div>
              </section>

              {/* LIVE CATALOG PREVIEW CARD */}
              <div className="rounded-2xl border border-[#dceade] bg-[#f4faf5] p-5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#176b32]">
                  <Sparkles size={14} /> Live Catalog Preview
                </div>

                <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-[#176b32]">
                      {formData.category || "General"}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                        formData.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : formData.status === "Draft"
                          ? "bg-slate-100 text-slate-700"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {formData.status}
                    </span>
                  </div>

                  <h4 className="mt-2 text-sm font-semibold text-slate-900 line-clamp-1">
                    {formData.name.trim() || "Untitled Product"}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-400">
                    SKU: {formData.sku.trim().toUpperCase() || "GV-XXX-000"}
                  </p>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-base font-bold text-[#176b32]">
                      ₹{formData.price || "0"}
                    </span>
                    {formData.mrp && Number(formData.mrp) > Number(formData.price) && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{formData.mrp}
                      </span>
                    )}
                    {discountPercent && (
                      <span className="rounded bg-red-100 px-1.5 py-0.2 text-[10px] font-semibold text-red-700">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                    <span>Unit: {formData.unit}</span>
                    <span>Stock: {formData.stock || "0"} in stock</span>
                  </div>
                </div>
              </div>

              {/* DESKTOP SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className="hidden h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#176b32] text-xs font-semibold text-white shadow-sm transition hover:bg-[#125727] active:scale-[0.99] disabled:opacity-50 lg:flex"
              >
                <Plus size={16} />
                {isSubmitting ? "Saving Product..." : "Save Product"}
              </button>
            </div>
          </div>

          {/* MOBILE SUBMIT BUTTON */}
          <div className="block pt-2 lg:hidden">
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#176b32] text-xs font-semibold text-white shadow-sm transition hover:bg-[#125727] active:scale-[0.99] disabled:opacity-50"
            >
              <Plus size={16} />
              {isSubmitting ? "Saving Product..." : "Save Product"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
