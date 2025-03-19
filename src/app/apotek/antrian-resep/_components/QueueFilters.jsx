// _components/QueueFilters.js
import React from "react";
import { Search } from "lucide-react";

export default function QueueFilters({
  filter,
  setFilter,
  searchTerm,
  setSearchTerm,
  statusOptions = [
    { value: "all", label: "Semua" },
    { value: "waiting", label: "Menunggu" },
    { value: "called", label: "Dipanggil" },
    { value: "in-progress", label: "Sedang Diperiksa" },
    { value: "completed", label: "Selesai" },
  ],
}) {
  return (
    <div className="p-4 border-b border-gray-200 bg-gray-50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Filter by status */}
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md ${
                filter === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              } focus:outline-none`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-auto flex-grow sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Cari pasien atau nomor antrian..."
          />
        </div>
      </div>
    </div>
  );
}
