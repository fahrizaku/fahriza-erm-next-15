import React from "react";
import { Pill, Plus, Clipboard, X } from "lucide-react";
import PrescriptionItem from "./PrescriptionItem";

const PrescriptionsForm = ({
  prescriptions,
  handlePrescriptionTypeChange,
  handlePrescriptionNotesChange,
  handlePrescriptionItemChange,
  addPrescriptionItem,
  removePrescriptionItem,
  addPrescription,
  removePrescription,
  handleSharedDosageChange,
  // Drug search props
  searchDrugs,
  drugSearchResults,
  isSearchingDrugs,
  selectDrug,
  drugSearchQuery,
}) => {
  const addRegularPrescription = () => {
    addPrescription("Main"); // Default type is "Main" (Utama)
  };

  const addRacikanPrescription = () => {
    addPrescription("Racikan"); // Add a racikan type prescription
  };

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Pill className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Resep Obat</h3>
      </div>

      {/* Multiple prescriptions */}
      <div className="space-y-6">
        {prescriptions.map((prescription, prescIndex) => {
          const isRacikan = prescription.type === "Racikan";

          return (
            <div
              key={prescription.id}
              className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden"
            >
              {/* Prescription header */}
              <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <Clipboard className="h-4 w-4 text-blue-600 mr-2" />
                  <h4 className="font-medium text-gray-800">
                    Resep {prescIndex + 1}
                  </h4>
                </div>
                <div className="flex items-center space-x-3">
                  <select
                    value={prescription.type}
                    onChange={(e) =>
                      handlePrescriptionTypeChange(prescIndex, e.target.value)
                    }
                    className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                  >
                    <option value="Main">Utama</option>
                    <option value="Alternative">Alternatif</option>
                    <option value="Follow-up">Lanjutan</option>
                    <option value="Racikan">Racikan</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removePrescription(prescIndex)}
                    disabled={prescriptions.length === 1}
                    className={`p-1 rounded ${
                      prescriptions.length === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-500 hover:bg-red-50"
                    }`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Prescription contents */}
              <div className="p-4">
                {/* For racikan prescriptions, show a shared dosage field */}
                {isRacikan && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                    <label className="block text-sm font-medium text-blue-800 mb-2">
                      Dosis Racikan
                    </label>
                    <input
                      type="text"
                      value={prescription.sharedDosage}
                      onChange={(e) =>
                        handleSharedDosageChange(prescIndex, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Dosis untuk semua obat dalam racikan ini (contoh: 3 x sehari setelah makan)"
                    />
                  </div>
                )}

                {/* Prescription items */}
                <div className="space-y-4 mb-4">
                  {prescription.items.map((item, itemIndex) => (
                    <PrescriptionItem
                      key={item.id}
                      item={item}
                      itemIndex={itemIndex}
                      prescIndex={prescIndex}
                      itemsLength={prescription.items.length}
                      handlePrescriptionItemChange={
                        handlePrescriptionItemChange
                      }
                      removePrescriptionItem={removePrescriptionItem}
                      // Pass drug search props
                      searchDrugs={searchDrugs}
                      drugSearchResults={drugSearchResults}
                      isSearchingDrugs={isSearchingDrugs}
                      selectDrug={selectDrug}
                      drugSearchQuery={drugSearchQuery}
                      // Pass racikan info
                      isRacikan={isRacikan}
                      sharedDosage={prescription.sharedDosage}
                    />
                  ))}
                </div>

                {/* Add prescription item button */}
                <button
                  type="button"
                  onClick={() => addPrescriptionItem(prescIndex)}
                  className="w-full py-2 border border-dashed border-gray-300 rounded-md text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors text-sm flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  <span>Tambah Obat</span>
                </button>

                {/* Prescription notes */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Tambahan Resep
                  </label>
                  <textarea
                    value={prescription.notes}
                    onChange={(e) =>
                      handlePrescriptionNotesChange(prescIndex, e.target.value)
                    }
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Catatan tambahan untuk apoteker (opsional)"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Buttons moved to bottom */}
      <div className="flex items-center justify-center mt-6 space-x-3">
        <button
          type="button"
          onClick={addRegularPrescription}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center shadow-sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Tambah Resep Baru
        </button>
        <button
          type="button"
          onClick={addRacikanPrescription}
          className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm flex items-center shadow-sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Tambah Racikan
        </button>
      </div>
    </div>
  );
};

export default PrescriptionsForm;
