//app/rawat-jalan/screening/[id]/page.jsx
"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// Import components
import LoadingState from "./_components/LoadingState";
import ErrorState from "./_components/ErrorState";
import PatientInfo from "./_components/PatientInfo";
import PaymentMethodSection from "./_components/PaymentMethodSection";
import ComplaintsSection from "./_components/ComplaintsSection";
import VitalSignsSection from "./_components/VitalSignsSection";
import ScreeningAllergies from "./_components/ScreeningAllergies"; // Import komponen ScreeningAllergies
import SubmitButton from "./_components/SubmitButton";
import {
  fetchPatientData,
  handleSubmissionError,
  prepareScreeningData,
  submitScreeningData,
  validateFormData,
} from "./_utils/helper-function";

export default function ScreeningPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id; // Patient ID

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [allergies, setAllergies] = useState([]); // State untuk data alergi

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
    fetchPatientData(id, setLoading, setPatient, setError, setScreening);
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
      // Automatically set updatePatientBPJS to true when BPJS is selected for a non-BPJS patient
      updatePatientBPJS: paymentMethod === "bpjs" && !patient?.isBPJS,
      isBPJSActive:
        paymentMethod === "bpjs" &&
        (prev.bpjsStatusVerified || !patient?.isBPJS),
      // If switching to umum, reset BPJS-related fields
      ...(paymentMethod === "umum"
        ? {
            updatePatientBPJS: false,
            bpjsStatusVerified: false,
            no_bpjs: "",
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
      // Validate form data including allergies if needed
      validateFormData({ ...screening, allergies }, patient);

      // Prepare screening data
      const screeningData = prepareScreeningData(screening, id, patient);

      // Add allergies data to screening data
      screeningData.allergies = allergies;

      // Submit all data to API
      await submitScreeningData(screeningData, setError, router);
    } catch (error) {
      handleSubmissionError(error, setError);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error && !patient) {
    return <ErrorState error={error} router={router} />;
  }

  return (
    <div className="max-w-6xl mx-auto pt-4 px-1 sm:p-6">
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
        <PatientInfo patient={patient} />

        {/* Screening form */}
        <form onSubmit={handleSubmit}>
          <div className="p-5 md:p-6">
            {/* Payment method section */}
            <PaymentMethodSection
              screening={screening}
              patient={patient}
              handlePaymentMethodChange={handlePaymentMethodChange}
              handleInputChange={handleInputChange}
            />

            {/* Complaints section */}
            <ComplaintsSection
              screening={screening}
              handleInputChange={handleInputChange}
            />

            {/* Vital signs section */}
            <VitalSignsSection
              screening={screening}
              handleInputChange={handleInputChange}
            />

            {/* Allergies section */}
            <ScreeningAllergies
              patientId={id}
              allergies={allergies}
              setAllergies={setAllergies}
            />

            {/* Error message */}
            {error && (
              <div className="mt-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {/* Submit button */}
            <SubmitButton submitting={submitting} />
          </div>
        </form>
      </div>
    </div>
  );
}
