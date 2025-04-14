// app/rekam-medis/[id]/components/DiagnosisSection.jsx
import React from "react";
import { Stethoscope } from "lucide-react";

export default function DiagnosisSection({ medicalRecord }) {
  if (!medicalRecord) return null;

  return (
    <div>
      <div className="flex items-center mb-4">
        <Stethoscope className="h-5 w-5 text-blue-600 mr-2 print:text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-800">Diagnosis</h3>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 print:bg-white">
        {medicalRecord.icdCode && (
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-600 mr-2">
              Kode ICD-10:
            </span>
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono text-sm print:bg-gray-100 print:text-gray-800">
              {medicalRecord.icdCode}
            </span>
          </div>
        )}

        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-600 mb-1">Diagnosis:</h4>
          <p className="text-gray-800">{medicalRecord.diagnosis}</p>
        </div>

        {medicalRecord.clinicalNotes && (
          <div>
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
