// app/rawat-jalan/screening/[id]/_components/NurseNameSection.jsx
import React, { useState, useRef, useEffect } from "react";
import { User, Search, Loader2, InfoIcon } from "lucide-react";
import { NURSE_SUGGESTIONS } from "@/data/perawat";

const NurseNameSection = ({ screening, handleInputChange }) => {
  // State for search functionality
  const [filteredNurses, setFilteredNurses] = useState(NURSE_SUGGESTIONS);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Refs for handling dropdown
  const inputRef = useRef(null);
  const inputContainerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close suggestion dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle input change and filter nurses
  const handleNurseSearch = (value) => {
    // Create a synthetic event object
    const event = {
      target: {
        name: "nurseName",
        value: value,
      },
    };

    // Call the parent onChange handler
    handleInputChange(event);

    // Start search indicator
    setIsSearching(true);

    // Filter nurses based on input
    const filtered = NURSE_SUGGESTIONS.filter((nurse) =>
      nurse.toLowerCase().includes(value.toLowerCase())
    );

    // Update filtered list and show suggestions
    setFilteredNurses(filtered);
    setShowSuggestions(true);

    // End search indicator after a brief delay to simulate search
    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  };

  // Handle nurse selection from dropdown
  const handleNurseSelection = (nurse) => {
    const event = {
      target: {
        name: "nurseName",
        value: nurse,
      },
    };
    handleInputChange(event);
    setShowSuggestions(false);
  };

  // Show all suggestions when input is focused
  const handleInputFocus = () => {
    // If there's already text in the input, filter the suggestions
    if (screening.nurseName) {
      const filtered = NURSE_SUGGESTIONS.filter((nurse) =>
        nurse.toLowerCase().includes(screening.nurseName.toLowerCase())
      );
      setFilteredNurses(filtered);
    } else {
      // Otherwise show all suggestions
      setFilteredNurses(NURSE_SUGGESTIONS);
    }

    // Show the suggestions dropdown
    setShowSuggestions(true);
  };

  return (
    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
      <h3 className="text-md font-semibold text-gray-800 mb-4">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2 text-teal-500" />
          <span>
            Perawat / Petugas <span className="text-red-500">*</span>
          </span>
        </div>
      </h3>

      <div className="flex flex-col gap-3">
        <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
          <label
            htmlFor="nurseName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nama Perawat/Petugas <span className="text-red-500">*</span>
          </label>

          <div className="relative" ref={inputContainerRef}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              ref={inputRef}
              type="text"
              id="nurseName"
              name="nurseName"
              value={screening.nurseName || ""}
              onChange={(e) => handleNurseSearch(e.target.value)}
              onFocus={handleInputFocus}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Cari atau masukkan nama perawat/petugas..."
              required
              autoComplete="off"
              spellCheck="false"
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Loader2 className="h-4 w-4 text-teal-500 animate-spin" />
              </div>
            )}

            {/* Dropdown for nurse suggestions - now with fixed width */}
            {showSuggestions && (
              <div
                ref={dropdownRef}
                className="absolute z-10 mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-48 overflow-y-auto left-0 right-0"
                style={{
                  width: inputRef.current
                    ? inputRef.current.offsetWidth
                    : "100%",
                }}
              >
                {filteredNurses.length > 0 ? (
                  filteredNurses.map((nurse, index) => (
                    <div
                      key={index}
                      onClick={() => handleNurseSelection(nurse)}
                      className="px-4 py-2 hover:bg-teal-50 cursor-pointer text-sm"
                    >
                      {nurse}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500 italic">
                    Tidak ada perawat/petugas yang sesuai
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-3 flex items-start">
            <InfoIcon className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-xs text-gray-600">
              Nama perawat/petugas yang melakukan skrining akan dicatat dalam
              rekam medis pasien
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseNameSection;
