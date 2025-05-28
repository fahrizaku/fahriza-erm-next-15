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
  const [showFilters, setShowFilters] = useState(false);

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
        setError(data.error || "Gagal memuat riwayat pergerakan inventori");
      }
    } catch (err) {
      setError("Error memuat riwayat pergerakan inventori");
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

  // Get reason text in Indonesian
  const getReasonText = (reason) => {
    const reasonMap = {
      PURCHASE: "Pembelian",
      RETURN: "Retur",
      ADJUSTMENT: "Penyesuaian",
      SALE: "Penjualan",
      EXPIRED: "Kadaluarsa",
      DAMAGED: "Rusak",
      INITIAL: "Stok Awal",
      CANCELLED_SALE: "Penjualan Dibatalkan",
    };
    return reasonMap[reason] || reason;
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">
          Riwayat Pergerakan Inventori
        </h1>
        <Link
          href="/apotek/inventory"
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto text-center"
        >
          Kembali ke Inventori
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 sm:p-4 rounded mb-4 text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-sm sm:text-base">Filter</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden text-blue-500 hover:text-blue-700 text-sm"
          >
            {showFilters ? "Sembunyikan" : "Tampilkan"}
          </button>
        </div>

        <div className={`${showFilters ? "block" : "hidden"} sm:block`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block mb-1 text-xs sm:text-sm font-medium">
                Jenis Pergerakan
              </label>
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setPage(1);
                }}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded text-sm sm:text-base"
              >
                <option value="">Semua Jenis</option>
                <option value="IN">Stok Masuk</option>
                <option value="OUT">Stok Keluar</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-xs sm:text-sm font-medium">
                Produk
              </label>
              <select
                value={filterProduct}
                onChange={(e) => {
                  setFilterProduct(e.target.value);
                  setPage(1);
                }}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded text-sm sm:text-base"
              >
                <option value="">Semua Produk</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-xs sm:text-sm font-medium">
                Alasan
              </label>
              <select
                value={filterReason}
                onChange={(e) => {
                  setFilterReason(e.target.value);
                  setPage(1);
                }}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded text-sm sm:text-base"
              >
                <option value="">Semua Alasan</option>
                <option value="PURCHASE">Pembelian</option>
                <option value="SALE">Penjualan</option>
                <option value="RETURN">Retur</option>
                <option value="EXPIRED">Kadaluarsa</option>
                <option value="DAMAGED">Rusak</option>
                <option value="ADJUSTMENT">Penyesuaian</option>
                <option value="CANCELLED_SALE">Penjualan Dibatalkan</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm sm:text-base"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Movement List */}
      {loading ? (
        <div className="text-center py-6 sm:py-8">
          <p className="text-sm sm:text-base">
            Memuat riwayat pergerakan inventori...
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden mb-4">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium">
                    Tanggal
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium">
                    Produk
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-medium">
                    Jenis
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-medium">
                    Jumlah
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium">
                    Alasan
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium">
                    Catatan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {movements.length > 0 ? (
                  movements.map((movement) => (
                    <tr key={movement.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">
                        {formatDate(movement.date)}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-sm">
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
                            {movement.type === "IN" ? "MASUK" : "KELUAR"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-sm">
                        {movement.quantity} {movement.product.unit}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {getReasonText(movement.reason)}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {movement.notes || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-6 text-center text-gray-500 text-sm"
                    >
                      Tidak ada riwayat pergerakan inventori
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3 mb-4">
            {movements.length > 0 ? (
              movements.map((movement) => (
                <div
                  key={movement.id}
                  className="bg-white rounded-lg shadow p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">
                        {movement.product.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {movement.product.category}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ml-2 ${
                        movement.type === "IN"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {movement.type === "IN" ? "MASUK" : "KELUAR"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Tanggal:</span>
                      <p className="font-medium">{formatDate(movement.date)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Jumlah:</span>
                      <p className="font-medium">
                        {movement.quantity} {movement.product.unit}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Alasan:</span>
                      <p className="font-medium">
                        {getReasonText(movement.reason)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Catatan:</span>
                      <p className="font-medium">{movement.notes || "-"}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500 text-sm">
                  Tidak ada riwayat pergerakan inventori
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center mt-4 gap-2 sm:gap-0">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm ${
                    page === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Sebelumnya
                </button>

                <span className="mx-2 px-2 sm:px-3 py-1 text-xs sm:text-sm">
                  Hal {page} dari {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm ${
                    page === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
