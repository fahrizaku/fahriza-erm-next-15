"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  FileText,
  Calendar,
  ChevronLeft,
  Loader2,
  AlertTriangle,
  Shield,
  Stethoscope,
  Pill,
  ClipboardList,
  Printer,
  Download,
  FileDown,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";

export default function MedicalRecordPage({ params }) {
  const router = useRouter();
  const { id } = use(params); // Medical record ID or screening ID

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [patient, setPatient] = useState(null);
  const [screening, setScreening] = useState(null);
  const [prescription, setPrescription] = useState(null);

  // Fetch medical record data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/medical-records/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setMedicalRecord(data.medicalRecord);
          setPatient(data.patient);
          setScreening(data.screening);
          setPrescription(data.prescription);
        } else {
          setError(data.message || "Failed to fetch medical record");
          toast.error(data.message || "Failed to fetch medical record");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
        toast.error("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to capitalize each word
  const capitalizeEachWord = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Print medical record
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
            <p className="mt-4 text-gray-600">Memuat rekam medis...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Error</h3>
              <p className="mt-1 text-red-700">{error}</p>
              <button
                onClick={() => router.push("/pasien")}
                className="mt-3 px-4 py-2 bg-white text-red-700 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
              >
                Kembali ke Daftar Pasien
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!medicalRecord) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="text-center py-8">
          <p className="text-gray-600">Rekam medis tidak ditemukan</p>
          <Link
            href="/pasien"
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Kembali ke Daftar Pasien
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Back button and actions */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href={`/pasien/${patient?.id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Kembali ke Detail Pasien</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center"
          >
            <Printer className="h-4 w-4 mr-1.5" />
            <span>Cetak</span>
          </button>

          <button
            onClick={() => {
              toast.info("Fitur unduh rekam medis belum tersedia");
            }}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-1.5" />
            <span>Unduh PDF</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden print:shadow-none print:border-none">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-gray-200 bg-gray-50 print:bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Rekam Medis Pasien
              </h1>
              <p className="text-gray-600 mt-1">
                Kunjungan Rawat Jalan - {formatDate(medicalRecord.visitDate)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">ID: </span>
              <span className="font-mono bg-blue-50 px-2 py-0.5 rounded text-blue-700 text-sm">
                {medicalRecord.id}
              </span>
            </div>
          </div>
        </div>

        {/* Patient info card */}
        <div className="p-5 bg-blue-50 border-b border-blue-100 print:bg-white print:border-b-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="flex items-center text-lg font-semibold text-blue-800 mb-2">
                <User className="h-5 w-5 text-blue-600 mr-2" />
                {patient && capitalizeEachWord(patient.name)}
                {patient && patient.isBPJS && (
                  <div className="ml-2 flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <Shield className="h-3 w-3" />
                    <span>BPJS</span>
                  </div>
                )}
              </h2>
              <div className="space-y-1 text-sm">
                <div className="flex items-center text-gray-600">
                  <span className="font-medium mr-1">No. RM:</span>
                  <span className="font-mono text-gray-800">
                    {patient && patient.no_rm}
                  </span>
                </div>
                {patient && patient.isBPJS && patient.no_bpjs && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium mr-1">No. BPJS:</span>
                    <span className="font-mono text-gray-800">
                      {patient.no_bpjs}
                    </span>
                  </div>
                )}
                {patient && patient.gender && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium mr-1">Jenis Kelamin:</span>
                    <span className="text-gray-800">{patient.gender}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-500 mr-1.5" />
                  <span className="font-medium mr-1">Tanggal Kunjungan:</span>
                  <span className="text-gray-800">
                    {formatDate(medicalRecord.visitDate)}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 text-gray-500 mr-1.5" />
                  <span className="font-medium mr-1">Jam:</span>
                  <span className="text-gray-800">
                    {formatTime(medicalRecord.visitDate)}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Stethoscope className="h-4 w-4 text-gray-500 mr-1.5" />
                  <span className="font-medium mr-1">Dokter:</span>
                  <span className="text-gray-800">
                    {medicalRecord.doctorName || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medical record content */}
        <div className="p-5 md:p-6">
          {/* Screening section */}
          {screening && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                Skrining Awal
              </h3>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Keluhan Pasien:
                </h4>
                <p className="text-gray-800">{screening.complaints}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {screening.temperature && (
                  <div className="bg-white p-3 border border-gray-200 rounded-md">
                    <h4 className="text-xs font-medium text-gray-500 mb-1">
                      Suhu Tubuh
                    </h4>
                    <p className="text-lg font-medium text-gray-800">
                      {screening.temperature}°C
                    </p>
                  </div>
                )}

                {screening.bloodPressure && (
                  <div className="bg-white p-3 border border-gray-200 rounded-md">
                    <h4 className="text-xs font-medium text-gray-500 mb-1">
                      Tekanan Darah
                    </h4>
                    <p className="text-lg font-medium text-gray-800">
                      {screening.bloodPressure} mmHg
                    </p>
                  </div>
                )}

                {screening.pulse && (
                  <div className="bg-white p-3 border border-gray-200 rounded-md">
                    <h4 className="text-xs font-medium text-gray-500 mb-1">
                      Denyut Nadi
                    </h4>
                    <p className="text-lg font-medium text-gray-800">
                      {screening.pulse} bpm
                    </p>
                  </div>
                )}

                {screening.respiratoryRate && (
                  <div className="bg-white p-3 border border-gray-200 rounded-md">
                    <h4 className="text-xs font-medium text-gray-500 mb-1">
                      Pernapasan
                    </h4>
                    <p className="text-lg font-medium text-gray-800">
                      {screening.respiratoryRate} rpm
                    </p>
                  </div>
                )}

                {screening.weight && (
                  <div className="bg-white p-3 border border-gray-200 rounded-md">
                    <h4 className="text-xs font-medium text-gray-500 mb-1">
                      Berat Badan
                    </h4>
                    <p className="text-lg font-medium text-gray-800">
                      {screening.weight} kg
                    </p>
                  </div>
                )}

                {screening.height && (
                  <div className="bg-white p-3 border border-gray-200 rounded-md">
                    <h4 className="text-xs font-medium text-gray-500 mb-1">
                      Tinggi Badan
                    </h4>
                    <p className="text-lg font-medium text-gray-800">
                      {screening.height} cm
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Diagnosis section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Diagnosis
            </h3>

            <div className="space-y-4">
              {medicalRecord.icdCode && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Kode ICD-10:
                  </h4>
                  <div className="bg-blue-50 px-3 py-2 rounded-md inline-block">
                    <span className="font-mono text-blue-800">
                      {medicalRecord.icdCode}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Diagnosis:
                </h4>
                <div className="bg-white p-3 border border-gray-200 rounded-md">
                  <p className="text-gray-800">
                    {medicalRecord.diagnosis || "-"}
                  </p>
                </div>
              </div>

              {medicalRecord.clinicalNotes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Catatan Klinis:
                  </h4>
                  <div className="bg-white p-3 border border-gray-200 rounded-md">
                    <p className="text-gray-800">
                      {medicalRecord.clinicalNotes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Prescription section */}
          {prescription && (
            <div>
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  Resep Obat
                </h3>
                <button
                  onClick={() => {
                    toast.info("Fitur cetak resep belum tersedia");
                  }}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
                >
                  <FileDown className="h-4 w-4 mr-1" />
                  <span>Cetak Resep</span>
                </button>
              </div>

              {prescription.items.length === 0 ? (
                <p className="text-gray-600 italic">Tidak ada resep obat</p>
              ) : (
                <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          No
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Nama Obat
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Dosis
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Jumlah
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {prescription.items.map((item, index) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.manualDrugName || item.drug?.name || "-"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {item.dosage || "-"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {item.quantity} {item.drug?.unit || ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {prescription.notes && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Catatan Resep:
                  </h4>
                  <div className="bg-white p-3 border border-gray-200 rounded-md">
                    <p className="text-gray-800">{prescription.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Meta information */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div>
                <span className="font-medium">Dibuat:</span>{" "}
                {formatDate(medicalRecord.createdAt)}{" "}
                {formatTime(medicalRecord.createdAt)}
              </div>
              {medicalRecord.createdAt !== medicalRecord.updatedAt && (
                <div>
                  <span className="font-medium">Diperbarui:</span>{" "}
                  {formatDate(medicalRecord.updatedAt)}{" "}
                  {formatTime(medicalRecord.updatedAt)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
