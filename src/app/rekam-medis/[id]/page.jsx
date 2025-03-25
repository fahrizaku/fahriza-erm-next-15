// app/rekam-medis/[id]/page.jsx
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import PatientInfoCard from "./_components/PatientInfoCard";
import { LoadingState, ErrorState } from "./_components/UIState";
import DiagnosisSection from "./_components/DiagnosisSection";
import VitalsSection from "./_components/VitalsSection";
import PrescriptionsSection from "./_components/PrescriptionsSection";
import PharmacySection from "./_components/PharmacySection";
import DoctorSignature from "./_components/DoctorSignature";
import PageHeader from "./_components/PageHeader";

export default function MedicalRecordDetailPage({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [patient, setPatient] = useState(null);
  const [screening, setScreening] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [pharmacyQueue, setPharmacyQueue] = useState(null);

  // Fetch medical record data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/medical-records/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setMedicalRecord(data.medicalRecord);
          setPatient(data.patient);
          setScreening(data.screening);
          setPrescriptions(data.prescriptions);
          setPharmacyQueue(data.pharmacyQueue);
        } else {
          setError(data.message || "Failed to fetch medical record data");
          toast.error(data.message || "Failed to fetch medical record data");
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

  if (loading) {
    return <LoadingState />;
  }

  if (error && !medicalRecord) {
    return <ErrorState error={error} router={router} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Main content */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden print:shadow-none print:border-none">
        <PageHeader visitDate={medicalRecord?.visitDate} />

        <PatientInfoCard patient={patient} />

        {/* Medical record content */}
        <div className="p-5 md:p-6 space-y-6">
          <DiagnosisSection medicalRecord={medicalRecord} />

          {screening && <VitalsSection screening={screening} />}

          {prescriptions && prescriptions.length > 0 && (
            <PrescriptionsSection prescriptions={prescriptions} />
          )}

          {pharmacyQueue && (
            <PharmacySection
              pharmacyQueue={pharmacyQueue}
              screening={screening}
            />
          )}

          <DoctorSignature doctorName={medicalRecord?.doctorName} />
        </div>
      </div>
    </div>
  );
}
