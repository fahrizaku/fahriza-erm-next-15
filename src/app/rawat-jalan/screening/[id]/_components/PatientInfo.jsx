import React from "react";
import { User, FileText, MapPin, Calendar, CreditCard } from "lucide-react";
import { capitalizeEachWord } from "../_utils/helper-function";

export default function PatientInfo({ patient }) {
  // Calculate age from birthDate
  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    const today = new Date();
    const dob = new Date(birthDate);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return `${age} tahun`;
  };

  return (
    <div className="p-5 bg-blue-50 border-b border-blue-100">
      {/* Name */}
      <div className="flex items-center mb-3">
        <User className="h-5 w-5 text-blue-600 mr-2" />
        <h2 className="text-lg font-semibold text-blue-800">
          {capitalizeEachWord(patient?.name)}
        </h2>
      </div>

      {/* All information in a single column */}
      <div className="space-y-2">
        {/* No. RM */}
        <div className="flex items-center text-sm text-gray-600">
          <FileText className="h-4 w-4 mr-2 text-blue-500" />
          <span>No. RM: </span>
          <span className="font-mono ml-1 font-medium">{patient?.no_rm}</span>
        </div>
        {/* Gender and Age */}
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-blue-500" />
          <span className="font-medium">{patient?.gender || "N/A"}</span>
          <span className="mx-2">•</span>
          <span className="font-medium">
            {calculateAge(patient?.birthDate)}
          </span>
        </div>

        {/* Address */}
        <div className="flex items-start text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
          <span className="font-medium">{patient?.address || "N/A"}</span>
        </div>
      </div>
    </div>
  );
}
