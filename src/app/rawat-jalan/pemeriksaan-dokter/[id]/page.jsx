"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2, AlertTriangle, Save } from "lucide-react";

// Import komponen yang dipisahkan
import BackNavigation from "./_components/BackNavigation";
import PatientInfo from "./_components/PatientInfo";
import ScreeningResults from "./_components/ScreeningResults";
import DiagnosisForm from "./_components/DiagnosisForm";
import PrescriptionsForm from "./_components/PrescriptionsForm";
import DoctorSignature from "./_components/DoctorSignature";

// Import combined hook
import { useDoctorExamination } from "./_hooks/useDoctorExamination";

export default function DoctorExaminationPage({ params }) {
  const router = useRouter();
  const { id } = use(params); // Screening ID

  // Use combined hook
  const {
    loading,
    error,
    patient,
    screening,
    medicalRecord,
    setMedicalRecord,
    handleMedicalRecordChange,
    prescriptions,
    handlePrescriptionTypeChange,
    handlePrescriptionNotesChange,
    handlePrescriptionItemChange,
    addPrescriptionItem,
    removePrescriptionItem,
    addPrescription,
    removePrescription,
  } = useDoctorExamination(id);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      // Validate required fields
      if (!medicalRecord.diagnosis) {
        throw new Error("Diagnosis pasien harus diisi");
      }

      if (!medicalRecord.doctorName) {
        throw new Error("Nama dokter harus diisi");
      }

      // Validate prescription items
      let hasValidPrescription = false;
      for (const prescription of prescriptions) {
        if (prescription.items.length > 0) {
          const invalidItems = prescription.items.filter(
            (item) => !item.manualDrugName || !item.dosage
          );
          if (invalidItems.length === 0) {
            hasValidPrescription = true;
          }
        }
      }

      if (!hasValidPrescription) {
        throw new Error(
          "Setidaknya satu resep harus diisi lengkap (nama obat dan dosis)"
        );
      }

      // Format data for submission
      const medicalRecordData = {
        patientId: patient.id,
        screeningId: parseInt(id),
        ...medicalRecord,
        prescriptions: prescriptions
          .map((prescription) => ({
            type: prescription.type,
            notes: prescription.notes,
            items: prescription.items
              .filter((item) => item.manualDrugName && item.dosage)
              .map((item) => ({
                manualDrugName: item.manualDrugName,
                dosage: item.dosage,
                quantity: parseInt(item.quantity),
              })),
          }))
          .filter((prescription) => prescription.items.length > 0),
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
        setFormError(data.message || "Failed to save medical record");
        toast.error(data.message || "Failed to save medical record");
      }
    } catch (error) {
      console.error("Error saving medical record:", error);
      setFormError(
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
      <BackNavigation />

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
        <PatientInfo patient={patient} />

        {/* Screening summary */}
        <ScreeningResults screening={screening} />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-5 md:p-6">
            {formError && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <p className="text-red-700">{formError}</p>
                </div>
              </div>
            )}

            {/* Diagnosis section */}
            <DiagnosisForm
              medicalRecord={medicalRecord}
              setMedicalRecord={setMedicalRecord}
              handleMedicalRecordChange={handleMedicalRecordChange}
            />

            {/* Multiple Prescriptions section */}
            <PrescriptionsForm
              prescriptions={prescriptions}
              handlePrescriptionTypeChange={handlePrescriptionTypeChange}
              handlePrescriptionNotesChange={handlePrescriptionNotesChange}
              handlePrescriptionItemChange={handlePrescriptionItemChange}
              addPrescriptionItem={addPrescriptionItem}
              removePrescriptionItem={removePrescriptionItem}
              addPrescription={addPrescription}
              removePrescription={removePrescription}
            />

            {/* Doctor name */}
            <DoctorSignature
              doctorName={medicalRecord.doctorName}
              onChange={handleMedicalRecordChange}
            />

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
