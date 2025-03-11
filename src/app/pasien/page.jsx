//patien page
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Shield,
  User,
  Loader2,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  FileText,
  MapPin,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Patient = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPatients, setTotalPatients] = useState(0);
  const [sortField, setSortField] = useState("no_rm");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showTypeOptions, setShowTypeOptions] = useState(false);
  const [patientType, setPatientType] = useState("all"); // 'all', 'regular', or 'bpjs'
  const [clickedPatientId, setClickedPatientId] = useState(null); // Track which patient card is clicked
  const [isAddingPatient, setIsAddingPatient] = useState(false); // Track if we're navigating to add patient page

  const ITEMS_PER_PAGE = 15;
  const DEBOUNCE_DELAY = 500; // 500ms debounce delay

  // Setup debounce for search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery !== "") {
      handleSearch();
    } else if (debouncedSearchQuery === "" && searchQuery === "") {
      // Only fetch initial patients when both actual and debounced queries are empty
      fetchInitialPatients();
    }
  }, [debouncedSearchQuery]);

  // Fetch patients on first mount or when sort changes
  useEffect(() => {
    fetchInitialPatients();
  }, [sortField, sortOrder, patientType]);

  // Function to fetch initial data
  const fetchInitialPatients = async () => {
    try {
      setIsLoading(true);
      setPage(1);

      const response = await fetch(
        `/api/patients?page=1&limit=${ITEMS_PER_PAGE}&sortField=${sortField}&sortOrder=${sortOrder}&type=${patientType}`
      );
      const data = await response.json();

      if (data.success) {
        setPatients(data.patients);
        setHasMore(data.pagination.hasMore);
        setTotalPatients(data.pagination.total);
      } else {
        console.error("Failed to fetch patients:", data.message);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load more patients
  const loadMorePatients = async () => {
    if (!hasMore || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;

      const endpoint = debouncedSearchQuery
        ? `/api/patients/search?q=${encodeURIComponent(
            debouncedSearchQuery
          )}&page=${nextPage}&limit=${ITEMS_PER_PAGE}&sortField=${sortField}&sortOrder=${sortOrder}&type=${patientType}`
        : `/api/patients?page=${nextPage}&limit=${ITEMS_PER_PAGE}&sortField=${sortField}&sortOrder=${sortOrder}&type=${patientType}`;

      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.success) {
        setPatients((prevPatients) => [...prevPatients, ...data.patients]);
        setPage(nextPage);
        setHasMore(data.pagination.hasMore);
      } else {
        console.error("Failed to load more patients:", data.message);
      }
    } catch (error) {
      console.error("Error loading more patients:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Handle search - made it a useCallback to avoid recreation
  const handleSearch = useCallback(async () => {
    try {
      setIsLoading(true);
      setPage(1);

      const response = await fetch(
        `/api/patients/search?q=${encodeURIComponent(
          debouncedSearchQuery
        )}&page=1&limit=${ITEMS_PER_PAGE}&sortField=${sortField}&sortOrder=${sortOrder}&type=${patientType}`
      );
      const data = await response.json();

      if (data.success) {
        setPatients(data.patients);
        setHasMore(data.pagination.hasMore);
        setTotalPatients(data.pagination.total);
      } else {
        console.error("Search failed:", data.message);
      }
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, sortField, sortOrder, patientType]);

  // Clear search and reset data
  const clearSearch = () => {
    if (searchQuery) {
      setSearchQuery("");
      setDebouncedSearchQuery("");
      fetchInitialPatients();
    }
  };

  // Toggle sort order or change field
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new field with default asc order
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Get sort icon based on current sort settings
  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortOrder === "asc" ? (
      <ChevronUp className="h-4 w-4 text-blue-500" />
    ) : (
      <ChevronDown className="h-4 w-4 text-blue-500" />
    );
  };

  // Set patient type
  const handlePatientTypeChange = (type) => {
    setPatientType(type);
    setShowTypeOptions(false);
  };

  // Get patient type label
  const getPatientTypeLabel = () => {
    switch (patientType) {
      case "regular":
        return "Umum";
      case "bpjs":
        return "BPJS";
      default:
        return "Semua Pasien";
    }
  };

  // Handle patient card click with loading state
  const handlePatientClick = (patientId, isBPJS) => {
    setClickedPatientId(patientId);
    // Navigate to patient details page
    router.push(`/pasien/${patientId}`);
  };

  // Handle add new patient click
  const handleAddNewPatient = () => {
    setIsAddingPatient(true);
    router.push("/pasien/tambah-cepat");
  };

  const BPJSBadge = () => (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-sm font-medium shadow-sm">
      <Shield className="h-4 w-4" strokeWidth={2.5} />
      <span>BPJS</span>
    </div>
  );

  const GeneralBadge = () => (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
      <User className="h-4 w-4" strokeWidth={2.5} />
      <span>Umum</span>
    </div>
  );

  // Function to capitalize each word
  const capitalizeEachWord = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Calculate age based on birthDate
  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    const birth = new Date(birthDate);
    const ageDifMs = Date.now() - birth.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="max-w-6xl mx-auto pt-4 px-1 sm:p-6">
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <div className="p-4 sm:p-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Data Pasien 🧑‍🤝‍👩
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {totalPatients} pasien ditemukan
              </p>
            </div>
            <button
              onClick={handleAddNewPatient}
              disabled={isAddingPatient}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-80"
            >
              {isAddingPatient ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memuat...</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  <span>+ Pasien Baru</span>
                </>
              )}
            </button>
          </div>

          {/* Search Input - Fixed for better mobile responsiveness */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col space-y-3">
              {/* Search field and input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan nama atau nomor RM..."
                  className="w-full pl-10 sm:pl-12 pr-12 py-2.5 sm:py-3.5 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition-all text-sm sm:text-base"
                />
                {isLoading && searchQuery && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  </div>
                )}
                {searchQuery && !isLoading && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <X className="h-4 w-4 font-bold" strokeWidth={2.5} />
                  </button>
                )}
              </div>

              {/* Patient Type Filter Dropdown */}
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowTypeOptions(!showTypeOptions)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>{getPatientTypeLabel()}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showTypeOptions && (
                    <div className="absolute left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 w-40">
                      <button
                        onClick={() => handlePatientTypeChange("all")}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          patientType === "all"
                            ? "bg-blue-50 text-blue-600"
                            : ""
                        }`}
                      >
                        Semua Pasien
                      </button>
                      <button
                        onClick={() => handlePatientTypeChange("regular")}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          patientType === "regular"
                            ? "bg-blue-50 text-blue-600"
                            : ""
                        }`}
                      >
                        Umum
                      </button>
                      <button
                        onClick={() => handlePatientTypeChange("bpjs")}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          patientType === "bpjs"
                            ? "bg-blue-50 text-blue-600"
                            : ""
                        }`}
                      >
                        BPJS
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sort Options - Improved for mobile */}
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <div className="text-sm text-gray-600 mr-2 mb-2 sm:mb-0 sm:mt-1">
              Urutkan:
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSort("no_rm")}
                className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1
                  ${
                    sortField === "no_rm"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
              >
                <span>No. RM</span>
                {getSortIcon("no_rm")}
              </button>
              <button
                onClick={() => handleSort("updatedAt")}
                className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1
                  ${
                    sortField === "updatedAt"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
              >
                <span>Update Terakhir</span>
                {getSortIcon("updatedAt")}
              </button>
            </div>
          </div>

          {/* Patient List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Memuat data pasien...</p>
              </div>
            ) : patients.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Tidak ada pasien yang ditemukan</p>
              </div>
            ) : (
              <>
                {patients.map((patient, index) => {
                  const age = calculateAge(patient.birthDate);
                  const capitalizedName = capitalizeEachWord(patient.name);
                  const capitalizedAddress = capitalizeEachWord(
                    patient.address
                  );

                  // Determine if patient is BPJS based on either isBPJS flag or patientType
                  const isBPJS =
                    patient.isBPJS || patient.patientType === "bpjs";

                  // Check if this card is currently in loading state
                  const isCardLoading = clickedPatientId === patient.id;

                  return (
                    <div
                      key={`${patient.id}-${index}-${
                        patient.patientType || ""
                      }`}
                      onClick={() => handlePatientClick(patient.id, isBPJS)}
                      className="block cursor-pointer relative"
                    >
                      <div
                        className={`group p-4 bg-white border-2 ${
                          isCardLoading
                            ? "border-blue-300 bg-blue-50"
                            : "border-indigo-100"
                        } rounded-lg hover:border-indigo-200 hover:shadow-md transition-all`}
                      >
                        {/* Loading overlay */}
                        {isCardLoading && (
                          <div className="absolute inset-0 bg-blue-50 bg-opacity-60 rounded-lg flex items-center justify-center z-10">
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                              <span className="text-blue-700 font-medium">
                                Memuat...
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col gap-2">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                                {capitalizedName}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <span>{patient.gender || "N/A"}</span>
                                <span>•</span>
                                <span>{age} tahun</span>
                              </div>
                            </div>
                            <div>
                              {isBPJS ? <BPJSBadge /> : <GeneralBadge />}
                            </div>
                          </div>

                          {/* Info Section dengan Icon */}
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            {/* RM dengan Icon */}
                            <div className="flex items-center text-sm">
                              <div className="w-4 flex justify-center">
                                <FileText className="w-4 h-4 text-gray-500" />
                              </div>
                              <span className="text-gray-500 ml-1">RM:</span>
                              <span
                                className={`font-mono ml-1 px-1.5 py-0.5 rounded ${
                                  isBPJS
                                    ? "bg-emerald-200 text-black"
                                    : "bg-blue-200 text-black"
                                }`}
                              >
                                {patient.no_rm}
                              </span>
                            </div>

                            {/* Alamat dengan Icon */}
                            <div className="mt-1 flex text-sm items-center">
                              <div className="w-4 flex justify-center flex-shrink-0">
                                <MapPin className="w-4 h-4 text-gray-500" />
                              </div>
                              <span className="ml-1 text-gray-600 line-clamp-1">
                                {capitalizedAddress || "Alamat tidak tersedia"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center py-4">
                    <button
                      onClick={loadMorePatients}
                      disabled={isLoadingMore}
                      className="px-6 py-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors font-medium flex items-center gap-2 mx-auto disabled:opacity-70"
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Memuat...</span>
                        </>
                      ) : (
                        <span>Tampilkan Lebih Banyak</span>
                      )}
                    </button>
                  </div>
                )}

                {/* End of list message */}
                {!hasMore && patients.length > 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Semua data pasien telah dimuat
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patient;
