// app/pasien/page.jsx - Main container
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import PatientHeader from "./_components/PatientHeader";
import SearchFilter from "./_components/SearchFilter";
import SortOptions from "./_components/SortOptions";
import PatientList from "./_components/PatientList";
import LoadMoreButton from "./_components/LoadMoreButton";

export default function PatientPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPatients, setTotalPatients] = useState(0);
  const [sortField, setSortField] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [patientType, setPatientType] = useState("all");
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [loadingPatientId, setLoadingPatientId] = useState(null);

  const ITEMS_PER_PAGE = 15;
  const DEBOUNCE_DELAY = 500;

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
      fetchInitialPatients();
    }
  }, [debouncedSearchQuery]);

  // Fetch patients on first mount or when sort/filter changes
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

  // Handle search
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
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Set patient type
  const handlePatientTypeChange = (type) => {
    setPatientType(type);
  };

  // Handle add new patient click
  const handleAddNewPatient = () => {
    setIsAddingPatient(true);
    router.push("/pasien/tambah");
  };

  // Handle patient card click with loading state
  const handlePatientClick = (patientId) => {
    setLoadingPatientId(patientId);
    setTimeout(() => {
      router.push(`/pasien/${patientId}`);
    }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto pt-4 px-1 sm:p-6">
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <div className="p-4 sm:p-6">
          <PatientHeader
            totalPatients={totalPatients}
            isAddingPatient={isAddingPatient}
            onAddNewPatient={handleAddNewPatient}
          />

          <SearchFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isLoading={isLoading}
            clearSearch={clearSearch}
            patientType={patientType}
            onPatientTypeChange={handlePatientTypeChange}
          />

          <SortOptions
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
          />

          <PatientList
            patients={patients}
            isLoading={isLoading}
            loadingPatientId={loadingPatientId}
            onPatientClick={handlePatientClick}
          />

          {hasMore && (
            <LoadMoreButton
              onLoadMore={loadMorePatients}
              isLoading={isLoadingMore}
            />
          )}

          {!hasMore && patients.length > 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              Semua data pasien telah dimuat
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
