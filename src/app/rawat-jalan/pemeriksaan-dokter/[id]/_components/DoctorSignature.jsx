import React, { useState, useRef, useEffect } from "react";
import { PenTool, Search, Loader2 } from "lucide-react";
import { DOCTOR_SUGGESTIONS } from "@/data/doctor";

const DoctorSignature = ({ doctorName, onChange }) => {
  // State for search functionality
  const [filteredDoctors, setFilteredDoctors] = useState(DOCTOR_SUGGESTIONS);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Refs for handling dropdown
  const inputRef = useRef(null);
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

  // Handle input change and filter doctors
  const handleDoctorSearch = (value) => {
    // Create a synthetic event object
    const event = {
      target: {
        name: "doctorName",
        value: value,
      },
    };

    // Call the parent onChange handler
    onChange(event);

    // Start search indicator
    setIsSearching(true);

    // Filter doctors based on input
    const filtered = DOCTOR_SUGGESTIONS.filter((doctor) =>
      doctor.toLowerCase().includes(value.toLowerCase())
    );

    // Update filtered list and show suggestions
    setFilteredDoctors(filtered);
    setShowSuggestions(true);

    // End search indicator after a brief delay to simulate search
    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  };

  // Handle doctor selection from dropdown
  const handleDoctorSelection = (doctor) => {
    const event = {
      target: {
        name: "doctorName",
        value: doctor,
      },
    };
    onChange(event);
    setShowSuggestions(false);
  };

  // Show all suggestions when input is focused
  const handleInputFocus = () => {
    // If there's already text in the input, filter the suggestions
    if (doctorName) {
      const filtered = DOCTOR_SUGGESTIONS.filter((doctor) =>
        doctor.toLowerCase().includes(doctorName.toLowerCase())
      );
      setFilteredDoctors(filtered);
    } else {
      // Otherwise show all suggestions
      setFilteredDoctors(DOCTOR_SUGGESTIONS);
    }

    // Show the suggestions dropdown
    setShowSuggestions(true);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <div className="flex items-center">
          <PenTool className="h-4 w-4 mr-2 text-gray-500" />
          <span>Nama Dokter</span>
        </div>
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          name="doctorName"
          value={doctorName}
          onChange={(e) => handleDoctorSearch(e.target.value)}
          onFocus={handleInputFocus}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Cari atau masukkan nama dokter..."
          required
          autoComplete="off"
          spellCheck="false"
        />
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown for doctor suggestions */}
      {showSuggestions && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-48 overflow-y-auto"
        >
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor, index) => (
              <div
                key={index}
                onClick={() => handleDoctorSelection(doctor)}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
              >
                {doctor}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500 italic">
              Tidak ada dokter yang sesuai
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorSignature;
