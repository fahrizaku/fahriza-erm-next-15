// patient detail page - Updated with allergies section
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

// Import components
import PatientHeader from "./_components/PatientHeader";
import PatientInfoSection from "./_components/PatientInfoSection";
import PatientActions from "./_components/PatientActions";
import PatientAllergies from "./_components/PatientAllergies"; // Import the new component
import DeleteConfirmationModal from "./_components/DeleteConfirmationModal";
import {
  ErrorState,
  LoadingState,
  NotFoundState,
} from "./_components/LoadingState";

export default function PatientDetailPage({ params }) {
  const router = useRouter();
  const { id } = React.use(params);

  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionLoadingStates, setActionLoadingStates] = useState({
    outpatient: false,
    inpatient: false,
    medicalRecord: false,
  });

  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/patients/${id}`);

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
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPatientData();
    }
  }, [id]);

  // Handle outpatient navigation with loading state
  const handleOutpatientClick = () => {
    setActionLoadingStates((prev) => ({ ...prev, outpatient: true }));
    router.push(`/rawat-jalan/screening/${id}`);
  };

  // Handle inpatient navigation with loading state
  const handleInpatientClick = () => {
    setActionLoadingStates((prev) => ({ ...prev, inpatient: true }));
    toast.error("Fitur Rawat Inap belum dibuat");
    setTimeout(() => {
      setActionLoadingStates((prev) => ({ ...prev, inpatient: false }));
    }, 500);
  };

  // Handle medical record navigation with loading state
  const handleMedicalRecordClick = () => {
    setActionLoadingStates((prev) => ({ ...prev, medicalRecord: true }));
    router.push(`/pasien/${id}/riwayat-kunjungan`);
  };

  // Handle patient deletion
  const handleDeletePatient = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/patients/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Pasien berhasil dihapus");
        router.push("/pasien");
      } else {
        if (
          data.error &&
          data.error.includes("Foreign key constraint violated")
        ) {
          toast.error(
            "Tidak dapat menghapus pasien karena masih memiliki data terkait (rekam medis, screening, dll)"
          );
        } else {
          toast.error(data.message || "Gagal menghapus pasien");
        }
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast.error("Terjadi kesalahan saat menghapus pasien");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState error={error} onBackClick={() => router.push("/pasien")} />
    );
  }

  if (!patient) {
    return <NotFoundState />;
  }

  return (
    <div className="max-w-6xl mx-auto pt-4 px-1 sm:p-6">
      {/* Main card */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <PatientHeader
          patient={patient}
          editUrl={`/pasien/${id}/edit`}
          onDeleteClick={() => setShowDeleteModal(true)}
        />

        {/* Patient information sections */}
        <div className="p-6 md:p-8">
          <PatientInfoSection patient={patient} />

          {/* Tindakan Pasien */}
          <PatientActions
            loadingStates={actionLoadingStates}
            onOutpatientClick={handleOutpatientClick}
            onInpatientClick={handleInpatientClick}
            onMedicalRecordClick={handleMedicalRecordClick}
          />

          {/* Patient Allergies Section */}
          <PatientAllergies patientId={id} />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          patientName={patient.name}
          isDeleting={isDeleting}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDeletePatient}
        />
      )}
    </div>
  );
}
