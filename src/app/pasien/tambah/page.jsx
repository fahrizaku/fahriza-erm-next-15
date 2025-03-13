"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Shield,
  MapPin,
  FileText,
  CreditCard,
  Check,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import EnhancedDatePicker from "./_components/EnhanceDatePicker";
import { toast } from "react-toastify";

const PatientRegistration = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [savingPatient, setSavingPatient] = useState(false);
  const [isBPJS, setIsBPJS] = useState(false);
  const [nextRmNumber, setNextRmNumber] = useState("");

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    birthDate: "", // Untuk display format dd/mm/yyyy
    address: "",
    no_rm: "",
    no_bpjs: "",
    nik: "",
    phoneNumber: "",
  });

  // Fetch next RM number when component loads
  useEffect(() => {
    const fetchNextRmNumber = async () => {
      try {
        setLoading(true);
        // Modified to work with the new API that doesn't need isBPJS parameter
        const response = await fetch(`/api/patients/next-rm`);
        const data = await response.json();

        if (data.success) {
          setNextRmNumber(data.nextRmNumber);
          setFormData((prev) => ({
            ...prev,
            no_rm: data.nextRmNumber,
          }));
        } else {
          console.error("Failed to fetch next RM number:", data.message);
          toast.error("Failed to fetch next RM number");
        }
      } catch (error) {
        console.error("Error fetching next RM number:", error);
        toast.error("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    fetchNextRmNumber();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle BPJS toggle
  const handleBPJSChange = (e) => {
    const newIsBPJS = e.target.checked;
    setIsBPJS(newIsBPJS);

    // Clear BPJS number if switching to regular patient
    if (!newIsBPJS) {
      setFormData((prev) => ({
        ...prev,
        no_bpjs: "",
      }));
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name) {
      toast.error("Nama pasien wajib diisi");
      return;
    }

    if (isBPJS && (!formData.no_bpjs || formData.no_bpjs.trim() === "")) {
      toast.error("Nomor BPJS wajib diisi untuk pasien BPJS");
      return;
    }

    try {
      setSavingPatient(true);

      // Prepare data for API
      const patientData = {
        ...formData,
        isBPJS,
        no_rm: parseInt(formData.no_rm, 10),
        // Convert empty strings to null
        nik: formData.nik?.trim() || null,
        no_bpjs: isBPJS ? formData.no_bpjs?.trim() || null : null,
        phoneNumber: formData.phoneNumber?.trim() || null,
      };

      // Remove formattedBirthDate before sending to API
      // This field is only for UI display and not part of the database schema
      delete patientData.formattedBirthDate;

      // Create toast promise that shows loading/success/error states
      await toast.promise(
        fetch("/api/patients/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patientData),
        }).then(async (response) => {
          const data = await response.json();

          if (data.success) {
            setTimeout(() => {
              // Updated the URL to not include isBPJS parameter since it's no longer needed
              router.push(`/pasien/${data.patientId}`);
            }, 1000);
            return data;
          } else {
            throw new Error(data.message || "Gagal menyimpan data pasien");
          }
        }),
        {
          loading: "Menyimpan data pasien...",
          success: "Data pasien berhasil disimpan!",
          error: (err) =>
            `${err.message || "Terjadi kesalahan saat menyimpan data"}`,
        }
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      // The toast.promise will handle the error display
    } finally {
      setSavingPatient(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-6">
        <Link
          href="/pasien"
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Kembali ke daftar pasien</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          Registrasi Pasien Baru
        </h1>
        <p className="text-gray-600 mt-1">
          Silakan lengkapi data pasien dengan benar
        </p>
      </div>

      {/* Registration Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
      >
        <h2 className="text-lg font-medium text-gray-800 mb-4">Data Pasien</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Name input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            {/* Gender selection */}
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Jenis Kelamin
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih jenis kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {/* Birth date */}
            {/* Birth date with enhanced picker */}
            <div>
              <label
                htmlFor="birthDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tanggal Lahir
              </label>
              <EnhancedDatePicker
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nomor Telepon
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan nomor telepon"
              />
            </div>

            {/* BPJS checkbox */}
            <div className="mt-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isBPJS"
                  checked={isBPJS}
                  onChange={handleBPJSChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isBPJS"
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  Pasien BPJS
                </label>
              </div>
            </div>

            {/* BPJS Number (only shown if BPJS is checked) */}
            {isBPJS && (
              <div>
                <label
                  htmlFor="no_bpjs"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nomor BPJS <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="no_bpjs"
                    name="no_bpjs"
                    value={formData.no_bpjs}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan nomor BPJS"
                    required={isBPJS}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Alamat
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan alamat lengkap"
                ></textarea>
              </div>
            </div>

            {/* RM Number (readonly) */}
            <div>
              <label
                htmlFor="no_rm"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nomor RM
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="no_rm"
                  name="no_rm"
                  value={formData.no_rm}
                  readOnly
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Nomor RM diberikan secara otomatis
              </p>
            </div>

            {/* NIK */}
            <div>
              <label
                htmlFor="nik"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                NIK (Nomor Induk Kependudukan)
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="nik"
                  name="nik"
                  value={formData.nik}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan NIK"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button - Full width across both columns */}
        <div className="mt-8 col-span-full">
          <button
            type="submit"
            disabled={savingPatient || loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {savingPatient ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>Simpan Data Pasien</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientRegistration;
