// app/inventory/movements/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function InventoryMovementsPage() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);
  const [filterType, setFilterType] = useState("");
  const [filterProduct, setFilterProduct] = useState("");
  const [filterReason, setFilterReason] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchMovements();
  }, [page, filterType, filterProduct, filterReason]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products?limit=1000");
      const data = await response.json();
      if (data.data) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchMovements = async () => {
    try {
      setLoading(true);
      let url = `/api/inventory?page=${page}&limit=${limit}`;

      if (filterType) url += `&type=${filterType}`;
      if (filterProduct) url += `&productId=${filterProduct}`;
      if (filterReason) url += `&reason=${filterReason}`;

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setMovements(data.data);
        setTotalPages(data.meta.totalPages);
      } else {
        setError(data.error || "Failed to fetch inventory movements");
      }
    } catch (err) {
      setError("Error loading inventory movements");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilterType("");
    setFilterProduct("");
    setFilterReason("");
    setPage(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Movements</h1>
        <Link
          href="/inventory"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to Inventory
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="font-bold mb-3">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block mb-1 text-sm">Movement Type</label>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">All Types</option>
              <option value="IN">Stock In</option>
              <option value="OUT">Stock Out</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">Product</label>
            <select
              value={filterProduct}
              onChange={(e) => {
                setFilterProduct(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">All Products</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">Reason</label>
            <select
              value={filterReason}
              onChange={(e) => {
                setFilterReason(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">All Reasons</option>
              <option value="PURCHASE">Purchase</option>
              <option value="SALE">Sale</option>
              <option value="RETURN">Return</option>
              <option value="EXPIRED">Expired</option>
              <option value="DAMAGED">Damaged</option>
              <option value="ADJUSTMENT">Adjustment</option>
              <option value="CANCELLED_SALE">Cancelled Sale</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Movement List */}
      {loading ? (
        <div className="text-center py-8">
          <p>Loading inventory movements...</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Product</th>
                  <th className="py-3 px-4 text-center">Type</th>
                  <th className="py-3 px-4 text-center">Quantity</th>
                  <th className="py-3 px-4 text-left">Reason</th>
                  <th className="py-3 px-4 text-left">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {movements.length > 0 ? (
                  movements.map((movement) => (
                    <tr key={movement.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{formatDate(movement.date)}</td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">
                            {movement.product.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {movement.product.category}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              movement.type === "IN"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {movement.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {movement.quantity} {movement.product.unit}
                      </td>
                      <td className="py-3 px-4">{movement.reason}</td>
                      <td className="py-3 px-4">{movement.notes || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-gray-500">
                      No inventory movements found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`mx-1 px-3 py-1 rounded ${
                  page === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Previous
              </button>
              <span className="mx-2 px-3 py-1">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`mx-1 px-3 py-1 rounded ${
                  page === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
