//detailpatient page
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
  Edit,
  Save,
  X,
  Loader2,
  AlertTriangle,
  Check,
  ClipboardList,
  Stethoscope,
  Bed,
  Phone,
  Copy,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";

export default function PatientDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;

  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  // Removed patient deletion states
  const [error, setError] = useState(null);

  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setIsLoading(true);
        // Coba ambil dari query string apakah ini pasien BPJS
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

  const handleCopyBPJS = () => {
    if (!patient.no_bpjs) return;

    const copyToClipboard = (text) => {
      // Mengembalikan Promise secara eksplisit
      return new Promise((resolve, reject) => {
        if (navigator.clipboard) {
          // Metode modern
          navigator.clipboard
            .writeText(text)
            .then(resolve)
            .catch(() => {
              // Fallback ke metode legacy jika Clipboard API gagal
              legacyCopy(text, resolve, reject);
            });
        } else {
          // Langsung gunakan metode legacy jika Clipboard API tidak tersedia
          legacyCopy(text, resolve, reject);
        }
      });
    };

    const legacyCopy = (text, resolve, reject) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        successful ? resolve() : reject(new Error("Gagal menyalin"));
      } catch (err) {
        document.body.removeChild(textArea);
        reject(err);
      }
    };

    copyToClipboard(patient.no_bpjs)
      .then(() => {
        toast.success("Nomor BPJS disalin ke clipboard");
      })
      .catch((err) => {
        console.error("Gagal menyalin:", err);
        toast.error("Gagal menyalin nomor BPJS");
      });
  };

  // Format phone number for links (convert leading 0 to 62)
  const formatPhoneForLink = (phone) => {
    if (!phone) return "";

    // First remove any non-digit characters
    let cleanNumber = phone.replace(/\D/g, "");

    // If the number starts with 0, replace it with 62
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "62" + cleanNumber.substring(1);
    }

    return cleanNumber;
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
        setPatient(data.patient);
        setIsEditing(false);

        // Show success toast message
        toast.success("Data pasien berhasil diperbarui", {
          icon: () => <Check className="h-5 w-5 text-green-500" />,
          autoClose: 3000,
        });
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

  // Patient deletion functionality removed

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
    // Main container adjusted for better spacing and responsiveness
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Back button with improved spacing */}
      <div className="mb-8">
        <Link
          href="/pasien"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Kembali ke Daftar Pasien</span>
        </Link>
      </div>

      {/* Delete confirmation modal removed */}

      {/* Main card with improved styling */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {/* Header section with improved mobile layout */}
        <div className="p-5 md:p-8 border-b border-gray-200">
          <div className="space-y-4 md:space-y-0 md:flex md:items-start md:justify-between">
            {/* Patient info - better stacking on mobile */}
            <div className="flex-1">
              {/* Name container with better wrapping on mobile */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {isEditing ? (
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
                ) : (
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mr-2">
                    {capitalizeEachWord(patient.name)}
                  </h1>
                )}

                {/* Status badge with better mobile placement */}
                {!isEditing &&
                  (patient.isBPJS ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-sm font-medium shadow-sm">
                      <Shield className="h-4 w-4" />
                      <span>BPJS</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                      <User className="h-4 w-4" />
                      <span>Umum</span>
                    </div>
                  ))}
              </div>

              {/* Medical record number */}
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-600 mr-2">No. RM:</span>
                <span className="font-mono bg-blue-100 px-2 py-1 rounded text-blue-800 font-medium">
                  {patient.no_rm}
                </span>
              </div>
            </div>

            {/* Edit/Delete buttons repositioned for mobile */}
            {!isEditing && (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center shadow-sm justify-center"
                  title="Edit Data Pasien"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  <span>Edit Data</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Patient information with improved layout and responsiveness */}
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

                  {/* Gender field with improved spacing */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Kelamin
                    </label>
                    {isEditing ? (
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
                    ) : (
                      <p className="text-gray-800 font-medium">
                        {patient.gender || "Tidak tersedia"}
                      </p>
                    )}
                  </div>

                  {/* Birth Date with better alignment */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Tanggal Lahir</span>
                      </div>
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="birthDate"
                        value={formatDateForInput(editedPatient.birthDate)}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="flex items-center">
                        <span className="text-gray-800 font-medium">
                          {patient.birthDate
                            ? new Date(patient.birthDate).toLocaleDateString(
                                "id-ID"
                              )
                            : "Tidak tersedia"}
                        </span>
                        {patient.birthDate && (
                          <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {calculateAge(patient.birthDate)} tahun
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Address with improved textarea */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Alamat</span>
                      </div>
                    </label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={editedPatient.address || ""}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Alamat lengkap"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {capitalizeEachWord(patient.address) ||
                          "Tidak tersedia"}
                      </p>
                    )}
                  </div>
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Nomor Telepon</span>
                      </div>
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={editedPatient.phoneNumber || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Contoh: 08123456789"
                      />
                    ) : (
                      <div className="flex items-center flex-wrap gap-2">
                        <p className="text-gray-800">
                          {patient.phoneNumber || "Tidak tersedia"}
                        </p>
                        {patient.phoneNumber && (
                          <div className="flex gap-2">
                            <a
                              href={`tel:${formatPhoneForLink(
                                patient.phoneNumber
                              )}`}
                              className="inline-flex items-center text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition-colors"
                              title="Panggil"
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              <span>Panggil</span>
                            </a>
                            <a
                              href={`https://wa.me/${formatPhoneForLink(
                                patient.phoneNumber
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded transition-colors"
                              title="WhatsApp"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        )}
                      </div>
                    )}
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

                  {/* NIK with improved styling */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIK
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="nik"
                        value={editedPatient.nik || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nomor Induk Kependudukan"
                      />
                    ) : (
                      <p className="text-gray-800 font-mono bg-gray-100 inline-block px-3 py-1 rounded">
                        {patient.nik || "Tidak tersedia"}
                      </p>
                    )}
                  </div>

                  {/* BPJS Status - read-only display with copy button */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status BPJS
                    </label>
                    <div>
                      <p className="text-gray-800 font-medium mb-2">
                        {patient.isBPJS ? "Pasien BPJS" : "Pasien Umum"}
                      </p>
                      {patient.isBPJS && (
                        <div>
                          <span className="text-sm text-gray-600">
                            Nomor BPJS:
                          </span>
                          <div className="mt-1 flex items-center gap-2">
                            {isEditing ? (
                              <input
                                type="text"
                                name="no_bpjs"
                                value={editedPatient.no_bpjs || ""}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nomor BPJS"
                              />
                            ) : (
                              <>
                                <span className="font-mono bg-green-100 px-3 py-1 rounded-md text-green-800 font-medium">
                                  {patient.no_bpjs || "Belum diinput"}
                                </span>
                                {patient.no_bpjs && (
                                  <button
                                    type="button"
                                    onClick={handleCopyBPJS}
                                    className="inline-flex items-center justify-center p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                    title="Salin ke clipboard"
                                  >
                                    <Copy className="h-4 w-4 text-gray-600" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons with improved styling and responsiveness */}
            {isEditing && (
              <div className="mt-8 flex flex-col sm:flex-row sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedPatient(patient);
                    toast.error("Perubahan dibatalkan", { autoClose: 2000 });
                  }}
                  className="px-4 py-3 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center sm:w-auto"
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-2" />
                  <span>Batal</span>
                </button>
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
            )}
            {!isEditing && (
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-5">
                  Tindakan Pasien
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <button
                    type="button"
                    onClick={() => {
                      toast.error("Fitur Rawat Jalan belum dibuat");
                      // router.push(`/rawat-jalan/${id}`); // Commented out until feature is ready
                    }}
                    className="flex items-center p-4 bg-white hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                  >
                    <div className="bg-green-100 p-3 rounded-lg text-green-600 mr-4">
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 mb-1">
                        Rawat Jalan
                      </div>
                      <div className="text-xs text-gray-500">
                        Daftar pelayanan
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      toast.error("Fitur Rawat Inap belum dibuat");
                      // router.push(`/pasien/${id}/rawat-inap`); // Commented out until feature is ready
                    }}
                    className="flex items-center p-4 bg-white hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                  >
                    <div className="bg-purple-100 p-3 rounded-lg text-purple-600 mr-4">
                      <Bed className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 mb-1">
                        Rawat Inap
                      </div>
                      <div className="text-xs text-gray-500">
                        Daftar pelayanan
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      toast.error("Tidak ada riwayat rekam medis tersimpan!");
                      // router.push(`/pasien/${id}/rekam-medis`); // Commented out until feature is ready
                    }}
                    className="flex items-center p-4 bg-white hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                  >
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600 mr-4">
                      <ClipboardList className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 mb-1">
                        Rekam Medis
                      </div>
                      <div className="text-xs text-gray-500">Lihat riwayat</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
