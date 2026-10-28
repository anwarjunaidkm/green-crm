"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Package,
  Pencil,
  Search,
  ShoppingCart,
  Tag,
  Trash2,
} from "lucide-react";

import { deleteProduct } from "@/lib/productStorage";
import type { Product, ProductStatus } from "@/types/product";

interface ProductListProps {
  initialProducts: Product[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "All" | "Active" | "In Stock" | "Out of Stock"
  >("All");

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const updated = deleteProduct(id);
      setProducts(updated);
    }
  };

  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "Active") return prod.status === "Active";
    if (activeFilter === "In Stock") return prod.stock > 0;
    if (activeFilter === "Out of Stock")
      return prod.stock === 0 || prod.status === "Out of Stock";

    return true;
  });

  const totalCount = products.length;
  const inStockCount = products.filter((p) => p.stock > 0).length;
  const outOfStockCount = products.filter(
    (p) => p.stock === 0 || p.status === "Out of Stock"
  ).length;
  const uniqueCategories = new Set(products.map((p) => p.category)).size;

  return (
    <div className="min-h-full bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        {/* ================= HEADER ================= */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-semibold tracking-[-0.3px] text-slate-900 sm:text-[24px]">
              Product Catalog
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-[#176b32]">
              Admin
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Manage your product catalog, pricing, SKU codes, and inventory levels
          </p>
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
          <StatCard
            label="Total Products"
            value={totalCount}
            icon={Package}
            color="bg-emerald-100 text-[#176b32]"
          />
          <StatCard
            label="In Stock"
            value={inStockCount}
            icon={CheckCircle2}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            label="Out of Stock"
            value={outOfStockCount}
            icon={AlertTriangle}
            color="bg-amber-100 text-amber-600"
          />
          <StatCard
            label="Categories"
            value={uniqueCategories}
            icon={Boxes}
            color="bg-violet-100 text-violet-600"
          />
        </div>

        {/* ================= SEARCH & FILTERS ================= */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* SEARCH */}
          <div className="relative w-full max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by product name, SKU, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#176b32] focus:ring-2 focus:ring-[#176b32]/15"
            />
          </div>

          {/* FILTER PILLS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(["All", "Active", "In Stock", "Out of Stock"] as const).map(
              (filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-medium transition ${
                    activeFilter === filter
                      ? "bg-[#176b32] text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {filter}
                </button>
              )
            )}
          </div>
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold text-slate-500">
                <th className="px-5 py-3.5">Product Details</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Price / MRP</th>
                <th className="px-5 py-3.5">Inventory</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date Added</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-slate-400"
                  >
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr
                    key={prod.id}
                    className="transition hover:bg-slate-50/60"
                  >
                    {/* PRODUCT NAME & SKU */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-semibold text-[#176b32]">
                          <Package size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {prod.name}
                          </p>
                          <p className="truncate text-[11px] font-mono text-slate-400">
                            SKU: {prod.sku}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-5 py-3.5">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                        {prod.category}
                      </span>
                    </td>

                    {/* PRICE & MRP */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-semibold text-slate-900">
                          ₹{prod.price}
                        </span>
                        {prod.mrp && prod.mrp > prod.price && (
                          <span className="text-[11px] text-slate-400 line-through">
                            ₹{prod.mrp}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* STOCK & UNIT */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            prod.stock > 20
                              ? "bg-emerald-500"
                              : prod.stock > 0
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span className="font-medium text-slate-800">
                          {prod.stock} {prod.unit}s
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-3.5">
                      <StatusBadge status={prod.status} stock={prod.stock} />
                    </td>

                    {/* DATE */}
                    <td className="px-5 py-3.5 text-slate-500">
                      {prod.createdAt}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          title="Delete Product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE CARDS ================= */}
        <div className="space-y-3 lg:hidden">
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
              No products found matching your search.
            </div>
          ) : (
            filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <Package size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {prod.name}
                      </p>
                      <p className="text-[11px] font-mono text-slate-400">
                        SKU: {prod.sku} • {prod.category}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={prod.status} stock={prod.stock} />
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <div>
                    <span className="text-sm font-bold text-slate-900">
                      ₹{prod.price}
                    </span>
                    {prod.mrp && prod.mrp > prod.price && (
                      <span className="ml-1.5 text-[11px] text-slate-400 line-through">
                        ₹{prod.mrp}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-600">
                    Stock: <strong>{prod.stock}</strong> {prod.unit}s
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDelete(prod.id, prod.name)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"
                    title="Delete Product"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  stock,
}: {
  status: ProductStatus;
  stock: number;
}) {
  const isOutOfStock = stock === 0 || status === "Out of Stock";

  if (isOutOfStock) {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-semibold text-red-700 ring-1 ring-red-600/20">
        Out of Stock
      </span>
    );
  }

  if (status === "Draft") {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
        Draft
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
      Active
    </span>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}
        >
          <Icon size={19} />
        </div>
        <div>
          <p className="text-xl font-bold text-slate-900">{value}</p>
          <p className="text-[11px] font-medium text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
