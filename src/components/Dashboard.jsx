"use client";
import React, { useState, useEffect } from "react";
import { User, Package, Shield, Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DashboardKlinik = () => {
  const router = useRouter();
  // State untuk data dashboard dengan default nilai string "0"
  const [data, setData] = useState({
    pasienUmum: "0",
    pasienBPJS: "0",
    produkApotek: "0",
  });

  // State untuk loading halaman dashboard
  const [loading, setLoading] = useState(true);
  // State untuk loading navigasi
  const [navLoading, setNavLoading] = useState({
    pasienUmum: false,
    pasienBPJS: false,
    produkApotek: false,
  });
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

  // Handler navigasi dengan loading state
  const handleNavigation = (path, loadingKey) => {
    // Set loading state untuk kartu yang diklik
    setNavLoading((prev) => ({ ...prev, [loadingKey]: true }));

    // Navigasi ke halaman baru
    setTimeout(() => {
      router.push(path);
    }, 100); // Sedikit delay untuk menampilkan loading state
  };

  // Loading state untuk seluruh dashboard
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto pt-4 px-1 sm:p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
            Dashboard Klinik
          </h1>
          <div className="flex flex-col justify-center items-center h-48">
            <div className="mb-4">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-gray-600 font-medium">Memuat data...</div>
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

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card Pasien Umum */}
            <div
              onClick={() => handleNavigation("/pasien", "pasienUmum")}
              className="block cursor-pointer"
            >
              <div className="bg-white rounded-lg p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col">
                  <div className="text-blue-500 mb-3">
                    {navLoading.pasienUmum ? (
                      <Loader size={24} className="animate-spin" />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <h3 className="text-sm text-gray-500 font-medium mb-1">
                    Pasien Umum
                  </h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {data.pasienUmum}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Pasien BPJS */}
            <div
              onClick={() => handleNavigation("/pasien", "pasienBPJS")}
              className="block cursor-pointer"
            >
              <div className="bg-white rounded-lg p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col">
                  <div className="text-green-500 mb-3">
                    {navLoading.pasienBPJS ? (
                      <Loader size={24} className="animate-spin" />
                    ) : (
                      <Shield size={24} />
                    )}
                  </div>
                  <h3 className="text-sm text-gray-500 font-medium mb-1">
                    Pasien BPJS
                  </h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {data.pasienBPJS}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Semua Produk Apotek */}
            <div
              onClick={() => handleNavigation("/apotek/produk", "produkApotek")}
              className="block cursor-pointer"
            >
              <div className="bg-white rounded-lg p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col">
                  <div className="text-purple-500 mb-3">
                    {navLoading.produkApotek ? (
                      <Loader size={24} className="animate-spin" />
                    ) : (
                      <Package size={24} />
                    )}
                  </div>
                  <h3 className="text-sm text-gray-500 font-medium mb-1">
                    Produk Apotek
                  </h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {data.produkApotek}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardKlinik;
