// app/rekam-medis/[id]/components/DiagnosisSection.jsx
import React from "react";
import { Stethoscope } from "lucide-react";

export default function DiagnosisSection({ medicalRecord }) {
  if (!medicalRecord) return null;

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
  const hasMultipleDiagnoses = diagnoses.length > 1;

  return (
    <div>
      <div className="flex items-center mb-4">
        <Stethoscope className="h-5 w-5 text-blue-600 mr-2 print:text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-800">
          Diagnosis {hasMultipleDiagnoses ? `(${diagnoses.length})` : ""}
        </h3>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 print:bg-white">
        {diagnoses.map((diagnosis, index) => (
          <div
            key={index}
            className={`${
              index > 0 ? "mt-5 pt-4 border-t border-gray-200" : ""
            }`}
          >
            {hasMultipleDiagnoses && (
              <h4 className="font-medium text-gray-700 mb-2">
                {index === 0 ? "Diagnosis Utama" : `Diagnosis ${index + 1}`}
              </h4>
            )}

            {diagnosis.icdCode && (
              <div className="mb-3">
                <span className="text-sm font-medium text-gray-600 mr-2">
                  Kode ICD-10:
                </span>
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono text-sm print:bg-gray-100 print:text-gray-800">
                  {diagnosis.icdCode}
                </span>
              </div>
            )}

            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-600 mb-1">
                Deskripsi:
              </h4>
              <p className="text-gray-800">{diagnosis.description}</p>
            </div>
          </div>
        ))}

        {medicalRecord.clinicalNotes && (
          <div
            className={`${
              diagnoses.length > 1 ? "mt-5 pt-4 border-t border-gray-200" : ""
            }`}
          >
            <h4 className="text-sm font-medium text-gray-600 mb-1">
              Catatan Klinis:
            </h4>
            <p className="text-gray-800 whitespace-pre-line">
              {medicalRecord.clinicalNotes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
