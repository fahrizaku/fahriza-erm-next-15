import React from "react";
import { User, FileText, Shield } from "lucide-react";

const PatientInfo = ({ patient }) => {
  // Function to capitalize each word
  const capitalizeEachWord = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (!patient) return null;

  return (
    <div className="p-5 bg-blue-50 border-b border-blue-100">
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex items-center mb-2 sm:mb-0">
          <User className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-blue-800 mr-3">
            {capitalizeEachWord(patient.name)}
          </h2>
          {patient.isBPJS && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <Shield className="h-3 w-3" />
              <span>BPJS</span>
            </div>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FileText className="h-4 w-4 mr-1" />
          <span>No. RM: </span>
          <span className="font-mono ml-1 font-medium">{patient.no_rm}</span>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;
