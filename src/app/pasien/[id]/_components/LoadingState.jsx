import React from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";

// Loading State Component
export const LoadingState = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">Memuat data pasien...</p>
        </div>
      </div>
    </div>
  );
};

// Error State Component
export const ErrorState = ({ error, onBackClick }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <p className="mt-1 text-red-700">{error}</p>
            <button
              onClick={onBackClick}
              className="mt-3 px-4 py-2 bg-white text-red-700 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
            >
              Kembali ke Daftar Pasien
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Not Found State Component
export const NotFoundState = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="text-center py-8">
        <p className="text-gray-600">Pasien tidak ditemukan</p>
        <Link
          href="/pasien"
          className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Kembali ke Daftar Pasien
        </Link>
      </div>
    </div>
  );
};

export default {
  LoadingState,
  ErrorState,
  NotFoundState
};