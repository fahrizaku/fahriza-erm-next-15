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
    bloodPressure: "",
    pulse: "",
    respiratoryRate: "",
    weight: "",
    height: "",
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
    const { name, value } = e.target;
    setScreening((prev) => ({
      ...prev,
      [name]: value,
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

      // Format the data for submission
      const screeningData = {
        patientId: parseInt(id),
        ...screening,
        temperature: screening.temperature
          ? parseFloat(screening.temperature)
          : null,
        pulse: screening.pulse ? parseInt(screening.pulse) : null,
        respiratoryRate: screening.respiratoryRate
          ? parseInt(screening.respiratoryRate)
          : null,
        weight: screening.weight ? parseFloat(screening.weight) : null,
        height: screening.height ? parseInt(screening.height) : null,
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

                {/* Blood Pressure */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Tekanan Darah (mmHg)</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="bloodPressure"
                    value={screening.bloodPressure}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="120/80"
                  />
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
