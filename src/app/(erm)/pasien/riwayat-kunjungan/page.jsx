// app/pasien/riwayat-kunjungan/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Loader2,
  AlertTriangle,
  Calendar,
  Clock,
  ChevronRight,
  User,
  RefreshCw,
  Stethoscope,
  Building,
  CreditCard,
  Shield,
  Bed,
} from "lucide-react";
import { toast } from "react-toastify";

// MedicalRecordCard Component
const MedicalRecordCard = ({ record }) => {
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to capitalize each word
  const capitalizeEachWord = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Calculate age from birthdate
  const calculateAge = (birthDate) => {
    if (!birthDate) return "";
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

    return `${age} tahun`;
  };

  // Truncate text with ellipsis
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Translate visitType to Indonesian
  const getVisitTypeLabel = (visitType) => {
    switch (visitType.toLowerCase()) {
      case "outpatient":
        return "Rawat Jalan";
      case "inpatient":
        return "Rawat Inap";
      default:
        return capitalizeEachWord(visitType);
    }
  };

  // Get appropriate icon and color for visit type
  const getVisitTypeStyles = (visitType) => {
    switch (visitType.toLowerCase()) {
      case "outpatient":
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
          Icon: Building,
        };
      case "inpatient":
        return {
          bgColor: "bg-purple-100",
          textColor: "text-purple-700",
          Icon: Bed,
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          Icon: Building,
        };
    }
  };

  // Get payment type information and styling
  const getPaymentTypeInfo = () => {
    // Check if BPJS is active for this screening
    const isBPJSActive = record.screening?.isBPJSActive;

    if (isBPJSActive === true) {
      return {
        label: "BPJS",
        bgColor: "bg-green-100",
        textColor: "text-green-700",
        Icon: Shield,
      };
    } else if (isBPJSActive === false) {
      return {
        label: "Umum",
        bgColor: "bg-amber-100",
        textColor: "text-amber-700",
        Icon: CreditCard,
      };
    } else {
      // If isBPJSActive is null or undefined
      return {
        label: "Belum Terverifikasi",
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
        Icon: CreditCard,
      };
    }
  };

  const visitTypeStyles = getVisitTypeStyles(record.visitType);
  const VisitTypeIcon = visitTypeStyles.Icon;

  const paymentInfo = getPaymentTypeInfo();
  const PaymentIcon = paymentInfo.Icon;

  return (
    <Link href={`/rekam-medis/${record.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <div className="flex flex-col md:flex-row md:items-center">
              <span className="font-medium text-gray-800">
                No. RM: {record.patient.no_rm}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end text-xs text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(record.visitDate)}</span>
            </div>
            <div className="flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatTime(record.visitDate)}</span>
            </div>
          </div>
        </div>

        <div className="p-3 md:p-4">
          <div className="flex flex-wrap items-center justify-between mb-3">
            <div className="flex items-center">
              <User className="h-4 w-4 text-gray-500 mr-2" />
              <h3 className="font-medium text-gray-900">
                {capitalizeEachWord(record.patient.name)}
                <span className="text-sm text-gray-500 ml-2">
                  {record.patient.gender}
                  {record.patient.birthDate &&
                    `, ${calculateAge(record.patient.birthDate)}`}
                </span>
              </h3>
            </div>

            <div className="flex items-center gap-2 mt-1 md:mt-0">
              {/* Payment Type Badge */}
              <div
                className={`flex items-center gap-1 px-2 py-1 ${paymentInfo.bgColor} ${paymentInfo.textColor} rounded-full text-xs`}
              >
                <PaymentIcon className="h-3 w-3" />
                <span>{paymentInfo.label}</span>
              </div>

              {/* Visit Type Badge */}
              <div
                className={`flex items-center gap-1 px-2 py-1 ${visitTypeStyles.bgColor} ${visitTypeStyles.textColor} rounded-full text-xs`}
              >
                <VisitTypeIcon className="h-3 w-3" />
                <span>{getVisitTypeLabel(record.visitType)}</span>
              </div>
            </div>
          </div>

          {record.icdCode && (
            <div className="mb-2 flex items-center">
              <Stethoscope className="h-4 w-4 text-gray-500 mr-2" />
              <div>
                <span className="text-xs font-medium text-gray-500 mr-1">
                  Diagnosis:
                </span>
                <span className="text-sm">
                  {truncateText(record.diagnosis, 60)}
                </span>
                <span className="ml-1 bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs font-mono">
                  {record.icdCode}
                </span>
              </div>
            </div>
          )}

          {record.screening?.complaints && (
            <div className="text-sm text-gray-600">
              <span className="text-xs font-medium text-gray-500 mr-1">
                Keluhan:
              </span>
              {truncateText(record.screening.complaints, 80)}
            </div>
          )}
        </div>

        <div className="px-3 py-2 md:px-4 md:py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
          <div className="flex items-center text-blue-600 text-sm font-medium">
            <span>Lihat Detail</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};

// DateSection Component
const DateSection = ({ title, records }) => {
  if (!records || records.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 px-1">{title}</h2>
      <div className="grid grid-cols-1 gap-4">
        {records.map((record) => (
          <MedicalRecordCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
};

// Main Page Component
export default function MedicalRecordsHistory() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [organizedRecords, setOrganizedRecords] = useState({
    today: [],
    yesterday: [],
    older: {}, // Changed to object to store records by date
  });
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 15,
    total: 0,
    hasMore: false,
  });

  // Format date for section title
  const formatSectionDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // Group older records by date
  const groupRecordsByDate = (records) => {
    const grouped = {};

    if (!records || records.length === 0) return grouped;

    records.forEach((record) => {
      const date = new Date(record.visitDate);
      // Remove time part to group by date only
      const dateKey = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ).toISOString();

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(record);
    });

    return grouped;
  };

  // Fetch medical records
  const fetchMedicalRecords = async (offset = 0, append = false) => {
    try {
      // Set the appropriate loading state based on whether we're appending or replacing
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const params = new URLSearchParams({
        limit: pagination.limit,
        offset: offset,
        search: searchTerm,
      });

      const response = await fetch(`/api/medical-records/history?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Group older records by date
        const groupedOlder = groupRecordsByDate(result.organized.older);

        if (append) {
          // Append new records to existing ones
          const newGroupedOlder = groupRecordsByDate(result.organized.older);

          // Merge the new older records with existing ones
          const mergedOlder = { ...organizedRecords.older };

          // Add new records to existing date groups or create new date groups
          Object.keys(newGroupedOlder).forEach((dateKey) => {
            if (mergedOlder[dateKey]) {
              mergedOlder[dateKey] = [
                ...mergedOlder[dateKey],
                ...newGroupedOlder[dateKey],
              ];
            } else {
              mergedOlder[dateKey] = newGroupedOlder[dateKey];
            }
          });

          setOrganizedRecords({
            today: [...organizedRecords.today, ...result.organized.today],
            yesterday: [
              ...organizedRecords.yesterday,
              ...result.organized.yesterday,
            ],
            older: mergedOlder,
          });
        } else {
          // Replace with new records
          setOrganizedRecords({
            today: result.organized.today,
            yesterday: result.organized.yesterday,
            older: groupedOlder,
          });
        }

        setPagination(result.pagination);
      } else {
        setError(result.message || "Failed to fetch medical records");
        toast.error(result.message || "Failed to fetch medical records");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data");
      toast.error("An error occurred while fetching data");
    } finally {
      // Reset the appropriate loading state
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMedicalRecords(0, false);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchMedicalRecords(0, false);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (pagination.hasMore && !loadingMore) {
      fetchMedicalRecords(pagination.offset + pagination.limit, true);
    }
  };

  // Calculate total records displayed
  const getTotalDisplayed = () => {
    let olderCount = 0;
    Object.values(organizedRecords.older).forEach((records) => {
      olderCount += records.length;
    });

    return (
      organizedRecords.today.length +
      organizedRecords.yesterday.length +
      olderCount
    );
  };

  // Sort dates in descending order (newest first)
  const getSortedDates = () => {
    return Object.keys(organizedRecords.older).sort(
      (a, b) => new Date(b) - new Date(a)
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Riwayat Kunjungan dan Rekam Medis
        </h1>
        <p className="text-gray-600">Riwayat rekam medis pasien</p>
      </div>

      {/* Search form could be added here */}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
            <p className="mt-4 text-gray-600">Memuat rekam medis...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Error</h3>
              <p className="mt-1 text-red-700">{error}</p>
              <button
                onClick={() => fetchMedicalRecords(0, false)}
                className="mt-3 px-4 py-2 bg-white text-red-700 border border-red-300 rounded-md hover:bg-red-50 transition-colors flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                <span>Coba Lagi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content - Medical Records */}
      {!loading && !error && (
        <div>
          {/* No records found */}
          {getTotalDisplayed() === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Tidak ada rekam medis
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "Tidak ada hasil yang cocok dengan pencarian Anda."
                  : "Belum ada data rekam medis yang tersedia."}
              </p>
            </div>
          )}

          {/* Records by date sections */}
          <DateSection title="Hari Ini" records={organizedRecords.today} />
          <DateSection title="Kemarin" records={organizedRecords.yesterday} />

          {/* Older records grouped by date */}
          {getSortedDates().map((dateKey) => (
            <DateSection
              key={dateKey}
              title={formatSectionDate(dateKey)}
              records={organizedRecords.older[dateKey]}
            />
          ))}

          {/* Load More Button */}
          {pagination.hasMore && (
            <div className="flex justify-center mt-6 mb-4">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 text-gray-700 font-medium flex items-center disabled:opacity-50"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Memuat...</span>
                  </>
                ) : (
                  <span>Muat Lebih Banyak</span>
                )}
              </button>
            </div>
          )}

          {/* Records count */}
          <div className="text-sm text-gray-500 text-center mt-4">
            Menampilkan {getTotalDisplayed()} dari {pagination.total} rekam
            medis
          </div>
        </div>
      )}
    </div>
  );
}
