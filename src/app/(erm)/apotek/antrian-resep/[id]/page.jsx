"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";
import { LoadingState, ErrorState, NotFoundState } from "./_components/UIState";
import PrescriptionHeader from "./_components/PrescriptionHeader";
import PatientInfo from "./_components/PatientInfo";
import PatientAllergies from "./_components/PatientAllergies";
import PrescriptionList from "./_components/PrescriptionList";
import ActionButtons from "./_components/ActionButtons";

export default function PrescriptionDetailsPage({ params }) {
  const router = useRouter();
  const { id } = use(params); // This is the medicalRecordId

  const [loading, setLoading] = useState(true);
  const [prescription, setPrescription] = useState(null);
  const [allergies, setAllergies] = useState([]);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchPrescriptionDetails() {
      try {
        setLoading(true);
        const response = await fetch(`/api/pharmacy/prescriptions/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setPrescription(data.prescription);

          // Once we have the prescription data with patient ID, fetch allergies
          if (data.prescription?.patient?.id) {
            fetchPatientAllergies(data.prescription.patient.id);
          }
        } else {
          setError(data.message || "Failed to fetch prescription details");
          toast.error(data.message || "Failed to fetch prescription details");
        }
      } catch (error) {
        console.error("Error fetching prescription details:", error);
        setError("An error occurred while fetching prescription details");
        toast.error("An error occurred while fetching prescription details");
      } finally {
        setLoading(false);
      }
    }

    async function fetchPatientAllergies(patientId) {
      try {
        // Using your existing API endpoint
        const response = await fetch(`/api/patients/${patientId}/allergies`);

        if (!response.ok) {
          console.error(`Failed to fetch allergies: ${response.status}`);
          return;
        }

        const data = await response.json();

        if (data.success) {
          setAllergies(data.allergies);
        } else {
          console.error("Failed to fetch allergies:", data.message);
        }
      } catch (error) {
        console.error("Error fetching patient allergies:", error);
      }
    }

    fetchPrescriptionDetails();
  }, [id]);

  const handleMarkAsReady = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch(
        `/api/pharmacy/queue/${prescription.medicalRecordId}/ready`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update the prescription state locally instead of redirecting
        setPrescription({
          ...prescription,
          status: "ready",
        });
        toast.success(`Resep siap diambil`);
      } else {
        toast.error(data.message || "Failed to mark prescription as ready");
      }
    } catch (error) {
      console.error("Error marking prescription as ready:", error);
      toast.error("An error occurred while marking prescription as ready");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDispense = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch(
        `/api/pharmacy/queue/${prescription.medicalRecordId}/dispense`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update the prescription state locally
        setPrescription({
          ...prescription,
          status: "dispensed",
        });
        toast.success(`Resep telah diserahkan`);
      } else {
        toast.error(data.message || "Failed to dispense prescription");
      }
    } catch (error) {
      console.error("Error dispensing prescription:", error);
      toast.error("An error occurred while dispensing prescription");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} router={router} />;
  }

  if (!prescription) {
    return <NotFoundState router={router} />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/apotek/antrian-resep"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Kembali ke Antrian Farmasi</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <PrescriptionHeader prescription={prescription} />
        <PatientInfo prescription={prescription} />
        <PatientAllergies allergies={allergies} />
        <PrescriptionList prescriptions={prescription.prescriptions} />
        <ActionButtons
          router={router}
          prescription={prescription}
          isProcessing={isProcessing}
          handleMarkAsReady={handleMarkAsReady}
          handleDispense={handleDispense}
        />
      </div>
    </div>
  );
}
