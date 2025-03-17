import React, { useRef, useEffect, useState } from "react";
import { Minus, Search, Loader2 } from "lucide-react";
import { DOSAGE_SUGGESTIONS } from "@/data/dosis";

const PrescriptionItem = ({
  item,
  itemIndex,
  prescIndex,
  itemsLength,
  handlePrescriptionItemChange,
  removePrescriptionItem,
  // Drug search props
  searchDrugs,
  drugSearchResults,
  isSearchingDrugs,
  selectDrug,
  drugSearchQuery,
}) => {
  // Refs for handling dropdown
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const dosageInputRef = useRef(null);
  const dosageDropdownRef = useRef(null);

  // State to control dosage suggestions visibility
  const [showDosageSuggestions, setShowDosageSuggestions] = useState(false);
  // State to store filtered dosage suggestions
  const [filteredDosageSuggestions, setFilteredDosageSuggestions] =
    useState(DOSAGE_SUGGESTIONS);

  // Close drug search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        // Could use a state variable to control dropdown visibility if needed
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle dosage suggestions dropdown
  useEffect(() => {
    const handleClickOutsideDosage = (event) => {
      if (
        dosageDropdownRef.current &&
        !dosageDropdownRef.current.contains(event.target) &&
        dosageInputRef.current &&
        !dosageInputRef.current.contains(event.target)
      ) {
        setShowDosageSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideDosage);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDosage);
    };
  }, []);

  // Handle selecting a dosage suggestion
  const handleSelectDosage = (suggestion) => {
    handlePrescriptionItemChange(prescIndex, itemIndex, "dosage", suggestion);
    setShowDosageSuggestions(false);
  };

  // Filter dosage suggestions based on input
  const handleDosageInputChange = (value) => {
    handlePrescriptionItemChange(prescIndex, itemIndex, "dosage", value);

    // Filter suggestions based on input
    const filtered = DOSAGE_SUGGESTIONS.filter((suggestion) =>
      suggestion.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDosageSuggestions(filtered);

    // Show suggestions dropdown if we have input
    setShowDosageSuggestions(true);
  };

  return (
    <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-sm font-medium text-gray-700">
          Obat #{itemIndex + 1}
        </h4>
        <button
          type="button"
          onClick={() => removePrescriptionItem(prescIndex, itemIndex)}
          disabled={itemsLength === 1}
          className={`p-1 rounded-full ${
            itemsLength === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-red-500 hover:bg-red-100"
          }`}
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Drug name with autocomplete */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Nama Obat
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={item.manualDrugName}
              onChange={(e) => {
                handlePrescriptionItemChange(
                  prescIndex,
                  itemIndex,
                  "manualDrugName",
                  e.target.value
                );
                searchDrugs(e.target.value);
              }}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cari obat..."
            />
            {isSearchingDrugs && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
              </div>
            )}
          </div>

          {/* Dropdown for drug search results */}
          {drugSearchResults.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-48 overflow-y-auto"
            >
              {drugSearchResults.map((drug) => (
                <div
                  key={drug.id}
                  onClick={() => selectDrug(prescIndex, itemIndex, drug)}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                >
                  <div className="font-medium">{drug.displayName}</div>
                  {/* <div className="text-xs text-gray-500">
                    Stok: {drug.stock} | Harga: Rp {drug.price.toLocaleString()}
                  </div> */}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dosage with searchable suggestions */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Dosis
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              ref={dosageInputRef}
              type="text"
              value={item.dosage}
              onChange={(e) => handleDosageInputChange(e.target.value)}
              onFocus={() => setShowDosageSuggestions(true)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cari atau masukkan dosis..."
            />
          </div>

          {/* Dropdown for filtered dosage suggestions */}
          {showDosageSuggestions && filteredDosageSuggestions.length > 0 && (
            <div
              ref={dosageDropdownRef}
              className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-48 overflow-y-auto"
            >
              {filteredDosageSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectDosage(suggestion)}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quantity */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Jumlah
          </label>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) =>
              handlePrescriptionItemChange(
                prescIndex,
                itemIndex,
                "quantity",
                e.target.value
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default PrescriptionItem;
