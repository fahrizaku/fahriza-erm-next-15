//pasien/[id]/edit/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Calendar,
  MapPin,
  FileText,
  Shield,
  ChevronLeft,
  Save,
  X,
  Loader2,
  AlertTriangle,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";

export default function PatientEditPage({ params }) {
  const router = useRouter();
  const { id } = React.use(params);

  const [patient, setPatient] = useState(null);
  const [editedPatient, setEditedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setIsLoading(true);
        const urlParams = new URLSearchParams(window.location.search);
        const isBPJS = urlParams.get("isBPJS") === "true";

        const response = await fetch(`/api/patients/${id}?isBPJS=${isBPJS}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setPatient(data.patient);
          setEditedPatient(data.patient);
        } else {
          setError(data.message || "Failed to fetch patient data");
          toast.error(data.message || "Failed to fetch patient data");
        }
      } catch (error) {
        console.error("Error fetching patient:", error);
        setError("An error occurred while fetching patient data");
        toast.error("An error occurred while fetching patient data");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPatientData();
    }
  }, [id]);

  // Format date to YYYY-MM-DD for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Calculate age based on birthDate
  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    const birth = new Date(birthDate);
    const ageDifMs = Date.now() - birth.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Prevent changing isBPJS status
    if (name === "isBPJS") return;

    // Only allow BPJS patients to update no_bpjs
    if (name === "no_bpjs" && !patient.isBPJS) return;

    setEditedPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Ensure we're maintaining the original isBPJS status
      const dataToSubmit = {
        ...editedPatient,
        birthDate: editedPatient.birthDate
          ? new Date(editedPatient.birthDate).toISOString()
          : null,
        isBPJS: patient.isBPJS, // Keep original isBPJS status
      };

      // Remove no_bpjs if not a BPJS patient
      if (!patient.isBPJS) {
        delete dataToSubmit.no_bpjs;
      }

      const response = await fetch(`/api/patients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Show success toast message
        toast.success("Data pasien berhasil diperbarui", {
          icon: () => <Check className="h-5 w-5 text-green-500" />,
          autoClose: 3000,
        });

        // Redirect back to the patient detail page
        router.push(`/pasien/${id}`);
      } else {
        setError(data.message || "Failed to update patient data");
        toast.error(data.message || "Failed to update patient data");
      }
    } catch (error) {
      console.error("Error updating patient:", error);
      setError("An error occurred while updating patient data");
      toast.error("An error occurred while updating patient data");
    } finally {
      setIsSaving(false);
    }
  };

  // Function to capitalize each word
  const capitalizeEachWord = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (isLoading) {
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

  if (!patient) {
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
  }

  return (
    // Main container
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href={`/pasien/${id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Kembali ke Detail Pasien</span>
        </Link>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {/* Header section */}
        <div className="p-5 md:p-8 border-b border-gray-200">
          <div className="space-y-4 md:space-y-0 md:flex md:items-start md:justify-between">
            {/* Patient info */}
            <div className="flex-1">
              {/* Name container with input */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="w-full mb-3">
                  <input
                    type="text"
                    name="name"
                    value={editedPatient.name || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama Pasien"
                  />
                </div>
              </div>

              {/* Medical record number */}
              <div className="flex items-center flex-wrap gap-2">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-600 mr-2">No. RM:</span>
                  <span className="font-mono px-3 py-1 rounded text-black font-bold">
                    {patient.no_rm}
                  </span>
                </div>

                {/* Status badge */}
                {patient.isBPJS ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-sm font-medium shadow-sm">
                    <Shield className="h-4 w-4" />
                    <span>BPJS</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                    <User className="h-4 w-4" />
                    <span>Umum</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Patient information form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column - Personal Information */}
              <div>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-500" />
                    Informasi Pribadi
                  </h3>

                  {/* Gender field */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Kelamin
                    </label>
                    <select
                      name="gender"
                      value={editedPatient.gender || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Jenis Kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  {/* Birth Date */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Tanggal Lahir</span>
                      </div>
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formatDateForInput(editedPatient.birthDate)}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Alamat</span>
                      </div>
                    </label>
                    <textarea
                      name="address"
                      value={editedPatient.address || ""}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Alamat lengkap"
                    />
                  </div>
                </div>
              </div>

              {/* Right column - Identity Information */}
              <div>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    Informasi Identitas
                  </h3>

                  {/* Phone Number */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={editedPatient.phoneNumber || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: 08123456789"
                    />
                  </div>

                  {/* NIK */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIK
                    </label>
                    <input
                      type="text"
                      name="nik"
                      value={editedPatient.nik || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nomor Induk Kependudukan"
                    />
                  </div>

                  {/* BPJS Number - only editable for BPJS patients */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {patient.isBPJS ? "Nomor BPJS" : "Status BPJS"}
                    </label>
                    <div>
                      {patient.isBPJS ? (
                        <input
                          type="text"
                          name="no_bpjs"
                          value={editedPatient.no_bpjs || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nomor BPJS"
                        />
                      ) : (
                        <p className="text-gray-500 italic">
                          Tidak memiliki BPJS
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col sm:flex-row sm:justify-end gap-3">
              <Link
                href={`/pasien/${id}`}
                className="px-4 py-3 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center sm:w-auto"
              >
                <X className="h-4 w-4 mr-2" />
                <span>Batal</span>
              </Link>
              <button
                type="submit"
                className="px-4 py-3 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center sm:w-auto shadow-sm"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    <span>Simpan Perubahan</span>
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
