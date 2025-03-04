"use client";
import React, { useState, useEffect } from "react";
// Periksa impor dari lucide-react
import { User, Activity, Package, Pill, Shield } from "lucide-react";

const DashboardKlinik = () => {
  // State untuk data dashboard dengan default nilai string "0"
  const [data, setData] = useState({
    pasienUmum: "0",
    pasienBPJS: "0",
    produkApotek: "0",
    obatResep: "0",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data dari API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/dashboard");

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const dashboardData = await response.json();

        // Memastikan semua nilai dalam bentuk string
        const safeData = {
          pasienUmum: String(dashboardData.pasienUmum || "0"),
          pasienBPJS: String(dashboardData.pasienBPJS || "0"),
          produkApotek: String(dashboardData.produkApotek || "0"),
          obatResep: String(dashboardData.obatResep || "0"),
        };

        setData(safeData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto pt-4 px-1 sm:p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
            Dashboard Klinik
          </h1>
          <div className="flex justify-center items-center h-48">
            <div className="animate-pulse text-gray-400">Memuat data...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto pt-4 px-1 sm:p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
            Dashboard Klinik
          </h1>
          <div className="bg-red-50 p-4 rounded-lg text-red-600 border border-red-200">
            <p>Terjadi kesalahan: {error}</p>
            <p className="text-sm mt-2">Silakan coba muat ulang halaman.</p>
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard content
  return (
    <div className="max-w-6xl mx-auto pt-4 px-1 sm:p-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
            Dashboard Klinik
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card Pasien Umum */}
            <div className="bg-white rounded-lg p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col">
                <div className="text-blue-500 mb-3">
                  <User size={24} />
                </div>
                <h3 className="text-sm text-gray-500 font-medium mb-1">
                  Pasien Umum
                </h3>
                <p className="text-2xl font-bold text-gray-800">
                  {data.pasienUmum}
                </p>
              </div>
            </div>

            {/* Card Pasien BPJS */}
            <div className="bg-white rounded-lg p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col">
                <div className="text-green-500 mb-3">
                  <Shield size={24} />
                </div>
                <h3 className="text-sm text-gray-500 font-medium mb-1">
                  Pasien BPJS
                </h3>
                <p className="text-2xl font-bold text-gray-800">
                  {data.pasienBPJS}
                </p>
              </div>
            </div>

            {/* Card Semua Produk Apotek */}
            <div className="bg-white rounded-lg p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col">
                <div className="text-purple-500 mb-3">
                  <Package size={24} />
                </div>
                <h3 className="text-sm text-gray-500 font-medium mb-1">
                  Produk Apotek
                </h3>
                <p className="text-2xl font-bold text-gray-800">
                  {data.produkApotek}
                </p>
              </div>
            </div>

            {/* Card Obat Resep */}
            <div className="bg-white rounded-lg p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col">
                <div className="text-amber-500 mb-3">
                  <Pill size={24} />
                </div>
                <h3 className="text-sm text-gray-500 font-medium mb-1">
                  Obat Resep
                </h3>
                <p className="text-2xl font-bold text-gray-800">
                  {data.obatResep}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardKlinik;
