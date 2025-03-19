// _components/QueueHeader.js
import React from "react";
import { RefreshCw } from "lucide-react";

export default function QueueHeader({
  title,
  subtitle,
  onRefresh,
  refreshing,
}) {
  return (
    <div className="px-6 py-5 border-b border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
        </div>
        <div className="mt-3 md:mt-0">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`-ml-1 mr-2 h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            {refreshing ? "Memperbarui..." : "Perbarui Data"}
          </button>
        </div>
      </div>
    </div>
  );
}
