import React, { useState, useEffect } from "react";
import { Stethoscope, Search, X, PlusCircle } from "lucide-react";

const DiagnosisForm = ({
  medicalRecord,
  setMedicalRecord,
  handleMedicalRecordChange,
}) => {
  // State for managing multiple diagnoses
  const [diagnoses, setDiagnoses] = useState([
    { icdCode: "", description: "" },
  ]);

  // State for each diagnosis search - indexed by diagnosis position
  const [diagnosisSearchStates, setDiagnosisSearchStates] = useState([
    { searchTerm: "", showSearch: false, searchResults: [] },
  ]);

  // Initialize from existing data when component mounts
  useEffect(() => {
    // Check if the existing diagnosis field contains JSON data
    try {
      // Try to parse existing diagnosis as JSON
      if (medicalRecord.diagnosis && medicalRecord.diagnosis.startsWith("[")) {
        const parsedDiagnoses = JSON.parse(medicalRecord.diagnosis);
        if (Array.isArray(parsedDiagnoses) && parsedDiagnoses.length > 0) {
          setDiagnoses(parsedDiagnoses);
          // Initialize search states for each diagnosis
          setDiagnosisSearchStates(
            parsedDiagnoses.map(() => ({
              searchTerm: "",
              showSearch: false,
              searchResults: [],
            }))
          );
          return;
        }
      }
    } catch (e) {
      // If parsing fails, it's not JSON format
    }

    // If not JSON or parsing failed, initialize with existing values
    if (medicalRecord.diagnosis || medicalRecord.icdCode) {
      setDiagnoses([
        {
          icdCode: medicalRecord.icdCode || "",
          description: medicalRecord.diagnosis || "",
        },
      ]);
    }
  }, []);

  // Update parent component state whenever diagnoses change
  useEffect(() => {
    // Convert diagnoses array to JSON string
    const diagnosesJson = JSON.stringify(diagnoses);

    // For backward compatibility, also set the first diagnosis in the regular fields
    const primaryDiagnosis = diagnoses[0] || { icdCode: "", description: "" };

    setMedicalRecord((prev) => ({
      ...prev,
      // Store the full array as JSON in the diagnosis field
      diagnosis: diagnosesJson,
      // Keep the first diagnosis in the icdCode field for backward compatibility
      icdCode: primaryDiagnosis.icdCode,
    }));
  }, [diagnoses]);

  // Search ICD-10 codes for a specific diagnosis
  const searchIcdCodes = async (term, index) => {
    if (term.length < 2) {
      updateSearchState(index, { searchResults: [] });
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
        updateSearchState(index, { searchResults: data.results });
      } else {
        console.error("Failed to search ICD codes:", data.message);
      }
    } catch (error) {
      console.error("Error searching ICD codes:", error);
    }
  };

  // Update the search state for a specific diagnosis
  const updateSearchState = (index, newState) => {
    setDiagnosisSearchStates((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...newState };
      return updated;
    });
  };

  // Debounced ICD search for each diagnosis
  useEffect(() => {
    // Create a separate timeout for each diagnosis
    const timeouts = diagnosisSearchStates.map((state, index) => {
      if (state.searchTerm) {
        return setTimeout(() => {
          searchIcdCodes(state.searchTerm, index);
        }, 300);
      }
      return null;
    });

    // Clear all timeouts on cleanup
    return () => {
      timeouts.forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [diagnosisSearchStates]);

  // Handle selecting an ICD code for a specific diagnosis
  const handleSelectIcdCode = (code, description, index) => {
    const updatedDiagnoses = [...diagnoses];
    updatedDiagnoses[index] = {
      icdCode: code,
      description: description,
    };

    setDiagnoses(updatedDiagnoses);

    // Reset search state for this diagnosis
    updateSearchState(index, {
      searchTerm: "",
      showSearch: false,
      searchResults: [],
    });
  };

  // Handle manual update of a diagnosis
  const handleDiagnosisChange = (index, field, value) => {
    const updatedDiagnoses = [...diagnoses];
    updatedDiagnoses[index] = {
      ...updatedDiagnoses[index],
      [field]: value,
    };
    setDiagnoses(updatedDiagnoses);
  };

  // Add a new empty diagnosis
  const addDiagnosis = () => {
    setDiagnoses([...diagnoses, { icdCode: "", description: "" }]);
    // Add a new search state for the new diagnosis
    setDiagnosisSearchStates((prev) => [
      ...prev,
      { searchTerm: "", showSearch: false, searchResults: [] },
    ]);
  };

  // Remove a diagnosis
  const removeDiagnosis = (index) => {
    if (diagnoses.length <= 1) {
      // Always keep at least one diagnosis
      setDiagnoses([{ icdCode: "", description: "" }]);
      setDiagnosisSearchStates([
        { searchTerm: "", showSearch: false, searchResults: [] },
      ]);
    } else {
      const updatedDiagnoses = diagnoses.filter((_, i) => i !== index);
      setDiagnoses(updatedDiagnoses);
      // Also remove the search state for this diagnosis
      setDiagnosisSearchStates((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center mb-3 justify-between">
        <div className="flex items-center">
          <Stethoscope className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Diagnosis</h3>
        </div>
        <button
          type="button"
          onClick={addDiagnosis}
          className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 flex items-center"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Tambah Diagnosis
        </button>
      </div>

      {diagnoses.map((diagnosis, index) => {
        const searchState = diagnosisSearchStates[index] || {
          searchTerm: "",
          showSearch: false,
          searchResults: [],
        };

        return (
          <div
            key={index}
            className={`mb-5 ${
              index > 0
                ? "border border-gray-200 rounded-lg bg-gray-50 p-4"
                : "border-0"
            }`}
          >
            <div className="flex justify-between mb-2">
              <span className="font-medium text-gray-700">
                {index === 0 ? "Diagnosis Utama" : `Diagnosis ${index + 1}`}
              </span>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeDiagnosis(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* ICD-10 search for this diagnosis */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ICD-10 Code{" "}
                {index === 0 ? "(Opsional jika diagnosis manual diisi)" : ""}
              </label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="ICD-10"
                  value={searchState.searchTerm}
                  onChange={(e) => {
                    updateSearchState(index, {
                      searchTerm: e.target.value,
                      showSearch: true,
                    });
                  }}
                  onFocus={() => {
                    updateSearchState(index, { showSearch: true });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    updateSearchState(index, {
                      showSearch: !searchState.showSearch,
                    });
                  }}
                  className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md"
                >
                  <Search className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* ICD code display */}
              {diagnosis.icdCode && (
                <div className="mt-2 flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-sm">
                    {diagnosis.icdCode}
                  </span>
                  <span className="ml-2 text-gray-600">
                    {diagnosis.description}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedDiagnoses = [...diagnoses];
                      updatedDiagnoses[index] = {
                        icdCode: "",
                        description: diagnosis.description,
                      };
                      setDiagnoses(updatedDiagnoses);
                    }}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* ICD search results for this diagnosis */}
              {searchState.showSearch &&
                searchState.searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white shadow-lg border border-gray-200 rounded-md max-h-60 overflow-y-auto">
                    <ul>
                      {searchState.searchResults.map((result) => (
                        <li
                          key={result.code}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 flex items-start"
                          onClick={() =>
                            handleSelectIcdCode(
                              result.code,
                              result.description,
                              index
                            )
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
                Diagnosis Manual{" "}
                {index === 0 ? "(Wajib jika ICD code tidak diisi)" : ""}
              </label>
              <textarea
                value={diagnosis.description}
                onChange={(e) =>
                  handleDiagnosisChange(index, "description", e.target.value)
                }
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Deskripsi diagnosis"
              />
            </div>
          </div>
        );
      })}

      {/* Clinical notes - remains unchanged */}
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
