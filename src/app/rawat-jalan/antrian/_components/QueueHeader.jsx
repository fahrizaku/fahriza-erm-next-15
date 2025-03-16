import React from "react";
import { RefreshCw, Loader2 } from "lucide-react";

export default function QueueHeader({
  title,
  subtitle,
  onRefresh,
  refreshing,
}) {
  return (
    <div className="p-5 md:p-6 border-b border-gray-200 bg-gray-50 flex flex-wrap justify-between items-center">
      <div>
        <h1 className="text-xl font-bold text-gray-800 mb-1">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      <button
        onClick={onRefresh}
        disabled={refreshing}
        className="mt-2 sm:mt-0 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors flex items-center"
      >
        {refreshing ? (
          <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4 mr-1.5" />
        )}
        <span>Refresh</span>
      </button>
    </div>
  );
}
