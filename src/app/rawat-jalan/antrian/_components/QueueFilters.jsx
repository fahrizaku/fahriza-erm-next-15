import React from "react";
import { Filter, Search } from "lucide-react";

export default function QueueFilters({
  filter,
  setFilter,
  searchTerm,
  setSearchTerm,
}) {
  return (
    <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-4">
      {/* Status filter */}
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Filter className="h-4 w-4 inline mr-1" />
          Filter Status
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="waiting">Menunggu</option>
          <option value="called">Dipanggil</option>
          <option value="in-progress">Sedang Diperiksa</option>
          <option value="completed">Selesai</option>
          <option value="all">Semua Status</option>
        </select>
      </div>

      {/* Search */}
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Search className="h-4 w-4 inline mr-1" />
          Cari Pasien
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nama pasien atau nomor antrian"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
