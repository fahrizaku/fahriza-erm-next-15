//app/rekam-medis/[id]/page.jsx
"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  FileText,
  ChevronLeft,
  Loader2,
  AlertTriangle,
  Calendar,
  Clock,
  Stethoscope,
  Pill,
  Shield,
  Printer,
  Clipboard,
  Beaker,
} from "lucide-react";
import { toast } from "react-toastify";

export default function MedicalRecordView({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [patient, setPatient] = useState(null);
  const [screening, setScreening] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);

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
          setPrescriptions(data.prescriptions);
        } else {
          setError(data.message || "Failed to fetch medical record data");
          toast.error(data.message || "Failed to fetch medical record data");
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
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // Format time
  const formatTime = (dateString) => {
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

  // Function to format blood pressure from systolic and diastolic values
  const formatBloodPressure = (systolic, diastolic) => {
    if (!systolic || !diastolic) return null;
    return `${systolic}/${diastolic}`;
  };

  // Print medical record
  const handlePrint = () => {
    window.print();
  };

  // Function to determine if a prescription is a compound prescription (racikan)
  const isCompoundPrescription = (prescription) => {
    return prescription.prescriptionType === "Racikan";
  };

  // Function to get translated prescription type
  const getPrescriptionTypeLabel = (type) => {
    switch (type) {
      case "Main":
        return "Utama";
      case "Alternative":
        return "Alternatif";
      case "Follow-up":
        return "Lanjutan";
      case "Racikan":
        return "Racikan";
      default:
        return type;
    }
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

  if (error && !medicalRecord) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Error</h3>
              <p className="mt-1 text-red-700">{error}</p>
              <button
                onClick={() => router.push("/rekam-medis")}
                className="mt-3 px-4 py-2 bg-white text-red-700 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
              >
                Kembali ke Daftar Rekam Medis
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6 print:hidden">
        <Link
          href="/rekam-medis"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Kembali ke Daftar Rekam Medis</span>
        </Link>
      </div>

      {/* Actions bar */}
      <div className="mb-6 flex justify-end space-x-3 print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center shadow-sm"
        >
          <Printer className="h-4 w-4 mr-2" />
          <span>Cetak</span>
        </button>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden print:shadow-none print:border-none">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-gray-200 bg-gray-50 print:bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
              Rekam Medis
            </h1>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="mr-2">
                {medicalRecord && formatDate(medicalRecord.visitDate)}
              </span>
              <Clock className="h-4 w-4 mr-1" />
              <span>
                {medicalRecord && formatTime(medicalRecord.visitDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Patient info card */}
        <div className="p-5 bg-blue-50 border-b border-blue-100 print:bg-white print:border-b print:border-gray-300">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center mb-2 sm:mb-0">
              <User className="h-5 w-5 text-blue-600 mr-2 print:text-gray-700" />
              <h2 className="text-lg font-semibold text-blue-800 mr-3 print:text-gray-900">
                {patient && capitalizeEachWord(patient.name)}
              </h2>
              {patient && patient.isBPJS && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-sm font-medium print:bg-gray-100 print:text-gray-700">
                  <Shield className="h-3 w-3" />
                  <span>BPJS</span>
                </div>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FileText className="h-4 w-4 mr-1" />
              <span>No. RM: </span>
              <span className="font-mono ml-1 font-medium">
                {patient && patient.no_rm}
              </span>
            </div>
          </div>
        </div>

        {/* Medical record content */}
        <div className="p-5 md:p-6 space-y-6">
          {/* Diagnosis section */}
          <div>
            <div className="flex items-center mb-4">
              <Stethoscope className="h-5 w-5 text-blue-600 mr-2 print:text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-800">Diagnosis</h3>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 print:bg-white">
              {medicalRecord && medicalRecord.icdCode && (
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-600 mr-2">
                    Kode ICD-10:
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono text-sm print:bg-gray-100 print:text-gray-800">
                    {medicalRecord.icdCode}
                  </span>
                </div>
              )}

              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-600 mb-1">
                  Diagnosis:
                </h4>
                <p className="text-gray-800">
                  {medicalRecord && medicalRecord.diagnosis}
                </p>
              </div>

              {medicalRecord && medicalRecord.clinicalNotes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">
                    Catatan Klinis:
                  </h4>
                  <p className="text-gray-800 whitespace-pre-line">
                    {medicalRecord.clinicalNotes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Complaints and vitals section */}
          {screening && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Keluhan dan Tanda Vital
              </h3>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 print:bg-white">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-1">
                    Keluhan Pasien:
                  </h4>
                  <p className="text-gray-800">{screening.complaints}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {screening.temperature && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">
                        Suhu
                      </h4>
                      <p className="text-sm font-medium">
                        {screening.temperature}°C
                      </p>
                    </div>
                  )}

                  {screening.systolicBP && screening.diastolicBP && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">
                        Tekanan Darah
                      </h4>
                      <p className="text-sm font-medium">
                        {formatBloodPressure(
                          screening.systolicBP,
                          screening.diastolicBP
                        )}{" "}
                        mmHg
                      </p>
                    </div>
                  )}

                  {screening.pulse && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">
                        Denyut Nadi
                      </h4>
                      <p className="text-sm font-medium">
                        {screening.pulse} bpm
                      </p>
                    </div>
                  )}

                  {screening.respiratoryRate && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">
                        Pernapasan
                      </h4>
                      <p className="text-sm font-medium">
                        {screening.respiratoryRate} rpm
                      </p>
                    </div>
                  )}

                  {screening.weight && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">
                        Berat Badan
                      </h4>
                      <p className="text-sm font-medium">
                        {screening.weight} kg
                      </p>
                    </div>
                  )}

                  {screening.height && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">
                        Tinggi Badan
                      </h4>
                      <p className="text-sm font-medium">
                        {screening.height} cm
                      </p>
                    </div>
                  )}

                  {screening.oxygenSaturation && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">
                        Saturasi Oksigen
                      </h4>
                      <p className="text-sm font-medium">
                        {screening.oxygenSaturation}%
                      </p>
                    </div>
                  )}

                  {screening.waistCircumference && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">
                        Lingkar Pinggang
                      </h4>
                      <p className="text-sm font-medium">
                        {screening.waistCircumference} cm
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Prescriptions section */}
          {prescriptions && prescriptions.length > 0 && (
            <div>
              <div className="flex items-center mb-4">
                <Pill className="h-5 w-5 text-blue-600 mr-2 print:text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Resep Obat
                </h3>
              </div>

              <div className="space-y-4">
                {prescriptions.map((prescription, idx) => (
                  <div
                    key={prescription.id}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 print:bg-white"
                  >
                    <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
                      <div className="flex items-center">
                        {isCompoundPrescription(prescription) ? (
                          <Beaker className="h-4 w-4 text-blue-600 mr-2 print:text-gray-700" />
                        ) : (
                          <Clipboard className="h-4 w-4 text-blue-600 mr-2 print:text-gray-700" />
                        )}
                        <h4 className="font-medium text-gray-800">
                          Resep {idx + 1}
                          {prescription.prescriptionType && (
                            <span className="ml-2 text-sm text-gray-500">
                              (
                              {getPrescriptionTypeLabel(
                                prescription.prescriptionType
                              )}
                              )
                            </span>
                          )}
                        </h4>
                      </div>
                    </div>

                    {/* For compound prescriptions (Racikan), show the shared dosage */}
                    {isCompoundPrescription(prescription) &&
                      prescription.dosage && (
                        <div className="mb-3 p-2 bg-blue-50 border border-blue-100 rounded">
                          <h5 className="text-xs font-medium text-blue-800 mb-1">
                            Dosis Racikan:
                          </h5>
                          <p className="text-sm text-blue-900">
                            {prescription.dosage}
                          </p>
                        </div>
                      )}

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              No
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Nama Obat
                            </th>
                            {!isCompoundPrescription(prescription) && (
                              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Dosis
                              </th>
                            )}
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Jumlah
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {prescription.items.map((item, index) => (
                            <tr key={item.id}>
                              <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                                {index + 1}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-800">
                                {item.manualDrugName}
                              </td>
                              {!isCompoundPrescription(prescription) && (
                                <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                                  {item.dosage}
                                </td>
                              )}
                              <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                                {item.quantity}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {prescription.notes && (
                      <div className="mt-3 text-sm">
                        <h5 className="font-medium text-gray-600">Catatan:</h5>
                        <p className="text-gray-800">{prescription.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Doctor signature */}
          <div className="mt-8 text-right print:mt-20">
            <p className="text-gray-600 mb-10">
              Dokter Pemeriksa,
              <br />
              <br />
              <br />
              <br />
              <span className="font-medium text-gray-800">
                {medicalRecord && medicalRecord.doctorName}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
