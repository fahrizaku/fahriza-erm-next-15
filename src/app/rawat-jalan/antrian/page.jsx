"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";
import QueueHeader from "./_components/QueueHeader";
import QueueFilters from "./_components/QueueFilters";
import QueueCards from "./_components/QueueCards";
import { LoadingState, EmptyState, ErrorState } from "./_components/UIStates";

export default function OutpatientQueuePage() {
  const router = useRouter();

  const [queueList, setQueueList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // waiting, called, in-progress, completed
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch queue data
  const fetchQueueData = async (isIntervalRefresh = false) => {
    try {
      // Only set loading to true for initial load or manual refresh
      if (!isIntervalRefresh) {
        if (!refreshing) setLoading(true);
      }

      const response = await fetch(`/api/outpatient/queue?status=${filter}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setQueueList(data.queue);
      } else {
        setError(data.message || "Failed to fetch queue data");
        if (!isIntervalRefresh) {
          toast.error(data.message || "Failed to fetch queue data", {
            autoClose: 200,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching queue:", error);
      setError("An error occurred while fetching queue data");
      if (!isIntervalRefresh) {
        toast.error("An error occurred while fetching queue data", {
          autoClose: 200,
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Initial data fetch (with loading indicator)
    fetchQueueData();

    // Set up interval to refresh data every 30 seconds (without loading indicator)
    const interval = setInterval(() => {
      fetchQueueData(true); // Pass true to indicate this is an interval refresh
    }, 3000);

    return () => clearInterval(interval);
  }, [filter]);

  // Handle manual refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchQueueData(false); // Pass false to show loading during manual refresh
  };

  // Handle calling a patient (only changes status to "called")
  const handleCallPatient = async (screeningId) => {
    try {
      const response = await fetch(
        `/api/outpatient/queue/${screeningId}/call`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update the queue list
        setQueueList(
          queueList.map((item) =>
            item.screeningId === screeningId
              ? { ...item, status: "called" }
              : item
          )
        );

        toast.success(`Pasien ${data.patientName} berhasil dipanggil`, {
          autoClose: 200,
        });
      } else {
        toast.error(data.message || "Failed to call patient", {
          autoClose: 200,
        });
      }
    } catch (error) {
      console.error("Error calling patient:", error);
      toast.error("An error occurred while calling patient", {
        autoClose: 200,
      });
    }
  };

  // Handle examining a patient (change status to "in-progress" and redirect)
  const handleExaminePatient = async (screeningId) => {
    try {
      const response = await fetch(
        `/api/outpatient/queue/${screeningId}/examine`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update the queue list
        setQueueList(
          queueList.map((item) =>
            item.screeningId === screeningId
              ? { ...item, status: "in-progress" }
              : item
          )
        );

        toast.success(`Pasien ${data.patientName} sedang diperiksa`, {
          autoClose: 200,
        });

        // Redirect to doctor's examination page
        router.push(`/rawat-jalan/pemeriksaan-dokter/${screeningId}`);
      } else {
        toast.error(data.message || "Failed to examine patient", {
          autoClose: 200,
        });
      }
    } catch (error) {
      console.error("Error examining patient:", error);
      toast.error("An error occurred while examining patient", {
        autoClose: 200,
      });
    }
  };

  // Filter queue items based on search term
  const filteredQueue = queueList.filter(
    (item) =>
      item.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.queueNumber?.toString() || "").includes(searchTerm)
  );

  // Group queue items by status when filter is "all"
  const getGroupedQueue = () => {
    if (filter !== "all") return [{ status: filter, items: filteredQueue }];

    // Define the order of status groups
    const statusOrder = ["in-progress", "called", "waiting", "completed"];

    // Group items by status
    const groupedByStatus = filteredQueue.reduce((groups, item) => {
      const group = groups[item.status] || [];
      group.push(item);
      groups[item.status] = group;
      return groups;
    }, {});

    // Convert to array ordered by our status priority
    return statusOrder
      .filter(
        (status) =>
          groupedByStatus[status] && groupedByStatus[status].length > 0
      )
      .map((status) => ({
        status,
        items: groupedByStatus[status].sort(
          (a, b) => a.queueNumber - b.queueNumber
        ),
      }));
  };

  // Get status text for display
  const getStatusText = (status) => {
    switch (status) {
      case "waiting":
        return "Menunggu";
      case "called":
        return "Dipanggil";
      case "in-progress":
        return "Sedang Diperiksa";
      case "completed":
        return "Selesai";
      default:
        return status;
    }
  };

  const groupedQueue = getGroupedQueue();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/pasien"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Kembali ke Daftar Pasien</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {/* Header */}
        <QueueHeader
          title="Antrian Rawat Jalan"
          subtitle="Kelola antrian pasien yang telah melalui skrining"
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />

        {/* Filters and search */}
        <QueueFilters
          filter={filter}
          setFilter={setFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Queue list */}
        <div className="p-4">
          {loading ? (
            <LoadingState message="Memuat data antrian..." />
          ) : error ? (
            <ErrorState error={error} />
          ) : filteredQueue.length === 0 ? (
            <EmptyState
              message={`Tidak ada pasien dalam antrian ${
                filter !== "all" ? getStatusText(filter).toLowerCase() : ""
              }`}
            />
          ) : (
            <div>
              {groupedQueue.map((group, index) => (
                <div key={group.status} className={index > 0 ? "mt-8" : ""}>
                  {filter === "all" && (
                    <h3 className="text-lg font-medium text-gray-900 mb-3 pb-2 border-b">
                      {getStatusText(group.status)}
                    </h3>
                  )}
                  <QueueCards
                    queueData={group.items}
                    onCallPatient={handleCallPatient}
                    onExaminePatient={handleExaminePatient}
                    router={router}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
