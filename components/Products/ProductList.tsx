"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import { useProductFilters, useProductList } from "@/hooks/useProducts";
import type { ProductListItem } from "@/types/product";

const PER_PAGE = 10;

function formatDate(date?: string | null): string {
  if (!date) return "-";
  try {
    const d = new Date(date.includes("T") ? date : `${date}T00:00:00`);
    if (isNaN(d.getTime())) return date;
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return date;
  }
}

function formatPrice(val?: number | string | null): string {
  if (val === undefined || val === null || val === "") return "0";
  const num = Number(val);
  if (isNaN(num)) return String(val);
  return num.toLocaleString();
}

export default function ProductList() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | number>("");

  // 1. Fetch filter options (statuses)
  const { data: filtersData } = useProductFilters();

  const filterOptions: { id: string; name: string; value: string | number }[] =
    [
      { id: "all", name: "All", value: "" },
      ...(filtersData?.product_status?.map((st) => ({
        id: String(st.id),
        name: st.name,
        value: st.value ?? st.id,
      })) || []),
    ];

  // Debounce search input by 350ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch product list from API via React Query
  // Exactly matching params: ?per_page=10&page=1&search=&status=
  const { data, isLoading, isFetching, isError, error, refetch } =
    useProductList({
      page,
      per_page: PER_PAGE,
      search: debouncedSearch,
      status: selectedStatus,
    });

  const products: ProductListItem[] = data?.data ?? [];
  const pagination = data?.pagination;
  const summary = data?.summary ?? {
    total_products: 0,
    in_stock: 0,
    out_of_stock: 0,
    categories: 0,
  };

  const totalPages = pagination?.last_page ?? 1;
  const totalRecords = pagination?.total ?? 0;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
  };

  const handleStatusChange = (val: string | number) => {
    setSelectedStatus(val);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setPage(1);
  };

  return (
    <div className="min-h-full bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        {/* ================= HEADER ================= */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-semibold tracking-[-0.3px] text-slate-900 sm:text-[24px]">
                Product Catalog
              </h1>
              {pagination && (
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-[#176b32]">
                  {totalRecords} {totalRecords === 1 ? "product" : "products"}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Manage your product catalog, pricing, SKU codes, and inventory
              levels
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              title="Refresh product list"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 shadow-sm"
            >
              <RefreshCw
                size={16}
                className={isFetching ? "animate-spin text-[#176b32]" : ""}
              />
            </button>

            <Link
              href="/products/add"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#176b32] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#125727] active:scale-[0.99]"
            >
              <Plus size={16} />
              Add Product
            </Link>
          </div>
        </div>

        {/* ================= STATS CARDS (SUMMARY FROM API) ================= */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
          <StatCard
            label="Total Products"
            value={summary.total_products}
            icon={Package}
            color="bg-emerald-100 text-[#176b32]"
          />
          <StatCard
            label="In Stock"
            value={summary.in_stock}
            icon={CheckCircle2}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            label="Out of Stock"
            value={summary.out_of_stock}
            icon={AlertTriangle}
            color="bg-amber-100 text-amber-600"
          />
          <StatCard
            label="Categories"
            value={summary.categories}
            icon={Boxes}
            color="bg-violet-100 text-violet-600"
          />
        </div>

        {/* ================= SEARCH & FILTERS ================= */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* SEARCH BAR */}
          <div className="relative w-full max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by product name, SKU, category..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#176b32] focus:ring-2 focus:ring-[#176b32]/15"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* FILTER PILLS BASED ON FILTER API */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {filterOptions.map((option) => {
              const isSelected =
                String(selectedStatus) === String(option.value);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleStatusChange(option.value)}
                  className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-medium transition ${
                    isSelected
                      ? "bg-[#176b32] text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {option.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= ERROR STATE ================= */}
        {isError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-800">
            <p className="font-semibold">Failed to load product catalog.</p>
            <p className="mt-0.5 text-red-600">
              {(error as { message?: string })?.message ||
                "Please check your network connection and try again."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-2 inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}

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
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw
                        size={20}
                        className="animate-spin text-[#176b32]"
                      />
                      <span className="text-xs font-medium text-slate-500">
                        Loading products from catalog...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-14 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Package size={28} className="text-slate-300" />
                      <p className="font-medium text-slate-600">
                        No products found
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {debouncedSearch || selectedStatus !== ""
                          ? "Try clearing your search or filters to see more results."
                          : "No products added yet. Click 'Add Product' to create one."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const sellingPrice = prod.selling_price ?? prod.price;
                  const mrpVal = prod.mrp;
                  const stockCount = Number(
                    prod.initial_stock ?? prod.stock ?? 0,
                  );
                  const unitName = prod.unit_name || prod.unit || "";
                  const categoryName =
                    prod.category_name || prod.category || "-";
                  const skuCode = prod.item_code || prod.sku || "-";
                  const dateStr = prod.created_at || prod.createdAt;

                  return (
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
                              SKU: {skuCode}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-5 py-3.5">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                          {categoryName}
                        </span>
                      </td>

                      {/* PRICE & MRP */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-semibold text-slate-900">
                            {formatPrice(sellingPrice)}
                          </span>
                          {mrpVal && Number(mrpVal) > Number(sellingPrice) && (
                            <span className="text-[11px] text-slate-400 line-through">
                              {formatPrice(mrpVal)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* STOCK & UNIT */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              stockCount > 20
                                ? "bg-emerald-500"
                                : stockCount > 0
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                          />
                          <span className="font-medium text-slate-800">
                            {stockCount} {unitName}
                          </span>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-3.5">
                        <StatusBadge
                          status={prod.status}
                          statusText={prod.status_text}
                          stock={stockCount}
                        />
                      </td>

                      {/* DATE */}
                      <td className="px-5 py-3.5 text-slate-500">
                        {formatDate(dateStr)}
                      </td>

                      {/* ACTIONS: JUST EDIT BUTTON */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end">
                          <Link
                            href={`/products/${prod.id}/edit`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-emerald-50 hover:text-[#176b32]"
                            title="Edit Product"
                          >
                            <Pencil size={15} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE CARDS ================= */}
        <div className="space-y-3 lg:hidden">
          {isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-xs text-slate-400">
              <RefreshCw
                size={20}
                className="mx-auto mb-2 animate-spin text-[#176b32]"
              />
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
              <Package size={28} className="mx-auto mb-2 text-slate-300" />
              No products found matching your search.
            </div>
          ) : (
            products.map((prod) => {
              const sellingPrice = prod.selling_price ?? prod.price;
              const mrpVal = prod.mrp;
              const stockCount = Number(prod.initial_stock ?? prod.stock ?? 0);
              const unitName = prod.unit_name || prod.unit || "";
              const categoryName = prod.category_name || prod.category || "-";
              const skuCode = prod.item_code || prod.sku || "-";

              return (
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
                          SKU: {skuCode} • {categoryName}
                        </p>
                      </div>
                    </div>

                    <StatusBadge
                      status={prod.status}
                      statusText={prod.status_text}
                      stock={stockCount}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <div>
                      <span className="text-sm font-bold text-slate-900">
                        {formatPrice(sellingPrice)}
                      </span>
                      {mrpVal && Number(mrpVal) > Number(sellingPrice) && (
                        <span className="ml-1.5 text-[11px] text-slate-400 line-through">
                          {formatPrice(mrpVal)}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-600">
                      Stock: <strong>{stockCount}</strong> {unitName}
                    </span>

                    {/* ACTION: JUST EDIT BUTTON */}
                    <Link
                      href={`/products/${prod.id}/edit`}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-[#176b32]"
                      title="Edit Product"
                    >
                      <Pencil size={14} />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ================= PAGINATION ================= */}
        {totalRecords > 0 && (
          <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {pagination?.from ??
                  (products.length > 0 ? (page - 1) * PER_PAGE + 1 : 0)}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-800">
                {pagination?.to ??
                  (products.length > 0
                    ? (page - 1) * PER_PAGE + products.length
                    : 0)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {totalRecords}
              </span>{" "}
              products
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1 || isFetching}
                className="inline-flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={14} /> Previous
              </button>

              <span className="px-2 text-xs font-medium text-slate-600">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages || isFetching}
                className="inline-flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  statusText,
  stock,
}: {
  status?: number | string;
  statusText?: string;
  stock: number;
}) {
  const isOutOfStock =
    stock === 0 ||
    status === 3 ||
    status === "3" ||
    statusText?.toLowerCase() === "out of stock";

  if (isOutOfStock) {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-semibold text-red-700 ring-1 ring-red-600/20">
        Out of Stock
      </span>
    );
  }

  if (status === 2 || status === "2" || statusText?.toLowerCase() === "draft") {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
        Draft
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
      {statusText || "Active"}
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
