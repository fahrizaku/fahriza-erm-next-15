import React, { useState, useRef, useEffect } from "react";
import {
  Clock,
  User,
  Pill,
  CheckCircle,
  Package,
  CreditCard,
  Beaker,
  Loader2,
  ArrowRight,
  Eye,
  Building,
  Search,
  InfoIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PHARMACIST_SUGGESTIONS } from "@/data/petugas-farmasi";
// Import the PharmacyDiagnosisDisplay component
import PharmacyDiagnosisDisplay from "./PharmacyDiagnosisDisplay";

export default function PharmacyQueueCards({
  queueData,
  onPrepareRx,
  onReadyRx,
  onDispenseRx,
  processingId,
}) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [pharmacistName, setPharmacistName] = useState("");
  const [showContinueDialog, setShowContinueDialog] = useState(false);

  // New state for pharmacist search functionality
  const [filteredPharmacists, setFilteredPharmacists] = useState(
    PHARMACIST_SUGGESTIONS
  );
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

  // Handle pharmacist search
  const handlePharmacistSearch = (value) => {
    setPharmacistName(value);

    // Start search indicator
    setIsSearching(true);

    // Filter pharmacists based on input
    const filtered = PHARMACIST_SUGGESTIONS.filter((pharmacist) =>
      pharmacist.toLowerCase().includes(value.toLowerCase())
    );

    // Update filtered list and show suggestions
    setFilteredPharmacists(filtered);
    setShowSuggestions(true);

    // End search indicator after a brief delay to simulate search
    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  };

  // Handle pharmacist selection from dropdown
  const handlePharmacistSelection = (pharmacist) => {
    setPharmacistName(pharmacist);
    setShowSuggestions(false);
  };

  // Show all suggestions when input is focused
  const handleInputFocus = () => {
    // If there's already text in the input, filter the suggestions
    if (pharmacistName) {
      const filtered = PHARMACIST_SUGGESTIONS.filter((pharmacist) =>
        pharmacist.toLowerCase().includes(pharmacistName.toLowerCase())
      );
      setFilteredPharmacists(filtered);
    } else {
      // Otherwise show all suggestions
      setFilteredPharmacists(PHARMACIST_SUGGESTIONS);
    }

    // Show the suggestions dropdown
    setShowSuggestions(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "waiting":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Menunggu
          </span>
        );
      case "preparing":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Beaker className="w-3 h-3 mr-1" />
            Sedang Disiapkan
          </span>
        );
      case "ready":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <Package className="w-3 h-3 mr-1" />
            Siap Diambil
          </span>
        );
      case "dispensed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Telah Diserahkan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // Function to get visit type in Indonesian
  const getVisitTypeLabel = (visitType) => {
    switch (visitType) {
      case "outpatient":
        return "Rawat Jalan";
      case "inpatient":
        return "Rawat Inap";
      case "emergency":
        return "Gawat Darurat";
      default:
        return visitType || "N/A";
    }
  };

  const handlePrepareClick = (e, item) => {
    e.stopPropagation();
    setSelectedItem(item);
    setShowDialog(true);
  };

  const handleContinueClick = (e, item) => {
    e.stopPropagation();
    setSelectedItem(item);
    setShowContinueDialog(true);
  };

  const handleViewDetailClick = (e, medicalRecordId) => {
    e.stopPropagation();
    router.push(`/apotek/antrian-resep/${medicalRecordId}`);
  };

  const handleSubmitPharmacist = async (e) => {
    e.preventDefault();
    setShowDialog(false);

    try {
      await onPrepareRx(selectedItem.medicalRecordId, pharmacistName);
      // Navigate to the prescription detail page after successful preparation
      router.push(`/apotek/antrian-resep/${selectedItem.medicalRecordId}`);
    } catch (error) {
      console.error("Error preparing prescription:", error);
    }

    setPharmacistName("");
    setSelectedItem(null);
  };

  const handleConfirmContinue = () => {
    setShowContinueDialog(false);
    // Navigate to prescription detail page
    router.push(`/apotek/antrian-resep/${selectedItem.medicalRecordId}`);
    setSelectedItem(null);
  };

  const getActionButton = (item) => {
    // Prevent click event from bubbling up to the card when clicking action buttons
    const handleClick = (callback, id) => (e) => {
      e.stopPropagation();
      callback(id);
    };

    // Check if this item is currently being processed
    const isLoading = processingId === item.medicalRecordId;

    // Common button classes with disabled state
    const baseButtonClasses =
      "inline-flex items-center px-3 py-1.5 text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2";

    switch (item.status) {
      case "waiting":
        return (
          <button
            onClick={(e) => handlePrepareClick(e, item)}
            disabled={isLoading}
            className={`${baseButtonClasses} ${
              isLoading
                ? "bg-blue-400 text-white cursor-not-allowed"
                : "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Menyiapkan...
              </>
            ) : (
              <>
                <Beaker className="w-3 h-3 mr-1" />
                Siapkan
              </>
            )}
          </button>
        );
      case "preparing":
        return (
          <button
            onClick={(e) => handleContinueClick(e, item)}
            disabled={isLoading}
            className={`${baseButtonClasses} ${
              isLoading
                ? "bg-blue-400 text-white cursor-not-allowed"
                : "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <ArrowRight className="w-3 h-3 mr-1" />
                Lanjutkan
              </>
            )}
          </button>
        );
      case "ready":
        return (
          <div className="flex space-x-2">
            <button
              onClick={(e) => handleViewDetailClick(e, item.medicalRecordId)}
              className={`${baseButtonClasses} text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500`}
            >
              <Eye className="w-3 h-3 mr-1" />
              Lihat Detail
            </button>
            <button
              onClick={handleClick(onDispenseRx, item.medicalRecordId)}
              disabled={isLoading}
              className={`${baseButtonClasses} ${
                isLoading
                  ? "bg-green-400 text-white cursor-not-allowed"
                  : "text-white bg-green-600 hover:bg-green-700 focus:ring-green-500"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Menyerahkan...
                </>
              ) : (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Serahkan
                </>
              )}
            </button>
          </div>
        );
      case "dispensed":
        return (
          <button
            onClick={(e) => handleViewDetailClick(e, item.medicalRecordId)}
            className={`${baseButtonClasses} text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500`}
          >
            <Eye className="w-3 h-3 mr-1" />
            Lihat Detail
          </button>
        );
      default:
        return null;
    }
  };

  // Helper function to calculate age from birthDate
  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {queueData.map((item) => (
          <div
            key={item.medicalRecordId}
            className={`border border-gray-200 rounded-lg shadow-sm transition-shadow ${
              processingId === item.medicalRecordId
                ? "bg-white/75"
                : "bg-white hover:shadow-md"
            }`}
          >
            <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <div className="flex items-center space-x-2">
                <div className="inline-flex items-center justify-center h-6 w-6 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  {item.queueNumber}
                </div>
                <h3 className="text-sm font-medium text-gray-900">
                  {item.patientName}
                </h3>
              </div>
              <div>{getStatusBadge(item.status)}</div>
            </div>

            <div className="p-3">
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  <p>
                    {item.gender || "N/A"} · {calculateAge(item.birthDate)}{" "}
                    tahun
                  </p>
                </div>

                <div className="flex items-center">
                  <Building className="h-4 w-4 text-gray-500 mr-2" />
                  <p>{getVisitTypeLabel(item.visitType)}</p>
                </div>

                {/* Replace the old diagnosis display with the new component */}
                <PharmacyDiagnosisDisplay medicalRecord={item} />

                <div className="flex items-center">
                  <Pill className="h-4 w-4 text-gray-500 mr-2" />
                  <p>
                    {item.prescriptionCount || 0} Resep (
                    {item.prescriptionItemCount || 0} item)
                  </p>
                </div>

                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 text-gray-500 mr-2" />
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">
                      Tipe Pembayaran:
                    </span>
                    {item.isBPJSActive ? (
                      <span className="ml-1 px-1.5 py-0.5 bg-green-100 text-green-800 font-medium rounded text-xs">
                        BPJS
                      </span>
                    ) : (
                      <span className="ml-1 font-medium text-gray-900">
                        Umum
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {item.pharmacistName && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    Petugas Farmasi: {item.pharmacistName}
                  </p>
                </div>
              )}

              <div className="mt-3 pt-2 border-t border-gray-200 flex justify-end">
                {getActionButton(item)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Updated Pharmacist Name Input Dialog with Suggestions */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Siapkan Resep
            </h3>
            <form onSubmit={handleSubmitPharmacist}>
              <div className="mb-4">
                <label
                  htmlFor="pharmacistName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nama Petugas Farmasi <span className="text-red-500">*</span>
                </label>

                <div className="relative" ref={inputContainerRef}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    id="pharmacistName"
                    name="pharmacistName"
                    value={pharmacistName}
                    onChange={(e) => handlePharmacistSearch(e.target.value)}
                    onFocus={handleInputFocus}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cari atau masukkan nama petugas farmasi..."
                    required
                    autoComplete="off"
                    spellCheck="false"
                  />
                  {isSearching && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    </div>
                  )}

                  {/* Dropdown for pharmacist suggestions */}
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
                      {filteredPharmacists.length > 0 ? (
                        filteredPharmacists.map((pharmacist, index) => (
                          <div
                            key={index}
                            onClick={() =>
                              handlePharmacistSelection(pharmacist)
                            }
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                          >
                            {pharmacist}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500 italic">
                          Tidak ada petugas farmasi yang sesuai
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-start">
                  <InfoIcon className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-xs text-gray-600">
                    Nama petugas farmasi yang menyiapkan resep akan dicatat
                    dalam rekam medis pasien
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => {
                    setShowDialog(false);
                    setSelectedItem(null);
                    setPharmacistName("");
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Siapkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Continue Confirmation Dialog */}
      {showContinueDialog && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Konfirmasi
            </h3>
            <p className="mb-4 text-gray-600">
              Resep ini sedang disiapkan oleh{" "}
              <span className="font-bold">{selectedItem.pharmacistName}</span>.
              Apakah Anda ingin melanjutkannya?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => {
                  setShowContinueDialog(false);
                  setSelectedItem(null);
                }}
              >
                Batal
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                onClick={handleConfirmContinue}
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
