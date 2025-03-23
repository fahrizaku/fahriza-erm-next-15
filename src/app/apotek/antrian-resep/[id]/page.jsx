"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  FileText,
  User,
  Calendar,
  Pill,
  Clock,
  Loader2,
  CreditCard,
} from "lucide-react";
import { toast } from "react-toastify";

export default function PrescriptionDetailsPage({ params }) {
  const router = useRouter();
  const { id } = use(params); // This is the medicalRecordId

  const [loading, setLoading] = useState(true);
  const [prescription, setPrescription] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchPrescriptionDetails() {
      try {
        setLoading(true);
        const response = await fetch(`/api/pharmacy/prescriptions/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setPrescription(data.prescription);
        } else {
          setError(data.message || "Failed to fetch prescription details");
          toast.error(data.message || "Failed to fetch prescription details");
        }
      } catch (error) {
        console.error("Error fetching prescription details:", error);
        setError("An error occurred while fetching prescription details");
        toast.error("An error occurred while fetching prescription details");
      } finally {
        setLoading(false);
      }
    }

    fetchPrescriptionDetails();
  }, [id]);

  const handleMarkAsReady = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch(
        `/api/pharmacy/queue/${prescription.medicalRecordId}/ready`,
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
        // Update the prescription state locally instead of redirecting
        setPrescription({
          ...prescription,
          status: "ready",
        });
        toast.success(`Resep siap diambil`);
      } else {
        toast.error(data.message || "Failed to mark prescription as ready");
      }
    } catch (error) {
      console.error("Error marking prescription as ready:", error);
      toast.error("An error occurred while marking prescription as ready");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDispense = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch(
        `/api/pharmacy/queue/${prescription.medicalRecordId}/dispense`,
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
        // Update the prescription state locally
        setPrescription({
          ...prescription,
          status: "dispensed",
        });
        toast.success(`Resep telah diserahkan`);
      } else {
        toast.error(data.message || "Failed to dispense prescription");
      }
    } catch (error) {
      console.error("Error dispensing prescription:", error);
      toast.error("An error occurred while dispensing prescription");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-3 text-gray-600">Memuat data resep...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-xl">⚠️</div>
            <p className="mt-3 text-red-600">{error}</p>
            <button
              onClick={() => router.push("/apotek/antrian-resep")}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Kembali ke Antrian
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-yellow-500 text-xl">⚠️</div>
            <p className="mt-3 text-gray-600">Data resep tidak ditemukan</p>
            <button
              onClick={() => router.push("/apotek/antrian-resep")}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Kembali ke Antrian
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "preparing":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <Clock className="w-4 h-4 mr-1" />
            Sedang Disiapkan
          </div>
        );
      case "ready":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            <Clock className="w-4 h-4 mr-1" />
            Siap Diambil
          </div>
        );
      case "dispensed":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <Clock className="w-4 h-4 mr-1" />
            Telah Diserahkan
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1" />
            Menunggu
          </div>
        );
    }
  };

  const getPaymentTypeBadge = (isBPJSActive) => {
    return isBPJSActive ? (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <CreditCard className="w-4 h-4 mr-1" />
        BPJS
      </div>
    ) : (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
        <CreditCard className="w-4 h-4 mr-1" />
        Umum
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/apotek/antrian-resep"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Kembali ke Antrian Farmasi</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Detail Resep
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Informasi resep dan obat pasien
              </p>
            </div>

            {/* Status badges - Stacked on mobile */}
            <div className="mt-3 md:mt-0 flex flex-wrap gap-2">
              {getStatusBadge(prescription.status)}
              {getPaymentTypeBadge(prescription.isBPJSActive)}
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                Nomor Antrian: {prescription.queueNumber}
              </div>
            </div>
          </div>
        </div>

        {/* Patient Info */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-3">
            Informasi Pasien
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Nama Pasien</p>
                  <p className="font-medium">{prescription.patientName}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Tanggal Kunjungan</p>
                  <p className="font-medium">
                    {new Date(prescription.visitDate).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start">
                <FileText className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Diagnosis</p>
                  <p className="font-medium">{prescription.diagnosis}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Pill className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Jumlah Resep</p>
                  <p className="font-medium">
                    {prescription.prescriptions.length} Resep
                  </p>
                </div>
              </div>
              {prescription.pharmacistName && (
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Petugas Farmasi</p>
                    <p className="font-medium">{prescription.pharmacistName}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Prescriptions */}
        <div className="px-4 sm:px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900 mb-3">
            Daftar Resep
          </h2>

          {prescription.prescriptions.map((rx, index) => (
            <div
              key={rx.id}
              className={`bg-white border border-gray-200 rounded-lg ${
                index > 0 ? "mt-4" : ""
              }`}
            >
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">
                    Resep {index + 1}{" "}
                    {rx.prescriptionType ? `(${rx.prescriptionType})` : ""}
                  </h3>
                  {rx.prescriptionType === "Racikan" && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Racikan
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4">
                {/* Racikan dosage */}
                {rx.prescriptionType === "Racikan" && rx.dosage && (
                  <div className="mb-3 pb-2 border-b border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Aturan Pakai:</p>
                    <p className="font-medium">{rx.dosage}</p>
                  </div>
                )}

                {/* Mobile-friendly table */}
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Nama Obat
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Dosis
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Jumlah
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {rx.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-3 py-2 text-sm font-medium text-gray-900">
                              {item.manualDrugName}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-500">
                              {rx.prescriptionType === "Racikan"
                                ? "-"
                                : item.dosage || "-"}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-500 text-right">
                              {item.quantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile alternative for very small screens */}
                <div className="block sm:hidden mt-4">
                  {rx.items.map((item) => (
                    <div
                      key={item.id}
                      className="border-b border-gray-200 py-3"
                    >
                      <div className="flex justify-between">
                        <div className="font-medium text-gray-900">
                          {item.manualDrugName}
                        </div>
                        <div className="text-gray-500">{item.quantity}</div>
                      </div>
                      {rx.prescriptionType !== "Racikan" && item.dosage && (
                        <div className="text-sm text-gray-500 mt-1">
                          Dosis: {item.dosage}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Notes */}
                {rx.notes && (
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Catatan:</p>
                    <p className="text-sm italic">{rx.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end gap-3">
          <button
            onClick={() => router.push("/apotek/antrian-resep")}
            className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Kembali ke Antrian
          </button>

          {prescription.status === "preparing" && (
            <button
              onClick={handleMarkAsReady}
              disabled={isProcessing}
              className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Tandai Siap Diambil"
              )}
            </button>
          )}

          {prescription.status === "ready" && (
            <button
              onClick={handleDispense}
              disabled={isProcessing}
              className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Serahkan Resep"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
