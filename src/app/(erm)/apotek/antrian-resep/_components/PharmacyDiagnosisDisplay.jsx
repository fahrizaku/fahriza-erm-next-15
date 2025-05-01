import React from "react";
import { FileText } from "lucide-react";

/**
 * Component to display multiple diagnoses in the pharmacy queue view
 * @param {Object} medicalRecord - The medical record object containing diagnosis info
 * @returns {JSX.Element} Pharmacy diagnosis display component
 */
const PharmacyDiagnosisDisplay = ({ medicalRecord }) => {
  // Parse diagnoses array from the medical record
  const getDiagnosesArray = () => {
    try {
      // Try to parse the diagnosis field as JSON
      if (medicalRecord.diagnosis && medicalRecord.diagnosis.startsWith("[")) {
        const parsed = JSON.parse(medicalRecord.diagnosis);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      // If parsing fails, it's not in the new format
    }

    // Fallback to legacy format
    return [
      {
        icdCode: medicalRecord.icdCode || "",
        description: medicalRecord.diagnosis || "",
      },
    ];
  };

  const diagnoses = getDiagnosesArray();

  return (
    <div className="flex items-start">
      <FileText className="h-4 w-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-medium text-xs text-gray-700 mb-1">Diagnosis:</p>
        <div className="space-y-1">
          {diagnoses.map((diagnosis, index) => (
            <div key={index} className="flex flex-wrap items-baseline gap-1">
              {diagnosis.icdCode && (
                <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-xs font-mono">
                  {diagnosis.icdCode}
                </span>
              )}
              <span className="text-sm text-gray-800 line-clamp-1">
                {diagnosis.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PharmacyDiagnosisDisplay;
