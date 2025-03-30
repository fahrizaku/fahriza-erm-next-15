"use client";
import React, { useState, useEffect, useRef } from "react";
import { Check, Plus, Trash2, FlaskConical } from "lucide-react";

const LaboratoryOrderForm = ({ patientId, onChange }) => {
  const [showLabForm, setShowLabForm] = useState(false);
  const [selectedTests, setSelectedTests] = useState([]);
  const [otherTests, setOtherTests] = useState([]);
  const [newOtherTest, setNewOtherTest] = useState("");
  const [labNotes, setLabNotes] = useState("");

  // Use a ref to track if the initial render has occurred
  const initialRender = useRef(true);

  // Lab test categories from the form
  const labTests = {
    hematologi: [
      { id: "darah_lengkap", name: "Darah Lengkap" },
      { id: "goldar_abo", name: "Golongan Darah A B O" },
      { id: "goldar_rh", name: "Golongan Darah Rh" },
    ],
    profileLipid: [
      { id: "cholesterol", name: "Cholesterol" },
      { id: "trigliserida", name: "Trigliserida" },
    ],
    faalGinjal: [
      { id: "serum_creatinin", name: "Serum Creatinin" },
      { id: "bun", name: "BUN" },
      { id: "uric_acid", name: "Uric Acid" },
    ],
    imunologiSerologi: [{ id: "widal_test", name: "Widal Test" }],
    panelGlukosa: [
      { id: "glukosa_sewaktu", name: "Glukosa Sewaktu" },
      { id: "glukosa_puasa", name: "Glukosa Puasa" },
      { id: "glukosa_2jpp", name: "Glukosa 2 JPP" },
    ],
    faalHati: [
      { id: "sgot", name: "SGOT" },
      { id: "sgpt", name: "SGPT" },
    ],
    urine: [
      { id: "urine_lengkap", name: "Urine Lengkap" },
      { id: "protein_urine", name: "Protein Urine" },
    ],
  };

  // Use useEffect to update parent component when local state changes
  useEffect(() => {
    // Skip the effect on initial render to prevent immediate state updates
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    // Only call onChange if it exists
    if (onChange) {
      onChange({
        selectedTests,
        otherTests,
        notes: labNotes,
      });
    }
  }, [selectedTests, otherTests, labNotes]); // Removed onChange from dependencies

  const toggleTest = (testId) => {
    setSelectedTests((prev) => {
      return prev.includes(testId)
        ? prev.filter((id) => id !== testId)
        : [...prev, testId];
    });
  };

  const addOtherTest = () => {
    if (newOtherTest.trim()) {
      setOtherTests([...otherTests, newOtherTest]);
      setNewOtherTest("");
    }
  };

  const removeOtherTest = (index) => {
    const newOtherTests = otherTests.filter((_, i) => i !== index);
    setOtherTests(newOtherTests);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addOtherTest();
    }
  };

  const handleNotesChange = (e) => {
    setLabNotes(e.target.value);
  };

  return (
    <div className="mb-8">
      {/* Header with icon, similar to the DiagnosisForm */}
      <div className="flex items-center mb-4">
        <FlaskConical className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">
          Pemeriksaan Laboratorium
        </h3>
        <button
          type="button"
          onClick={() => setShowLabForm(!showLabForm)}
          className={`ml-auto px-3 py-1 rounded-md text-sm font-medium ${
            showLabForm
              ? "bg-purple-100 text-purple-700"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          {showLabForm ? "Tutup Form" : "Permohonan Pemeriksaan Lab"}
        </button>
      </div>

      {showLabForm && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Hematologi */}
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h4 className="font-medium text-gray-800 mb-2 border-b pb-1">
                Hematologi
              </h4>
              <div className="space-y-2">
                {labTests.hematologi.map((test) => (
                  <label key={test.id} className="flex items-center">
                    <div
                      className={`w-5 h-5 border rounded mr-2 flex items-center justify-center ${
                        selectedTests.includes(test.id)
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                      onClick={() => toggleTest(test.id)}
                    >
                      {selectedTests.includes(test.id) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm">{test.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Profile Lipid */}
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h4 className="font-medium text-gray-800 mb-2 border-b pb-1">
                Profile Lipid
              </h4>
              <div className="space-y-2">
                {labTests.profileLipid.map((test) => (
                  <label key={test.id} className="flex items-center">
                    <div
                      className={`w-5 h-5 border rounded mr-2 flex items-center justify-center ${
                        selectedTests.includes(test.id)
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                      onClick={() => toggleTest(test.id)}
                    >
                      {selectedTests.includes(test.id) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm">{test.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Faal Ginjal */}
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h4 className="font-medium text-gray-800 mb-2 border-b pb-1">
                Faal Ginjal
              </h4>
              <div className="space-y-2">
                {labTests.faalGinjal.map((test) => (
                  <label key={test.id} className="flex items-center">
                    <div
                      className={`w-5 h-5 border rounded mr-2 flex items-center justify-center ${
                        selectedTests.includes(test.id)
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                      onClick={() => toggleTest(test.id)}
                    >
                      {selectedTests.includes(test.id) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm">{test.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Imunologi / Serologi */}
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h4 className="font-medium text-gray-800 mb-2 border-b pb-1">
                Imunologi / Serologi
              </h4>
              <div className="space-y-2">
                {labTests.imunologiSerologi.map((test) => (
                  <label key={test.id} className="flex items-center">
                    <div
                      className={`w-5 h-5 border rounded mr-2 flex items-center justify-center ${
                        selectedTests.includes(test.id)
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                      onClick={() => toggleTest(test.id)}
                    >
                      {selectedTests.includes(test.id) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm">{test.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Panel Glukosa */}
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h4 className="font-medium text-gray-800 mb-2 border-b pb-1">
                Panel Glukosa
              </h4>
              <div className="space-y-2">
                {labTests.panelGlukosa.map((test) => (
                  <label key={test.id} className="flex items-center">
                    <div
                      className={`w-5 h-5 border rounded mr-2 flex items-center justify-center ${
                        selectedTests.includes(test.id)
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                      onClick={() => toggleTest(test.id)}
                    >
                      {selectedTests.includes(test.id) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm">{test.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Faal Hati */}
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h4 className="font-medium text-gray-800 mb-2 border-b pb-1">
                Faal Hati
              </h4>
              <div className="space-y-2">
                {labTests.faalHati.map((test) => (
                  <label key={test.id} className="flex items-center">
                    <div
                      className={`w-5 h-5 border rounded mr-2 flex items-center justify-center ${
                        selectedTests.includes(test.id)
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                      onClick={() => toggleTest(test.id)}
                    >
                      {selectedTests.includes(test.id) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm">{test.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Urine */}
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h4 className="font-medium text-gray-800 mb-2 border-b pb-1">
                Urine
              </h4>
              <div className="space-y-2">
                {labTests.urine.map((test) => (
                  <label key={test.id} className="flex items-center">
                    <div
                      className={`w-5 h-5 border rounded mr-2 flex items-center justify-center ${
                        selectedTests.includes(test.id)
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                      onClick={() => toggleTest(test.id)}
                    >
                      {selectedTests.includes(test.id) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm">{test.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Lain-lain (Custom) */}
            <div className="bg-white p-3 rounded-md shadow-sm md:col-span-2">
              <h4 className="font-medium text-gray-800 mb-2 border-b pb-1">
                Lain-Lain
              </h4>

              <div className="space-y-2 mb-3">
                {otherTests.map((test, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md"
                  >
                    <span className="text-sm">{test}</span>
                    <button
                      type="button"
                      onClick={() => removeOtherTest(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newOtherTest}
                  onChange={(e) => setNewOtherTest(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tambah pemeriksaan lain..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addOtherTest}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Notes and reason section */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alasan/Catatan Pemeriksaan Lab
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              rows="2"
              placeholder="Tambahkan alasan pemeriksaan atau catatan khusus..."
              value={labNotes}
              onChange={handleNotesChange}
            />
          </div>

          {/* Summary section */}
          {(selectedTests.length > 0 || otherTests.length > 0) && (
            <div className="mt-4 p-3 bg-white rounded-md border border-blue-200">
              <h4 className="font-medium text-gray-800 mb-2">
                Ringkasan Pemeriksaan Lab
              </h4>
              <div className="text-sm text-gray-600">
                <p>
                  Total Pemeriksaan: {selectedTests.length + otherTests.length}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {selectedTests.map((testId) => {
                    const test = Object.values(labTests)
                      .flat()
                      .find((t) => t.id === testId);
                    return (
                      test && (
                        <span
                          key={testId}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                        >
                          {test.name}
                        </span>
                      )
                    );
                  })}
                  {otherTests.map((test, index) => (
                    <span
                      key={`other-${index}`}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                    >
                      {test}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LaboratoryOrderForm;
