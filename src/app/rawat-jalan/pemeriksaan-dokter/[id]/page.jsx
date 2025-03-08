"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  FileText,
  ClipboardList,
  ChevronLeft,
  Save,
  Loader2,
  AlertTriangle,
  Shield,
  Plus,
  Minus,
  PenTool,
  Stethoscope,
  Pill,
  Search,
  Check,
  X,
  Clock,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify";

export default function DoctorExaminationPage({ params }) {
  const router = useRouter();
  const { id } = use(params); // Screening ID

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [patient, setPatient] = useState(null);
  const [screening, setScreening] = useState(null);

  // Medical record state
  const [medicalRecord, setMedicalRecord] = useState({
    diagnosis: "",
    icdCode: "",
    clinicalNotes: "",
    doctorName: "",
  });

  // Prescription state
  const [prescriptionItems, setPrescriptionItems] = useState([
    { id: 1, manualDrugName: "", dosage: "", quantity: 1 },
  ]);
  const [prescriptionNotes, setPrescriptionNotes] = useState("");

  // Fetch screening and patient data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/screenings/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setScreening(data.screening);
          setPatient(data.patient);
        } else {
          setError(data.message || "Failed to fetch screening data");
          toast.error(data.message || "Failed to fetch screening data");
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

  // ICD-10 related state
  const [icdSearchTerm, setIcdSearchTerm] = useState("");
  const [icdResults, setIcdResults] = useState([]);
  const [showIcdSearch, setShowIcdSearch] = useState(false);

  // Search ICD-10 codes
  const searchIcdCodes = async (term) => {
    if (term.length < 2) {
      setIcdResults([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/icd-codes/search?term=${encodeURIComponent(term)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setIcdResults(data.results);
      } else {
        console.error("Failed to search ICD codes:", data.message);
      }
    } catch (error) {
      console.error("Error searching ICD codes:", error);
    }
  };

  // Debounced ICD search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (icdSearchTerm) {
        searchIcdCodes(icdSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [icdSearchTerm]);

  // Handle selecting an ICD code
  const handleSelectIcdCode = (code, description) => {
    setMedicalRecord((prev) => ({
      ...prev,
      icdCode: code,
      diagnosis: description,
    }));
    setShowIcdSearch(false);
    setIcdSearchTerm("");
    setIcdResults([]);
  };

  // Handle medical record input changes
  const handleMedicalRecordChange = (e) => {
    const { name, value } = e.target;
    setMedicalRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle prescription item changes
  const handlePrescriptionItemChange = (index, field, value) => {
    const updatedItems = [...prescriptionItems];
    updatedItems[index][field] = value;
    setPrescriptionItems(updatedItems);
  };

  // Add prescription item
  const addPrescriptionItem = () => {
    setPrescriptionItems([
      ...prescriptionItems,
      {
        id: prescriptionItems.length + 1,
        manualDrugName: "",
        dosage: "",
        quantity: 1,
      },
    ]);
  };

  // Remove prescription item
  const removePrescriptionItem = (index) => {
    const updatedItems = [...prescriptionItems];
    updatedItems.splice(index, 1);
    setPrescriptionItems(updatedItems);
  };

  // Function to capitalize each word
  const capitalizeEachWord = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!medicalRecord.diagnosis) {
        throw new Error("Diagnosis pasien harus diisi");
      }

      if (!medicalRecord.doctorName) {
        throw new Error("Nama dokter harus diisi");
      }

      // Validate prescription items
      const invalidItems = prescriptionItems.filter(
        (item) => !item.manualDrugName || !item.dosage
      );
      if (invalidItems.length > 0) {
        throw new Error("Semua nama obat dan dosis harus diisi");
      }

      // Format data for submission
      const medicalRecordData = {
        patientId: patient.id,
        screeningId: parseInt(id),
        ...medicalRecord,
        prescription: {
          notes: prescriptionNotes,
          items: prescriptionItems.map((item) => ({
            manualDrugName: item.manualDrugName,
            dosage: item.dosage,
            quantity: parseInt(item.quantity),
          })),
        },
      };

      // Submit the medical record
      const response = await fetch("/api/medical-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(medicalRecordData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Show success message
        toast.success("Rekam medis berhasil disimpan");

        // Redirect to medical record view
        router.push(`/rekam-medis/${data.medicalRecordId}`);
      } else {
        setError(data.message || "Failed to save medical record");
        toast.error(data.message || "Failed to save medical record");
      }
    } catch (error) {
      console.error("Error saving medical record:", error);
      setError(
        error.message || "An error occurred while saving medical record"
      );
      toast.error(
        error.message || "An error occurred while saving medical record"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
            <p className="mt-4 text-gray-600">Memuat data pemeriksaan...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !screening) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Error</h3>
              <p className="mt-1 text-red-700">{error}</p>
              <button
                onClick={() => router.push("/rawat-jalan/antrian")}
                className="mt-3 px-4 py-2 bg-white text-red-700 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
              >
                Kembali ke Antrian
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
      <div className="mb-6">
        <Link
          href="/rawat-jalan/antrian"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Kembali ke Antrian</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-gray-200 bg-gray-50">
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            Pemeriksaan Dokter
          </h1>
          <p className="text-gray-600">Isi diagnosa dan resep untuk pasien</p>
        </div>

        {/* Patient info card */}
        <div className="p-5 bg-blue-50 border-b border-blue-100">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center mb-2 sm:mb-0">
              <User className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-blue-800 mr-3">
                {patient && capitalizeEachWord(patient.name)}
              </h2>
              {patient && patient.isBPJS && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
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

        {/* Screening summary */}
        {screening && (
          <div className="p-5 border-b border-gray-200 bg-gray-50">
            <h3 className="text-md font-semibold text-gray-800 mb-3">
              Hasil Skrining
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-600">
                  Keluhan Pasien:
                </h4>
                <p className="mt-1 text-gray-800">{screening.complaints}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {screening.temperature && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500">Suhu</h4>
                    <p className="text-sm font-medium">
                      {screening.temperature}°C
                    </p>
                  </div>
                )}

                {screening.bloodPressure && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500">
                      Tekanan Darah
                    </h4>
                    <p className="text-sm font-medium">
                      {screening.bloodPressure} mmHg
                    </p>
                  </div>
                )}

                {screening.pulse && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500">
                      Denyut Nadi
                    </h4>
                    <p className="text-sm font-medium">{screening.pulse} bpm</p>
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
                    <p className="text-sm font-medium">{screening.weight} kg</p>
                  </div>
                )}

                {screening.height && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500">
                      Tinggi Badan
                    </h4>
                    <p className="text-sm font-medium">{screening.height} cm</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-5 md:p-6">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Diagnosis section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Stethoscope className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Diagnosis
                </h3>
              </div>

              {/* ICD-10 search */}
              <div className="mb-4 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode ICD-10 / Diagnosis
                </label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Cari kode ICD-10"
                    value={icdSearchTerm}
                    onChange={(e) => {
                      setIcdSearchTerm(e.target.value);
                      setShowIcdSearch(true);
                    }}
                    onFocus={() => setShowIcdSearch(true)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowIcdSearch(!showIcdSearch)}
                    className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md"
                  >
                    <Search className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {/* ICD code display */}
                {medicalRecord.icdCode && (
                  <div className="mt-2 flex items-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-sm">
                      {medicalRecord.icdCode}
                    </span>
                    <span className="ml-2 text-gray-600">
                      {medicalRecord.diagnosis}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setMedicalRecord((prev) => ({
                          ...prev,
                          icdCode: "",
                          diagnosis: "",
                        }));
                      }}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* ICD search results */}
                {showIcdSearch && icdResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white shadow-lg border border-gray-200 rounded-md max-h-60 overflow-y-auto">
                    <ul>
                      {icdResults.map((result) => (
                        <li
                          key={result.code}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 flex items-start"
                          onClick={() =>
                            handleSelectIcdCode(result.code, result.description)
                          }
                        >
                          <span className="font-mono text-blue-600 inline-block min-w-[70px]">
                            {result.code}
                          </span>
                          <span className="ml-2 text-gray-800">
                            {result.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Manual diagnosis input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis Manual
                </label>
                <textarea
                  name="diagnosis"
                  value={medicalRecord.diagnosis}
                  onChange={handleMedicalRecordChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Deskripsi diagnosis"
                />
              </div>

              {/* Clinical notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan Klinis Tambahan
                </label>
                <textarea
                  name="clinicalNotes"
                  value={medicalRecord.clinicalNotes}
                  onChange={handleMedicalRecordChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Catatan tambahan (opsional)"
                />
              </div>
            </div>

            {/* Prescription section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Pill className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Resep Obat
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={addPrescriptionItem}
                  className="px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Tambah Obat
                </button>
              </div>

              {/* Prescription items */}
              <div className="space-y-4">
                {prescriptionItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 border border-gray-200 rounded-md bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-sm font-medium text-gray-700">
                        Obat #{index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removePrescriptionItem(index)}
                        disabled={prescriptionItems.length === 1}
                        className={`p-1 rounded-full ${
                          prescriptionItems.length === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-500 hover:bg-red-100"
                        }`}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Drug name */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Nama Obat
                        </label>
                        <input
                          type="text"
                          value={item.manualDrugName}
                          onChange={(e) =>
                            handlePrescriptionItemChange(
                              index,
                              "manualDrugName",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nama obat"
                        />
                      </div>

                      {/* Dosage */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Dosis
                        </label>
                        <input
                          type="text"
                          value={item.dosage}
                          onChange={(e) =>
                            handlePrescriptionItemChange(
                              index,
                              "dosage",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="3x sehari setelah makan"
                        />
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Jumlah
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handlePrescriptionItemChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Prescription notes */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan Tambahan Resep
                </label>
                <textarea
                  value={prescriptionNotes}
                  onChange={(e) => setPrescriptionNotes(e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Catatan tambahan untuk apoteker (opsional)"
                />
              </div>
            </div>

            {/* Doctor name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <PenTool className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Nama Dokter</span>
                </div>
              </label>
              <input
                type="text"
                name="doctorName"
                value={medicalRecord.doctorName}
                onChange={handleMedicalRecordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nama dokter yang memeriksa"
                required
              />
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    <span>Simpan & Buat Rekam Medis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
