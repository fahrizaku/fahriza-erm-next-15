// app/inventory/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [movementType, setMovementType] = useState("IN");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("PURCHASE");
  const [notes, setNotes] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Load data on page load
  useEffect(() => {
    fetchProducts(1, true); // Reset products on initial load
    fetchMovements();
  }, []);

  // Search products when query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts(1, true); // Reset to page 1 when searching
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch products from API
  const fetchProducts = async (page = 1, reset = false) => {
    try {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (data.data) {
        if (reset || page === 1) {
          setProducts(data.data);
          setCurrentPage(1);
        } else {
          setProducts((prev) => [...prev, ...data.data]);
        }

        // Check if there are more products to load
        const totalPages = data.pagination?.totalPages || 1;
        setHasMoreProducts(page < totalPages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      showNotification("Gagal memuat produk", "error");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more products
  const handleLoadMore = () => {
    if (!loadingMore && hasMoreProducts) {
      fetchProducts(currentPage + 1, false);
    }
  };

  // Fetch inventory movements
  const fetchMovements = async () => {
    try {
      const response = await fetch("/api/inventory?limit=10");
      const data = await response.json();

      if (response.ok) {
        setMovements(data.data);
      } else {
        setError(data.error || "Gagal memuat riwayat pergerakan stok");
      }
    } catch (err) {
      setError("Error memuat data inventori");
      console.error(err);
    }
  };

  // Handle product selection for inventory adjustment
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setSelectedProduct(null);
    setMovementType("IN");
    setQuantity("");
    setReason("PURCHASE");
    setNotes("");
    setShowForm(false);
  };

  // Submit inventory movement
  const handleSubmitMovement = async (e) => {
    e.preventDefault();

    if (!selectedProduct || !quantity || parseInt(quantity) <= 0) {
      showNotification("Mohon masukkan jumlah yang valid", "error");
      return;
    }

    try {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          type: movementType,
          quantity: parseInt(quantity),
          reason,
          notes,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showNotification("Inventori berhasil diperbarui", "success");
        resetForm();
        // Refresh data
        fetchProducts(1, true);
        fetchMovements();
      } else {
        showNotification(
          result.error || "Gagal memperbarui inventori",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      showNotification("Error memproses permintaan Anda", "error");
    }
  };

  // Format date
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

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
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
    };
    return reasonMap[reason] || reason;
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Manajemen Inventori</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link
            href="/apotek/produk"
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 rounded text-center text-sm sm:text-base"
          >
            Kelola Produk
          </Link>
          <Link
            href="/apotek/supplier"
            className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded text-center text-sm sm:text-base"
          >
            Kelola Supplier
          </Link>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div
          className={`p-3 sm:p-4 mb-4 rounded-md text-sm sm:text-base ${
            notification.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {notification.message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 sm:p-4 rounded mb-4 text-sm sm:text-base">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Left side - Products */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4">
            <h2 className="font-bold text-base sm:text-lg mb-3">
              Inventori Produk
            </h2>

            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded text-sm sm:text-base"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-2 sm:px-3 text-left text-xs sm:text-sm">
                      Produk
                    </th>
                    <th className="py-2 px-2 sm:px-3 text-center text-xs sm:text-sm">
                      Stok
                    </th>
                    <th className="py-2 px-2 sm:px-3 text-center text-xs sm:text-sm">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading && products.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="py-6 text-center text-gray-500 text-sm sm:text-base"
                      >
                        Memuat produk...
                      </td>
                    </tr>
                  ) : products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="py-2 px-2 sm:px-3">
                          <div>
                            <div className="font-medium text-xs sm:text-sm">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {product.category}
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-2 sm:px-3 text-center">
                          <span
                            className={`text-xs sm:text-sm ${
                              product.stock <= 5 ? "text-red-500 font-bold" : ""
                            }`}
                          >
                            {product.stock} {product.unit}
                          </span>
                        </td>
                        <td className="py-2 px-2 sm:px-3 text-center">
                          <button
                            onClick={() => handleSelectProduct(product)}
                            className="text-blue-500 hover:text-blue-700 text-xs sm:text-sm"
                          >
                            Sesuaikan
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="py-6 text-center text-gray-500 text-sm sm:text-base"
                      >
                        {searchQuery
                          ? "Tidak ada produk yang ditemukan"
                          : "Tidak ada produk"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Load More Button */}
            {hasMoreProducts && products.length > 0 && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded text-sm sm:text-base"
                >
                  {loadingMore ? "Memuat..." : "Muat Lebih Banyak"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Adjustment Form or Recent Movements */}
        <div className="w-full lg:w-1/2">
          {showForm ? (
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4">
              <h2 className="font-bold text-base sm:text-lg mb-3">
                Sesuaikan Inventori
              </h2>

              <form onSubmit={handleSubmitMovement}>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm sm:text-base">
                    Produk
                  </label>
                  <div className="p-2 sm:p-3 border border-gray-300 rounded bg-gray-50">
                    <div className="font-medium text-sm sm:text-base">
                      {selectedProduct.name}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      Stok Saat Ini: {selectedProduct.stock}{" "}
                      {selectedProduct.unit}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm sm:text-base">
                    Jenis Pergerakan
                  </label>
                  <select
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value)}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded text-sm sm:text-base"
                  >
                    <option value="IN">Stok Masuk</option>
                    <option value="OUT">Stok Keluar</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm sm:text-base">
                    Jumlah
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded text-sm sm:text-base"
                    placeholder="Masukkan jumlah"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm sm:text-base">
                    Alasan
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded text-sm sm:text-base"
                  >
                    {movementType === "IN" ? (
                      <>
                        <option value="PURCHASE">Pembelian</option>
                        <option value="RETURN">Retur</option>
                        <option value="ADJUSTMENT">Penyesuaian</option>
                      </>
                    ) : (
                      <>
                        <option value="SALE">Penjualan</option>
                        <option value="EXPIRED">Kadaluarsa</option>
                        <option value="DAMAGED">Rusak</option>
                        <option value="ADJUSTMENT">Penyesuaian</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm sm:text-base">
                    Catatan
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded text-sm sm:text-base"
                    rows="3"
                    placeholder="Masukkan catatan tambahan"
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm sm:text-base"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4">
              <h2 className="font-bold text-base sm:text-lg mb-3">
                Riwayat Pergerakan Inventori
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-2 px-2 sm:px-3 text-left text-xs sm:text-sm">
                        Tanggal
                      </th>
                      <th className="py-2 px-2 sm:px-3 text-left text-xs sm:text-sm">
                        Produk
                      </th>
                      <th className="py-2 px-2 sm:px-3 text-center text-xs sm:text-sm">
                        Jenis
                      </th>
                      <th className="py-2 px-2 sm:px-3 text-center text-xs sm:text-sm">
                        Qty
                      </th>
                      <th className="py-2 px-2 sm:px-3 text-left text-xs sm:text-sm">
                        Alasan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {movements.length > 0 ? (
                      movements.map((movement) => (
                        <tr key={movement.id} className="hover:bg-gray-50">
                          <td className="py-2 px-2 sm:px-3 text-xs sm:text-sm">
                            {formatDate(movement.date)}
                          </td>
                          <td className="py-2 px-2 sm:px-3 text-xs sm:text-sm">
                            {movement.product.name}
                          </td>
                          <td className="py-2 px-2 sm:px-3 text-center">
                            <span
                              className={`px-1 sm:px-2 py-1 rounded text-xs ${
                                movement.type === "IN"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {movement.type === "IN" ? "MASUK" : "KELUAR"}
                            </span>
                          </td>
                          <td className="py-2 px-2 sm:px-3 text-center text-xs sm:text-sm">
                            {movement.quantity}
                          </td>
                          <td className="py-2 px-2 sm:px-3 text-xs sm:text-sm">
                            {getReasonText(movement.reason)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-6 text-center text-gray-500 text-sm sm:text-base"
                        >
                          Tidak ada riwayat pergerakan inventori
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {movements.length > 0 && (
                  <div className="mt-4 text-center">
                    <Link
                      href="/inventory/movements"
                      className="text-blue-500 hover:text-blue-700 text-sm sm:text-base"
                    >
                      Lihat Semua Riwayat Pergerakan →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <Link
          href="/dashboard"
          className="text-blue-500 hover:text-blue-700 text-sm sm:text-base"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
