"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  Package,
  Plus,
  RefreshCw,
  Sparkles,
  Tag,
} from "lucide-react";

import { useCreateProduct, useProductFilters } from "@/hooks/useProducts";
import type { ProductFiltersData } from "@/types/product";

interface ProductFormData {
  name: string;
  item_code: string;
  category_id: string | number;
  unit_id: string | number;
  selling_price: string;
  mrp: string;
  initial_stock: string;
  description: string;
  status: number | string;
}

const initialFormData: ProductFormData = {
  name: "",
  item_code: "",
  category_id: "",
  unit_id: "",
  selling_price: "",
  mrp: "",
  initial_stock: "0",
  description: "",
  status: 1, // Default Active
};

export default function AddProduct() {
  const router = useRouter();

  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. Fetch dynamic product filters (categories, units, statuses)
  const { data: filtersData, isLoading: isLoadingFilters } =
    useProductFilters();
  const filters: ProductFiltersData = filtersData || {
    product_units: [],
    product_categories: [],
    product_status: [],
  };

  // 2. React Query mutation for creating product
  const createProductMutation = useCreateProduct();
  const isSubmitting = createProductMutation.isPending;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name] || errors.form) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        delete next.form;
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
    const random = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({
      ...prev,
      item_code: `${prefix || "GV"}-${random}`,
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.item_code;
      return next;
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = "Product name is required";
    }
    if (!formData.item_code.trim()) {
      errs.item_code = "SKU / Item code is required";
    }
    // Category & Unit of measurement are optional
    if (!formData.selling_price || Number(formData.selling_price) <= 0) {
      errs.selling_price = "Enter a valid selling price";
    }
    if (formData.mrp && Number(formData.mrp) < Number(formData.selling_price)) {
      errs.mrp = "MRP cannot be less than selling price";
    }
    if (formData.initial_stock !== "" && Number(formData.initial_stock) < 0) {
      errs.initial_stock = "Stock quantity cannot be negative";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setErrors({});

    try {
      await createProductMutation.mutateAsync({
        name: formData.name.trim(),
        item_code: formData.item_code.trim().toUpperCase(),
        category_id: formData.category_id
          ? Number(formData.category_id)
          : undefined,
        unit_id: formData.unit_id ? Number(formData.unit_id) : undefined,
        selling_price: Number(formData.selling_price),
        mrp: formData.mrp ? Number(formData.mrp) : null,
        initial_stock:
          formData.initial_stock !== "" ? Number(formData.initial_stock) : 0,
        description: formData.description.trim() || undefined,
        status: Number(formData.status),
      });

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/products");
      }, 800);
    } catch (err: unknown) {
      const errorObj = err as {
        response?: {
          data?: {
            message?: string;
            errors?: Record<string, string[]>;
          };
        };
        message?: string;
      };

      const backendErrors = errorObj.response?.data?.errors;
      if (backendErrors && typeof backendErrors === "object") {
        const mappedErrors: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(backendErrors)) {
          if (Array.isArray(msgs) && msgs.length > 0) {
            mappedErrors[key] = msgs[0];
          }
        }
        const firstMessage =
          errorObj.response?.data?.message ||
          Object.values(backendErrors).flat()[0] ||
          "Validation failed. Please verify the input fields.";
        mappedErrors.form = firstMessage;
        setErrors(mappedErrors);
      } else {
        const errorMsg =
          errorObj.response?.data?.message ||
          errorObj.message ||
          "Failed to create product. Please check details and try again.";
        setErrors({ form: errorMsg });
      }
    }
  };

  const discountPercent =
    formData.mrp &&
    formData.selling_price &&
    Number(formData.mrp) > Number(formData.selling_price)
      ? Math.round(
          ((Number(formData.mrp) - Number(formData.selling_price)) /
            Number(formData.mrp)) *
            100,
        )
      : null;

  const selectedCategoryName = formData.category_id
    ? filters.product_categories.find(
        (c) => String(c.id) === String(formData.category_id),
      )?.name ||
      filters.product_categories.find(
        (c) => String(c.id) === String(formData.category_id),
      )?.category_name ||
      "General"
    : "General";

  const selectedUnitName = formData.unit_id
    ? filters.product_units.find(
        (u) => String(u.id) === String(formData.unit_id),
      )?.name ||
      filters.product_units.find(
        (u) => String(u.id) === String(formData.unit_id),
      )?.unit_name ||
      filters.product_units.find(
        (u) => String(u.id) === String(formData.unit_id),
      )?.short_name ||
      "-"
    : "-";

  const selectedStatusName =
    filters.product_status.find(
      (s) => Number(s.value ?? s.id) === Number(formData.status),
    )?.name || "Active";

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
        {/* SUCCESS MESSAGE */}
        {isSuccess && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold">
                Product Added Successfully!
              </p>
              <p className="text-xs text-emerald-600">
                Redirecting to product directory...
              </p>
            </div>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {errors.form && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
            <AlertCircle size={20} className="shrink-0 text-red-600" />
            <div>
              <p className="text-sm font-semibold">Failed to save product</p>
              <p className="text-xs text-red-600">{errors.form}</p>
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
                      Product / Service Name{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="e.g. GreenVedha Herbal Hair Vitalizer"
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
                    {/* Item Code / SKU */}
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <label
                          htmlFor="item_code"
                          className="text-xs font-medium text-slate-700"
                        >
                          Item Code / SKU{" "}
                          <span className="text-red-500">*</span>
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
                        id="item_code"
                        name="item_code"
                        type="text"
                        placeholder="e.g. GV-0009"
                        value={formData.item_code}
                        onChange={handleInputChange}
                        className={`h-11 w-full rounded-xl border px-3.5 text-xs text-slate-900 uppercase outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                          errors.item_code
                            ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-100"
                            : "border-slate-200 bg-slate-50/30 focus:border-[#176b32] focus:bg-white focus:ring-[#176b32]/15"
                        }`}
                      />
                      {errors.item_code && (
                        <p className="mt-1 text-[11px] font-medium text-red-500">
                          {errors.item_code}
                        </p>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <label
                        htmlFor="category_id"
                        className="mb-1.5 block text-xs font-medium text-slate-700"
                      >
                        Category (Optional)
                      </label>
                      <select
                        id="category_id"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        disabled={isLoadingFilters}
                        className={`h-11 w-full rounded-xl border px-3 text-xs text-slate-800 outline-none transition focus:border-[#176b32] focus:bg-white focus:ring-2 focus:ring-[#176b32]/15 ${
                          errors.category_id
                            ? "border-red-300 bg-red-50/30"
                            : "border-slate-200 bg-slate-50/30"
                        }`}
                      >
                        <option value="">
                          {isLoadingFilters
                            ? "Loading categories..."
                            : filters.product_categories.length === 0
                              ? "No categories available"
                              : "Select category (Optional)"}
                        </option>
                        {filters.product_categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name || cat.category_name}
                          </option>
                        ))}
                      </select>
                      {errors.category_id && (
                        <p className="mt-1 text-[11px] font-medium text-red-500">
                          {errors.category_id}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Unit */}
                  <div>
                    <label
                      htmlFor="unit_id"
                      className="mb-1.5 block text-xs font-medium text-slate-700"
                    >
                      Unit of Measurement (Optional)
                    </label>
                    <select
                      id="unit_id"
                      name="unit_id"
                      value={formData.unit_id}
                      onChange={handleInputChange}
                      disabled={isLoadingFilters}
                      className={`h-11 w-full rounded-xl border px-3 text-xs text-slate-800 outline-none transition focus:border-[#176b32] focus:bg-white focus:ring-2 focus:ring-[#176b32]/15 ${
                        errors.unit_id
                          ? "border-red-300 bg-red-50/30"
                          : "border-slate-200 bg-slate-50/30"
                      }`}
                    >
                      <option value="">
                        {isLoadingFilters
                          ? "Loading units..."
                          : filters.product_units.length === 0
                            ? "No units available"
                            : "Select unit (Optional)"}
                      </option>
                      {filters.product_units.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name || u.unit_name || u.short_name || u.code}
                        </option>
                      ))}
                    </select>
                    {errors.unit_id && (
                      <p className="mt-1 text-[11px] font-medium text-red-500">
                        {errors.unit_id}
                      </p>
                    )}
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
                        htmlFor="selling_price"
                        className="mb-1.5 block text-xs font-medium text-slate-700"
                      >
                        Selling Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="selling_price"
                        name="selling_price"
                        type="number"
                        min="0"
                        step="any"
                        placeholder="499"
                        value={formData.selling_price}
                        onChange={handleInputChange}
                        className={`h-11 w-full rounded-xl border px-3.5 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                          errors.selling_price
                            ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-100"
                            : "border-slate-200 bg-slate-50/30 focus:border-[#176b32] focus:bg-white focus:ring-[#176b32]/15"
                        }`}
                      />
                      {errors.selling_price && (
                        <p className="mt-1 text-[11px] font-medium text-red-500">
                          {errors.selling_price}
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
                        placeholder="599"
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

                  {/* Initial Stock Quantity */}
                  <div>
                    <label
                      htmlFor="initial_stock"
                      className="mb-1.5 block text-xs font-medium text-slate-700"
                    >
                      Initial Stock Quantity{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="initial_stock"
                      name="initial_stock"
                      type="number"
                      min="0"
                      placeholder="150"
                      value={formData.initial_stock}
                      onChange={handleInputChange}
                      className={`h-11 w-full rounded-xl border px-3.5 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.initial_stock
                          ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200 bg-slate-50/30 focus:border-[#176b32] focus:bg-white focus:ring-[#176b32]/15"
                      }`}
                    />
                    {errors.initial_stock && (
                      <p className="mt-1 text-[11px] font-medium text-red-500">
                        {errors.initial_stock}
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
                    placeholder="Pure herbal ashwagandha extracts..."
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
                  {isLoadingFilters && filters.product_status.length === 0 ? (
                    <p className="py-2 text-center text-xs text-slate-400">
                      Loading statuses...
                    </p>
                  ) : filters.product_status.length === 0 ? (
                    <p className="py-2 text-center text-xs text-slate-400">
                      No statuses available
                    </p>
                  ) : (
                    filters.product_status.map((st) => {
                      const stVal = st.value ?? st.id;
                      const isSelected =
                        Number(formData.status) === Number(stVal);

                      return (
                        <label
                          key={st.id}
                          className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition select-none ${
                            isSelected
                              ? "border-[#176b32] bg-[#f4faf5] text-[#16391f]"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-xs font-medium">{st.name}</span>
                          <input
                            type="radio"
                            name="status"
                            value={stVal}
                            checked={isSelected}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                status: Number(e.target.value),
                              }))
                            }
                            className="h-4 w-4 text-[#176b32] focus:ring-[#176b32]"
                          />
                        </label>
                      );
                    })
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
                      {selectedCategoryName}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                        selectedStatusName.toLowerCase() === "active"
                          ? "bg-emerald-100 text-emerald-800"
                          : selectedStatusName.toLowerCase() === "draft"
                            ? "bg-slate-100 text-slate-700"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedStatusName}
                    </span>
                  </div>

                  <h4 className="mt-2 text-sm font-semibold text-slate-900 line-clamp-1">
                    {formData.name.trim() || "Untitled Product"}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-400">
                    SKU: {formData.item_code.trim().toUpperCase() || "GV-XXXX"}
                  </p>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-base font-bold text-[#176b32]">
                      {formData.selling_price || "0"}
                    </span>
                    {formData.mrp &&
                      Number(formData.mrp) > Number(formData.selling_price) && (
                        <span className="text-xs text-slate-400 line-through">
                          {formData.mrp}
                        </span>
                      )}
                    {discountPercent && (
                      <span className="rounded bg-red-100 px-1.5 py-0.2 text-[10px] font-semibold text-red-700">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                    <span>Unit: {selectedUnitName}</span>
                    <span>Stock: {formData.initial_stock || "0"} in stock</span>
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
