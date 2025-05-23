import React from "react";
import { User, FileText, MapPin, CreditCard, Calendar } from "lucide-react";

const PatientInfo = ({ patient, screening }) => {
  // Function to capitalize each word
  const capitalizeEachWord = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

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

  // Determine payment type
  const getPaymentType = () => {
    if (!screening) return "N/A";
    return screening.isBPJSActive ? "BPJS" : "Umum";
  };

  // Check if payment is BPJS
  const isBPJS = () => {
    return screening && screening.isBPJSActive;
  };

  if (!patient) return null;

  return (
    <div
      className={`p-5 ${
        isBPJS() ? "bg-green-50 border-green-100" : "bg-blue-50 border-blue-100"
      } border-b`}
    >
      {/* Name */}
      <div className="flex items-center mb-3">
        <User className="h-5 w-5 text-blue-600 mr-2" />
        <h2 className="text-lg font-semibold text-blue-800">
          {capitalizeEachWord(patient.name)}
        </h2>
      </div>

      {/* 1. Gender and Age */}
      <div className="mb-2 ml-1">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-blue-500" />
          <span className="font-medium">{patient.gender || "N/A"}</span>
          <span className="mx-2">•</span>
          <span className="font-medium">{calculateAge(patient.birthDate)}</span>
        </div>
      </div>

      {/* 2. Address */}
      <div className="mb-2 ml-1">
        <div className="flex items-start text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
          <span className="font-medium">{patient.address || "N/A"}</span>
        </div>
      </div>

      {/* 3. Payment Type */}
      <div className="ml-1">
        <div className="flex items-center text-sm text-gray-600">
          <CreditCard
            className={`h-4 w-4 mr-2 ${
              isBPJS() ? "text-green-500" : "text-blue-500"
            }`}
          />
          <span className="mr-1">Tipe Pembayaran:</span>
          <span className={`font-medium ${isBPJS() ? "text-green-700" : ""}`}>
            {getPaymentType()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;
