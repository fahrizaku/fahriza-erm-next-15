import React, { useState, useEffect } from "react";
import { Stethoscope, Search, X } from "lucide-react";

const DiagnosisForm = ({
  medicalRecord,
  setMedicalRecord,
  handleMedicalRecordChange,
}) => {
  const [icdSearchTerm, setIcdSearchTerm] = useState("");
  const [icdResults, setIcdResults] = useState([]);
  const [showIcdSearch, setShowIcdSearch] = useState(false);

  // Search ICD-10 codes
  const searchIcdCodes = async (term) => {
    if (term.length < 2) {
      setIcdResults([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/icd-codes/search?term=${encodeURIComponent(term)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setIcdResults(data.results);
      } else {
        console.error("Failed to search ICD codes:", data.message);
      }
    } catch (error) {
      console.error("Error searching ICD codes:", error);
    }
  };

  // Debounced ICD search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (icdSearchTerm) {
        searchIcdCodes(icdSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [icdSearchTerm]);

  // Handle selecting an ICD code
  const handleSelectIcdCode = (code, description) => {
    setMedicalRecord((prev) => ({
      ...prev,
      icdCode: code,
      diagnosis: description,
    }));
    setShowIcdSearch(false);
    setIcdSearchTerm("");
    setIcdResults([]);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Stethoscope className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Diagnosis</h3>
      </div>

      {/* ICD-10 search */}
      <div className="mb-4 relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ICD-10 Code (Opsional jika diagnosis manual diisi)
        </label>
        <div className="flex">
          <input
            type="text"
            placeholder="ICD-10"
            value={icdSearchTerm}
            onChange={(e) => {
              setIcdSearchTerm(e.target.value);
              setShowIcdSearch(true);
            }}
            onFocus={() => setShowIcdSearch(true)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowIcdSearch(!showIcdSearch)}
            className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md"
          >
            <Search className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* ICD code display */}
        {medicalRecord.icdCode && (
          <div className="mt-2 flex items-center">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-sm">
              {medicalRecord.icdCode}
            </span>
            <span className="ml-2 text-gray-600">
              {medicalRecord.diagnosis}
            </span>
            <button
              type="button"
              onClick={() => {
                setMedicalRecord((prev) => ({
                  ...prev,
                  icdCode: "",
                  diagnosis: "",
                }));
              }}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ICD search results */}
        {showIcdSearch && icdResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white shadow-lg border border-gray-200 rounded-md max-h-60 overflow-y-auto">
            <ul>
              {icdResults.map((result) => (
                <li
                  key={result.code}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 flex items-start"
                  onClick={() =>
                    handleSelectIcdCode(result.code, result.description)
                  }
                >
                  <span className="font-mono text-blue-600 inline-block min-w-[70px]">
                    {result.code}
                  </span>
                  <span className="ml-2 text-gray-800">
                    {result.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Manual diagnosis input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Diagnosis Manual (Wajib jika ICD code tidak diisi)
        </label>
        <textarea
          name="diagnosis"
          value={medicalRecord.diagnosis}
          onChange={handleMedicalRecordChange}
          rows="2"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Deskripsi diagnosis"
        />
      </div>

      {/* Clinical notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Catatan Klinis Tambahan
        </label>
        <textarea
          name="clinicalNotes"
          value={medicalRecord.clinicalNotes}
          onChange={handleMedicalRecordChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Catatan tambahan (opsional)"
        />
      </div>
    </div>
  );
};

export default DiagnosisForm;
