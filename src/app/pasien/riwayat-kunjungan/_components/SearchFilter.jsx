"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchFilter({ onSearch }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Inisialisasi state dari URL parameters
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [dateRange, setDateRange] = useState({
    start: searchParams.get("startDate") || "",
    end: searchParams.get("endDate") || "",
  });

  const handleSearch = (e) => {
    e.preventDefault();

    // Membuat query params untuk pencarian
    const params = new URLSearchParams();

    if (searchTerm) {
      params.append("search", searchTerm);
    }

    if (dateRange.start) {
      params.append("startDate", dateRange.start);
    }

    if (dateRange.end) {
      params.append("endDate", dateRange.end);
    }

    // Selalu mulai dari halaman 1 ketika melakukan pencarian baru
    params.append("page", "1");

    // Panggil onSearch callback jika ada
    if (onSearch) onSearch();

    // Navigate dengan query params
    router.push(`/pasien/riwayat-kunjungan?${params.toString()}`);
  };

  const handleReset = () => {
    setSearchTerm("");
    setDateRange({ start: "", end: "" });

    // Panggil onSearch callback jika ada
    if (onSearch) onSearch();

    router.push("/pasien/riwayat-kunjungan");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cari Pasien
            </label>
            <input
              type="text"
              placeholder="Nama / No. RM / NIK"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Mulai
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Selesai
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 text-gray-700 mr-2"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Cari
          </button>
        </div>
      </form>
    </div>
  );
}
