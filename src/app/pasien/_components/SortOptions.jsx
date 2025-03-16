// app/pasien/components/SortOptions.jsx
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";

export default function SortOptions({ sortField, sortOrder, onSort }) {
  // Get sort icon based on current sort settings
  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortOrder === "asc" ? (
      <ChevronUp className="h-4 w-4 text-blue-500" />
    ) : (
      <ChevronDown className="h-4 w-4 text-blue-500" />
    );
  };

  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-2">
      <div className="text-sm text-gray-600 mr-2 mb-2 sm:mb-0 sm:mt-1">
        Urutkan:
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSort("no_rm")}
          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1
            ${
              sortField === "no_rm"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
        >
          <span>No. RM</span>
          {getSortIcon("no_rm")}
        </button>
        <button
          onClick={() => onSort("updatedAt")}
          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1
            ${
              sortField === "updatedAt"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
        >
          <span>Update Terakhir</span>
          {getSortIcon("updatedAt")}
        </button>
      </div>
    </div>
  );
}
