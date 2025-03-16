// app/pasien/components/PatientCard.jsx
import { Loader2, FileText, MapPin, Shield, User } from "lucide-react";

export default function PatientCard({ patient, isLoading, onClick }) {
  // Helper functions
  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    const birth = new Date(birthDate);
    const ageDifMs = Date.now() - birth.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const capitalizeEachWord = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Component rendering
  const age = calculateAge(patient.birthDate);
  const capitalizedName = capitalizeEachWord(patient.name);
  const capitalizedAddress = capitalizeEachWord(patient.address);
  const isBPJS = patient.isBPJS || patient.patientType === "bpjs";

  const BPJSBadge = () => (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-sm font-medium shadow-sm">
      <Shield className="h-4 w-4" strokeWidth={2.5} />
      <span>BPJS</span>
    </div>
  );

  const GeneralBadge = () => (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
      <User className="h-4 w-4" strokeWidth={2.5} />
      <span>Umum</span>
    </div>
  );

  return (
    <div
      className="block cursor-pointer relative"
      onClick={(e) => {
        e.preventDefault();
        onClick(patient.id);
      }}
    >
      <div
        className={`group p-4 bg-white border-2 border-indigo-100 rounded-lg hover:border-indigo-200 hover:shadow-md transition-all ${
          isLoading ? "bg-gray-50" : ""
        }`}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg z-10">
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="mt-2 text-sm text-blue-600 font-medium">
                Memuat detail pasien...
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {capitalizedName}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <span>{patient.gender || "N/A"}</span>
                <span>•</span>
                <span>{age} tahun</span>
              </div>
            </div>
            <div>{isBPJS ? <BPJSBadge /> : <GeneralBadge />}</div>
          </div>

          {/* Info Section dengan Icon */}
          <div className="mt-2 pt-2 border-t border-gray-100">
            {/* RM dengan Icon */}
            <div className="flex items-center text-sm">
              <div className="w-4 flex justify-center">
                <FileText className="w-4 h-4 text-gray-500" />
              </div>
              <span className="text-gray-500 ml-1">RM:</span>
              <span
                className={`font-mono ml-1 px-1.5 py-0.5 rounded ${
                  isBPJS
                    ? "bg-emerald-200 text-black"
                    : "bg-blue-200 text-black"
                }`}
              >
                {patient.no_rm}
              </span>
            </div>

            {/* Alamat dengan Icon */}
            <div className="mt-1 flex text-sm items-center">
              <div className="w-4 flex justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-gray-500" />
              </div>
              <span className="ml-1 text-gray-600 line-clamp-1">
                {capitalizedAddress || "Alamat tidak tersedia"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
