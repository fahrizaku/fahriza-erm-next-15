// app/pasien/components/SearchFilter.jsx
import { useState } from "react";
import { Search, Loader2, X, User, ChevronDown } from "lucide-react";

export default function SearchFilter({
  searchQuery,
  setSearchQuery,
  isLoading,
  clearSearch,
  patientType,
  onPatientTypeChange,
}) {
  const [showTypeOptions, setShowTypeOptions] = useState(false);

  // Get patient type label
  const getPatientTypeLabel = () => {
    switch (patientType) {
      case "regular":
        return "Umum";
      case "bpjs":
        return "BPJS";
      default:
        return "Semua Pasien";
    }
  };

  // Set patient type and close dropdown
  const handlePatientTypeChange = (type) => {
    onPatientTypeChange(type);
    setShowTypeOptions(false);
  };

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col space-y-3">
        {/* Search field and input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama atau nomor RM..."
            className="w-full pl-10 sm:pl-12 pr-12 py-2.5 sm:py-3.5 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition-all text-sm sm:text-base"
          />
          {isLoading && searchQuery && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}
          {searchQuery && !isLoading && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="h-4 w-4 font-bold" strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Patient Type Filter Dropdown */}
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <button
              onClick={() => setShowTypeOptions(!showTypeOptions)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm transition-colors"
            >
              <User className="w-4 h-4" />
              <span>{getPatientTypeLabel()}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showTypeOptions && (
              <div className="absolute left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 w-40">
                <button
                  onClick={() => handlePatientTypeChange("all")}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    patientType === "all" ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  Semua Pasien
                </button>
                <button
                  onClick={() => handlePatientTypeChange("regular")}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    patientType === "regular" ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  Umum
                </button>
                <button
                  onClick={() => handlePatientTypeChange("bpjs")}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    patientType === "bpjs" ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  BPJS
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
