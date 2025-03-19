import React from "react";
import { User, FileText, MapPin, Calendar } from "lucide-react";
import { capitalizeEachWord } from "../_utils/helper-function";

export default function PatientInfo({ patient }) {
  // Calculate age from birthDate
  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";

    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    // Adjust age if birthday hasn't occurred yet this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const age = calculateAge(patient?.birthDate);

  return (
    <div className="p-5 bg-blue-50 border-b border-blue-100">
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex items-center mb-2 sm:mb-0">
          <User className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-blue-800 mr-3">
            {capitalizeEachWord(patient?.name)}
          </h2>
          <div className="text-sm text-gray-600 ml-1">
            {patient?.gender || "N/A"} - {age} tahun
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FileText className="h-4 w-4 mr-1" />
          <span>No. RM: </span>
          <span className="font-mono ml-1 font-medium">{patient?.no_rm}</span>
        </div>
      </div>
      <div className="mt-2 flex items-start text-sm text-gray-600">
        <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
        <span>{patient?.address || "Alamat tidak tersedia"}</span>
      </div>
    </div>
  );
}
