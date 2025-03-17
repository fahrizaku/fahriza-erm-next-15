"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  RefreshCcw,
  User,
  PhoneCall,
  Stethoscope,
  CreditCard,
  MapPin,
} from "lucide-react";
import { toast } from "react-toastify";

export default function RuangPemeriksaanPage() {
  const router = useRouter();

  const [patientList, setPatientList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch only patients with "called" status
  const fetchCalledPatients = async () => {
    try {
      const isRefreshing = refreshing;
      if (!isRefreshing) setLoading(true);

      const response = await fetch("/api/outpatient/queue?status=called");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setPatientList(data.queue);
      } else {
        setError(data.message || "Failed to fetch patient data");
        toast.error(data.message || "Failed to fetch patient data");
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setError("An error occurred while fetching patient data");
      if (!refreshing) {
        toast.error("An error occurred while fetching patient data");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCalledPatients();

    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(() => {
      setRefreshing(true);
      fetchCalledPatients();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle manual refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchCalledPatients();
  };

  // Handle examining a patient (change status to "in-progress" and redirect)
  const handleExaminePatient = async (screeningId) => {
    try {
      const response = await fetch(
        `/api/outpatient/queue/${screeningId}/examine`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        toast.success(`Pasien ${data.patientName} sedang diperiksa`);

        // Redirect to doctor's examination page
        router.push(`/rawat-jalan/pemeriksaan-dokter/${screeningId}`);
      } else {
        toast.error(data.message || "Failed to examine patient");
      }
    } catch (error) {
      console.error("Error examining patient:", error);
      toast.error("An error occurred while examining patient");
    }
  };

  // Helper function to calculate age from birthDate
  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  // UI components for different states
  const LoadingState = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-500">{message}</p>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-gray-100 rounded-full p-4 mb-4">
        <PhoneCall className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        Tidak ada pasien yang dipanggil
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        Saat ini tidak ada pasien yang sudah dipanggil dan siap untuk diperiksa.
      </p>
    </div>
  );

  const ErrorState = ({ error }) => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-red-100 rounded-full p-4 mb-4">
        <svg
          className="h-8 w-8 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        Terjadi kesalahan
      </h3>
      <p className="text-gray-500 text-center max-w-md">{error}</p>
    </div>
  );

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
            <h2 className="text-lg font-medium text-gray-900">
              Ruang Pemeriksaan
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Pasien yang sudah dipanggil dan siap untuk diperiksa
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white ${
              refreshing ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            <RefreshCcw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Memperbarui..." : "Perbarui"}
          </button>
        </div>

        {/* Patient list */}
        <div className="p-4">
          {loading ? (
            <LoadingState message="Memuat data pasien..." />
          ) : error ? (
            <ErrorState error={error} />
          ) : patientList.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patientList.map((patient) => (
                <div
                  key={patient.screeningId}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <div className="flex items-center space-x-2">
                      <div className="inline-flex items-center justify-center h-6 w-6 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {patient.queueNumber}
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {patient.patientName}
                      </h3>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <PhoneCall className="w-3 h-3 mr-1" />
                        Dipanggil
                      </span>
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-500 mr-2" />
                        <p>
                          {patient.gender || "N/A"} ·{" "}
                          {calculateAge(patient.birthDate)} tahun
                        </p>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                        <p className="line-clamp-2">
                          {patient.address || "N/A"}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 text-gray-500 mr-2" />
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500">
                            Tipe Pembayaran:
                          </span>
                          {patient.isBPJSActive ? (
                            <span className="ml-1 px-1.5 py-0.5 bg-green-100 text-green-800 font-medium rounded text-xs">
                              BPJS
                            </span>
                          ) : (
                            <span className="ml-1 font-medium text-gray-900">
                              Umum
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-200 flex justify-end">
                      <button
                        onClick={() =>
                          handleExaminePatient(patient.screeningId)
                        }
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Stethoscope className="w-3 h-3 mr-1" />
                        Periksa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
