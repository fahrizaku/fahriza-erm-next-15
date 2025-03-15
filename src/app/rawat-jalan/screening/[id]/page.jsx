"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  FileText,
  Thermometer,
  Activity,
  Heart,
  Weight,
  Ruler,
  ChevronLeft,
  Save,
  Loader2,
  AlertTriangle,
  Shield,
  HeartPulse,
  Percent,
  CreditCard,
  InfoIcon,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";

export default function ScreeningPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id; // Patient ID

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Screening form state
  const [screening, setScreening] = useState({
    complaints: "",
    temperature: "",
    systolicBP: "",
    diastolicBP: "",
    pulse: "",
    respiratoryRate: "",
    weight: "",
    height: "",
    waistCircumference: "",
    oxygenSaturation: "",
    isBPJSActive: false,
    paymentMethod: "", // Empty string initially, requiring user selection
    no_bpjs: "",
    updatePatientBPJS: false,
    bpjsStatusVerified: false, // New field for BPJS status verification
  });

  // Fetch patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const urlParams = new URLSearchParams(window.location.search);
        const isBPJS = urlParams.get("isBPJS") === "true";

        const response = await fetch(`/api/patients/${id}?isBPJS=${isBPJS}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setPatient(data.patient);

          // If patient already has BPJS, set the form default
          if (data.patient.isBPJS) {
            setScreening((prev) => ({
              ...prev,
              no_bpjs: data.patient.no_bpjs || "",
            }));
          }
        } else {
          setError(data.message || "Failed to fetch patient data");
          toast.error(data.message || "Failed to fetch patient data");
        }
      } catch (error) {
        console.error("Error fetching patient:", error);
        setError("An error occurred while fetching patient data");
        toast.error("An error occurred while fetching patient data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPatient();
    }
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox inputs
    if (type === "checkbox") {
      setScreening((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    // Handle other inputs
    setScreening((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle payment method change
  const handlePaymentMethodChange = (e) => {
    const paymentMethod = e.target.value;

    setScreening((prev) => ({
      ...prev,
      paymentMethod,
      isBPJSActive:
        paymentMethod === "bpjs" &&
        (prev.bpjsStatusVerified || !patient?.isBPJS),
      // If switching to umum, reset BPJS-related fields
      ...(paymentMethod === "umum"
        ? {
            updatePatientBPJS: false,
            bpjsStatusVerified: false,
          }
        : {}),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!screening.complaints) {
        throw new Error("Keluhan pasien harus diisi");
      }

      if (!screening.paymentMethod) {
        throw new Error("Metode pembayaran harus dipilih");
      }

      // Validate BPJS verification if patient already has BPJS and is using BPJS payment
      if (
        screening.paymentMethod === "bpjs" &&
        patient?.isBPJS &&
        !screening.bpjsStatusVerified
      ) {
        throw new Error("Status BPJS harus diverifikasi terlebih dahulu");
      }

      // Validate BPJS number if using BPJS payment method with new BPJS number
      if (
        screening.paymentMethod === "bpjs" &&
        !patient.isBPJS &&
        screening.updatePatientBPJS &&
        !screening.no_bpjs
      ) {
        throw new Error(
          "Nomor BPJS harus diisi jika menggunakan metode pembayaran BPJS"
        );
      }

      // Format the data for submission
      const screeningData = {
        patientId: parseInt(id),
        complaints: screening.complaints,
        temperature: screening.temperature ? screening.temperature : null,
        systolicBP: screening.systolicBP
          ? parseInt(screening.systolicBP)
          : null,
        diastolicBP: screening.diastolicBP
          ? parseInt(screening.diastolicBP)
          : null,
        pulse: screening.pulse ? parseInt(screening.pulse) : null,
        respiratoryRate: screening.respiratoryRate
          ? parseInt(screening.respiratoryRate)
          : null,
        weight: screening.weight ? parseFloat(screening.weight) : null,
        height: screening.height ? parseInt(screening.height) : null,
        waistCircumference: screening.waistCircumference
          ? parseFloat(screening.waistCircumference)
          : null,
        oxygenSaturation: screening.oxygenSaturation
          ? parseFloat(screening.oxygenSaturation)
          : null,
        isBPJSActive:
          screening.paymentMethod === "bpjs" &&
          (screening.bpjsStatusVerified || !patient?.isBPJS),
        // Only include BPJS number if updating patient record
        ...(screening.paymentMethod === "bpjs" &&
        !patient.isBPJS &&
        screening.updatePatientBPJS
          ? { no_bpjs: screening.no_bpjs, updatePatientBPJS: true }
          : {}),
      };

      // Submit the screening data
      const response = await fetch("/api/screenings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(screeningData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Show success message
        toast.success("Skrining pasien berhasil disimpan");

        // Redirect to the queue page
        router.push("/rawat-jalan/antrian");
      } else {
        setError(data.message || "Failed to save screening data");
        toast.error(data.message || "Failed to save screening data");
      }
    } catch (error) {
      console.error("Error saving screening:", error);
      setError(
        error.message || "An error occurred while saving screening data"
      );
      toast.error(
        error.message || "An error occurred while saving screening data"
      );
    } finally {
      setSubmitting(false);
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

  if (loading) {
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

  if (error && !patient) {
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href={`/pasien/${id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Kembali ke Detail Pasien</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-gray-200 bg-gray-50">
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            Skrining Pasien
          </h1>
          <p className="text-gray-600">
            Isi formulir skrining untuk rawat jalan
          </p>
        </div>

        {/* Patient info card */}
        <div className="p-5 bg-blue-50 border-b border-blue-100">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center mb-2 sm:mb-0">
              <User className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-blue-800 mr-3">
                {capitalizeEachWord(patient?.name)}
              </h2>
              {patient?.isBPJS && (
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
                {patient?.no_rm}
              </span>
            </div>
          </div>
        </div>

        {/* Screening form */}
        <form onSubmit={handleSubmit}>
          <div className="p-5 md:p-6">
            {/* Payment method section */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="text-md font-semibold text-gray-800 mb-4">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-purple-500" />
                  <span>
                    Metode Pembayaran <span className="text-red-500">*</span>
                  </span>
                </div>
              </h3>

              <div className="flex flex-col gap-3">
                {/* Select dropdown for payment method */}
                <div>
                  <select
                    name="paymentMethod"
                    value={screening.paymentMethod}
                    onChange={handlePaymentMethodChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="" disabled>
                      -- Pilih Metode Pembayaran --
                    </option>
                    <option value="umum">Umum</option>
                    <option value="bpjs">BPJS</option>
                  </select>
                </div>

                {/* BPJS Information - only show if BPJS payment method selected */}
                {screening.paymentMethod === "bpjs" && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-100">
                    {patient?.isBPJS ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                          <p className="text-sm text-blue-700">
                            <Shield className="h-4 w-4 inline mr-1" />
                            Pasien terdaftar sebagai peserta BPJS
                          </p>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-600">
                              No. BPJS:
                            </span>
                            <span className="ml-2 font-mono text-sm">
                              {patient.no_bpjs}
                            </span>
                          </div>
                        </div>

                        {/* BPJS Status Verification Section - New */}
                        <div className="mt-2 pt-3 border-t border-blue-200">
                          <div className="flex items-start mb-2">
                            <InfoIcon className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                            <div className="text-sm text-gray-700">
                              <p className="font-medium">Catatan:</p>
                              <p>
                                Periksa status BPJS aktif atau tidak di website
                                BPJS
                              </p>
                              <a
                                href="https://pcarejkn.bpjs-kesehatan.go.id/eclaim"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-1"
                              >
                                <span>Cek di website BPJS</span>
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                          </div>

                          <div className="mt-2 flex items-start bg-white p-2 rounded border border-amber-200">
                            <input
                              type="checkbox"
                              id="bpjsStatusVerified"
                              name="bpjsStatusVerified"
                              checked={screening.bpjsStatusVerified}
                              onChange={handleInputChange}
                              className="h-5 w-5 mt-0.5 text-green-600 focus:ring-green-500"
                              required={
                                screening.paymentMethod === "bpjs" &&
                                patient?.isBPJS
                              }
                            />
                            <label
                              htmlFor="bpjsStatusVerified"
                              className="ml-2 block text-sm font-medium text-gray-700"
                            >
                              Saya sudah melakukan verifikasi dan status BPJS
                              pasien <span className="font-bold">aktif</span>
                              <span className="text-red-500">*</span>
                            </label>
                          </div>

                          {/* New Note Section */}
                          <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                            <p className="text-sm text-gray-700">
                              Jika status BPJS{" "}
                              <span className="font-bold">tidak aktif</span>{" "}
                              ubah metode pembayaran ke{" "}
                              <span className="font-bold">umum</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <p className="text-sm text-blue-700">
                          <AlertTriangle className="h-4 w-4 inline mr-1" />
                          Pasien belum terdaftar sebagai peserta BPJS
                        </p>

                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            id="updatePatientBPJS"
                            name="updatePatientBPJS"
                            checked={screening.updatePatientBPJS}
                            onChange={handleInputChange}
                            className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500"
                          />
                          <label
                            htmlFor="updatePatientBPJS"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Tambahkan informasi BPJS ke data pasien
                          </label>
                        </div>

                        {screening.updatePatientBPJS && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nomor BPJS
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="no_bpjs"
                              value={screening.no_bpjs}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Masukkan nomor BPJS"
                              required={screening.updatePatientBPJS}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Complaints section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keluhan Pasien <span className="text-red-500">*</span>
              </label>
              <textarea
                name="complaints"
                value={screening.complaints}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Keluhan utama pasien"
                required
              />
            </div>

            {/* Vital signs section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
              <h3 className="text-md font-semibold text-gray-800 mb-4">
                Tanda Vital
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Temperature */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <Thermometer className="h-4 w-4 mr-2 text-red-500" />
                      <span>Suhu Tubuh (°C)</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    name="temperature"
                    value={screening.temperature}
                    onChange={handleInputChange}
                    step="0.1"
                    min="35"
                    max="42"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="36.5"
                  />
                </div>

                {/* Blood Pressure - split into systolic and diastolic */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Tekanan Darah (mmHg)</span>
                    </div>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="systolicBP"
                      value={screening.systolicBP}
                      onChange={handleInputChange}
                      min="70"
                      max="250"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="120"
                    />
                    <span className="text-gray-500">/</span>
                    <input
                      type="number"
                      name="diastolicBP"
                      value={screening.diastolicBP}
                      onChange={handleInputChange}
                      min="40"
                      max="150"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="80"
                    />
                  </div>
                </div>

                {/* Pulse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-red-500" />
                      <span>Denyut Nadi (bpm)</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    name="pulse"
                    value={screening.pulse}
                    onChange={handleInputChange}
                    min="40"
                    max="200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="80"
                  />
                </div>

                {/* Respiratory Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <HeartPulse className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Pernapasan (rpm)</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    name="respiratoryRate"
                    value={screening.respiratoryRate}
                    onChange={handleInputChange}
                    min="8"
                    max="40"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="16"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <Weight className="h-4 w-4 mr-2 text-green-500" />
                      <span>Berat Badan (kg)</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={screening.weight}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="300"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="70"
                  />
                </div>

                {/* Height */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <Ruler className="h-4 w-4 mr-2 text-green-500" />
                      <span>Tinggi Badan (cm)</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={screening.height}
                    onChange={handleInputChange}
                    min="0"
                    max="300"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="170"
                  />
                </div>

                {/* New: Waist Circumference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 mr-2 text-yellow-500" />
                      <span>Lingkar Pinggang (cm)</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    name="waistCircumference"
                    value={screening.waistCircumference}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="80"
                  />
                </div>

                {/* New: Oxygen Saturation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <Percent className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Saturasi Oksigen (%)</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    name="oxygenSaturation"
                    value={screening.oxygenSaturation}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="98"
                  />
                </div>
              </div>
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
                    <span>Simpan & Lanjutkan ke Antrian</span>
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
