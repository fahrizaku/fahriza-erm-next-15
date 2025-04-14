// app/pasien/components/PatientHeader.jsx
import { Loader2, User } from "lucide-react";

export default function PatientHeader({
  totalPatients,
  isAddingPatient,
  onAddNewPatient,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Data Pasien
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {totalPatients} pasien ditemukan
        </p>
      </div>
      <button
        onClick={onAddNewPatient}
        disabled={isAddingPatient}
        className="px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-80"
      >
        {isAddingPatient ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Memuat...</span>
          </>
        ) : (
          <>
            <User className="w-4 h-4" />
            <span>+ Pasien Baru</span>
          </>
        )}
      </button>
    </div>
  );
}
