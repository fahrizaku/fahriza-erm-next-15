// app/pasien/components/PatientList.jsx
export default function PatientList({
  patients,
  isLoading,
  loadingPatientId,
  onPatientClick,
}) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Memuat data pasien...</p>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Tidak ada pasien yang ditemukan</p>
      </div>
    );
  }

  // Import in-page since it's rendered conditionally to avoid circular imports
  // This is a common pattern in Next.js
  const PatientCard = require("./PatientCard").default;

  return (
    <div className="space-y-4">
      {patients.map((patient, index) => (
        <PatientCard
          key={`${patient.id}-${index}-${patient.patientType || ""}`}
          patient={patient}
          isLoading={loadingPatientId === patient.id}
          onClick={onPatientClick}
        />
      ))}
    </div>
  );
}
