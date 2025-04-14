"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, TestTube, RefreshCcw, Beaker } from "lucide-react";

export default function RuangLaboratoriumPage() {
  // Handle refresh click - just for visual effect since feature isn't built
  const handleRefresh = () => {
    // Could add a toast notification here if desired
    console.log("Refresh clicked, but lab feature is not implemented yet");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/pasien"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Kembali ke Daftar Pasien</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Ruang Laboratorium</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manajemen pemeriksaan laboratorium pasien
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Perbarui
          </button>
        </div>

        {/* Feature not available message */}
        <div className="p-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-blue-100 rounded-full p-6 mb-4">
              <TestTube className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">
              Fitur Laboratorium Belum Tersedia
            </h3>
            <p className="text-gray-500 max-w-md mb-6">
              Maaf, fitur laboratorium saat ini sedang dalam pengembangan dan belum dapat digunakan.
            </p>
            <div className="mt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/pasien"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Kembali ke Daftar Pasien
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}