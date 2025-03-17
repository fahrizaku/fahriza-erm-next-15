// File: _components/PrescriptionItem.jsx
import React, { useRef, useEffect } from "react";
import { Minus, Search, Loader2 } from "lucide-react";

const PrescriptionItem = ({
  item,
  itemIndex,
  prescIndex,
  itemsLength,
  handlePrescriptionItemChange,
  removePrescriptionItem,
  // New props for drug search
  searchDrugs,
  drugSearchResults,
  isSearchingDrugs,
  selectDrug,
  drugSearchQuery
}) => {
  // Refs for handling dropdown
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        // Could use a state variable to control dropdown visibility if needed
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
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

        {/* Dosage */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Dosis
          </label>
          <input
            type="text"
            value={item.dosage}
            onChange={(e) =>
              handlePrescriptionItemChange(
                prescIndex,
                itemIndex,
                "dosage",
                e.target.value
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="3x sehari setelah makan"
          />
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