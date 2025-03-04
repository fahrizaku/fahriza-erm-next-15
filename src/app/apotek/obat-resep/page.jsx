// 1. First, let's update the DrugData component with proper delete functionality
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Edit, Trash2, Eye, Plus, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

const DrugData = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [drugs, setDrugs] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingState, setLoadingState] = useState({
    drugId: null,
    linkType: null,
  });
  const [addButtonLoading, setAddButtonLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [drugToDelete, setDrugToDelete] = useState(null);
  const pageSize = 15;
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const sortOptions = [
    { value: "stock", label: "Stok" },
    { value: "expiryDate", label: "Exp Date" },
    { value: "updatedAt", label: "Terakhir Diperbarui" },
  ];

  // Apply debounce to search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setOffset(0); // Reset offset when search query changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchDrugs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        offset: offset.toString(),
        search: debouncedSearchQuery,
        sortBy: sortBy,
        sortOrder: sortOrder,
      });

      const response = await fetch(`/api/drugsPres?${params}`);
      const data = await response.json();

      const formattedData = data.map((drug) => ({
        ...drug,
        purchasePrice: Number(drug.purchasePrice),
        price: Number(drug.price),
      }));

      setDrugs((prev) =>
        offset === 0 ? formattedData : [...prev, ...formattedData]
      );

      setHasMore(data.length === pageSize);
    } catch (error) {
      console.error("Failed to fetch drugs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [offset, debouncedSearchQuery, sortBy, sortOrder]);

  // Fetch data when debouncedSearchQuery or offset changes
  useEffect(() => {
    fetchDrugs();
  }, [debouncedSearchQuery, offset, fetchDrugs]);

  //menghapus isi search
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Handle delete confirmation modal
  const openDeleteConfirm = (drug) => {
    setDrugToDelete(drug);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setDrugToDelete(null);
  };

  // Handle actual deletion
  const handleDeleteDrug = async () => {
    if (!drugToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/drugsPres/${drugToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete drug");
      }

      // Remove the deleted drug from the state
      setDrugs((prevDrugs) =>
        prevDrugs.filter((drug) => drug.id !== drugToDelete.id)
      );

      // Show success toast
      toast.success(`Obat ${drugToDelete.name} berhasil dihapus`);
    } catch (error) {
      console.error("Error deleting drug:", error);
      // Show error toast
      toast.error("Gagal menghapus obat, coba lagi nanti");
    } finally {
      setIsDeleting(false);
      closeDeleteConfirm();
    }
  };

  const handleLinkClick = (drugId, linkType) => {
    setLoadingState({ drugId, linkType });
    // Loading state akan reset saat halaman baru dimuat
  };

  const handleAddButtonClick = () => {
    setAddButtonLoading(true);
    // Loading state akan reset saat halaman baru dimuat
  };

  // Add this after the search input and before the table
  const renderSortingControls = () => (
    <div className="mb-4 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Urutkan:</label>
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setOffset(0);
          }}
          className="rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={() => {
          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
          setOffset(0);
        }}
        className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
      >
        {sortOrder === "asc" ? "A → Z" : "Z → A"}
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        {/* Header dan Tombol Tambah Obat */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Data Obat
            </h1>
          </div>
          {/* Tombol Tambah Obat */}
          <Link href="/apotek/obat-resep/tambah">
            <button
              className="px-4 py-2 sm:px-5 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all font-medium flex items-center gap-2"
              onClick={handleAddButtonClick}
            >
              {addButtonLoading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span className="text-sm sm:text-base">Loading...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Tambah Obat</span>
                </>
              )}
            </button>
          </Link>
        </div>

        {/* Search Input */}
        <div className="mb-6 sm:mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari obat..."
              className="w-full pl-10 pr-10 py-2 sm:py-3 bg-white rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder-gray-400 text-gray-700 transition-all shadow-sm text-sm sm:text-base"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {renderSortingControls()}

        {/* Tabel Responsif */}
        <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
          <table className="w-full">
            <thead className="bg-blue-50 border-b border-cyan-100">
              <tr className="text-sm sm:text-base font-semibold text-gray-700 [&>th]:px-4 sm:[&>th]:px-6 [&>th]:py-3 [&>th]:align-middle">
                <th className="text-left rounded-tl-lg sm:rounded-tl-xl sticky left-0 z-20 bg-blue-50">
                  Nama Obat
                </th>
                <th className="text-center">Satuan</th>
                <th className="text-center">Harga Jual</th>
                <th className="text-center">Stok</th>
                <th className="text-center">Exp Date</th>
                <th className="text-center rounded-tr-lg sm:rounded-tr-xl">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {drugs.map((drug, index) => (
                <tr
                  key={index}
                  className="md:hover:bg-gray-200/80 transition-colors even:bg-gray-100 odd:bg-white text-sm sm:text-base"
                >
                  <td className="px-4 lg:text-md sm:px-6 py-3 font-medium text-gray-900 max-md:sticky left-0 z-10 shadow-md border-r border-gray-200 bg-inherit min-w-[120px]">
                    {drug.name}
                    <div className="absolute right-0 top-0 h-full w-[0.5px] bg-gray-300"></div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-center">
                    <span className="px-2 py-1 rounded-full bg-blue-200 text-blue-900 whitespace-nowrap text-sm">
                      {drug.unit}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-center">
                    <span className="font-semibold text-cyan-800">
                      Rp
                      {drug.price.toLocaleString("id-ID", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full whitespace-nowrap text-sm ${
                        drug.stock > 50
                          ? "bg-green-200 text-green-900"
                          : "bg-amber-200 text-amber-900"
                      }`}
                    >
                      {drug.stock} pcs
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-center">
                    <div className="bg-gray-200 px-2 py-1 rounded-md text-gray-700 whitespace-nowrap text-sm inline-block">
                      {new Date(drug.expiryDate).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3">
                    <div className="flex justify-center gap-3">
                      <Link
                        href={`/apotek/obat-resep/${drug.id}`}
                        className="text-cyan-700 hover:text-cyan-800 transition-colors p-2 sm:p-1.5 rounded-md hover:bg-blue-100 flex items-center"
                        onClick={() => handleLinkClick(drug.id, "detail")}
                      >
                        {loadingState.drugId === drug.id &&
                        loadingState.linkType === "detail" ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="sm:hidden ml-1 text-sm">
                              Loading...
                            </span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-5 h-5" />
                            <span className="sm:hidden ml-1 text-sm">
                              Detail
                            </span>
                          </>
                        )}
                      </Link>

                      <Link
                        href={`/apotek/obat-resep/edit/${drug.id}`}
                        className="text-blue-700 hover:text-blue-800 transition-colors p-2 sm:p-1.5 rounded-md hover:bg-blue-100 flex items-center"
                        onClick={() => handleLinkClick(drug.id, "edit")}
                      >
                        {loadingState.drugId === drug.id &&
                        loadingState.linkType === "edit" ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="sm:hidden ml-1 text-sm">
                              Loading...
                            </span>
                          </>
                        ) : (
                          <>
                            <Edit className="w-5 h-5" />
                            <span className="sm:hidden ml-1 text-sm">Edit</span>
                          </>
                        )}
                      </Link>

                      <button
                        onClick={() => openDeleteConfirm(drug)}
                        className="text-red-700 hover:text-red-800 transition-colors p-2 sm:p-1.5 rounded-md hover:bg-red-100 flex items-center"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span className="sm:hidden ml-1 text-sm">Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tombol Load More */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setOffset((prev) => prev + pageSize)}
            disabled={!hasMore || isLoading}
            className="px-5 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 
                      disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span>Memuat...</span>
            ) : hasMore ? (
              "Muat Lebih Banyak"
            ) : (
              "Tidak Ada Data Lagi"
            )}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Konfirmasi Hapus
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus obat{" "}
              <span className="font-semibold text-red-600">
                {drugToDelete?.name}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteConfirm}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteDrug}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {isDeleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugData;
