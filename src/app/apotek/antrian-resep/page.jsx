"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";
import QueueHeader from "./_components/QueueHeader";
import QueueFilters from "./_components/QueueFilters";
import PharmacyQueueCards from "./_components/PharmacyQueueCards";
import { LoadingState, EmptyState, ErrorState } from "./_components/UIState";

export default function PharmacyQueuePage() {
  const router = useRouter();

  const [queueList, setQueueList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // waiting, preparing, ready, dispensed
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch queue data
  const fetchQueueData = async () => {
    try {
      const isRefreshing = refreshing;
      if (!isRefreshing) setLoading(true);

      const response = await fetch(`/api/pharmacy/queue?status=${filter}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setQueueList(data.queue);
      } else {
        setError(data.message || "Failed to fetch queue data");
        toast.error(data.message || "Failed to fetch queue data");
      }
    } catch (error) {
      console.error("Error fetching queue:", error);
      setError("An error occurred while fetching queue data");
      if (!refreshing) {
        toast.error("An error occurred while fetching queue data");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQueueData();

    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(() => {
      setRefreshing(true);
      fetchQueueData();
    }, 30000);

    return () => clearInterval(interval);
  }, [filter]);

  // Handle manual refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchQueueData();
  };

  // Handle preparing a prescription
  const handlePrepareRx = async (medicalRecordId) => {
    try {
      const response = await fetch(
        `/api/pharmacy/queue/${medicalRecordId}/prepare`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pharmacistName: "Apoteker", // You might want to get this from a form or context
          }),
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
            item.medicalRecordId === medicalRecordId
              ? { ...item, status: "preparing", pharmacistName: "Apoteker" }
              : item
          )
        );

        toast.success(`Resep pasien ${data.patientName} sedang disiapkan`);
      } else {
        toast.error(data.message || "Failed to prepare prescription");
      }
    } catch (error) {
      console.error("Error preparing prescription:", error);
      toast.error("An error occurred while preparing prescription");
    }
  };

  // Handle marking a prescription as ready
  const handleReadyRx = async (medicalRecordId) => {
    try {
      const response = await fetch(
        `/api/pharmacy/queue/${medicalRecordId}/ready`,
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
            item.medicalRecordId === medicalRecordId
              ? { ...item, status: "ready" }
              : item
          )
        );

        toast.success(`Resep pasien ${data.patientName} siap diambil`);
      } else {
        toast.error(data.message || "Failed to mark prescription as ready");
      }
    } catch (error) {
      console.error("Error marking prescription as ready:", error);
      toast.error("An error occurred while marking prescription as ready");
    }
  };

  // Handle dispensing a prescription
  const handleDispenseRx = async (medicalRecordId) => {
    try {
      const response = await fetch(
        `/api/pharmacy/queue/${medicalRecordId}/dispense`,
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
            item.medicalRecordId === medicalRecordId
              ? { ...item, status: "dispensed" }
              : item
          )
        );

        toast.success(`Resep pasien ${data.patientName} telah diserahkan`);
      } else {
        toast.error(data.message || "Failed to dispense prescription");
      }
    } catch (error) {
      console.error("Error dispensing prescription:", error);
      toast.error("An error occurred while dispensing prescription");
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
    const statusOrder = ["preparing", "ready", "waiting", "dispensed"];

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
      case "preparing":
        return "Sedang Disiapkan";
      case "ready":
        return "Siap Diambil";
      case "dispensed":
        return "Telah Diserahkan";
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
          href="/rawat-jalan"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Kembali ke Rawat Jalan</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {/* Header */}
        <QueueHeader
          title="Antrian Farmasi"
          subtitle="Kelola antrian resep pasien setelah pemeriksaan dokter"
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />

        {/* Filters and search */}
        <QueueFilters
          filter={filter}
          setFilter={setFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusOptions={[
            { value: "all", label: "Semua" },
            { value: "waiting", label: "Menunggu" },
            { value: "preparing", label: "Sedang Disiapkan" },
            { value: "ready", label: "Siap Diambil" },
            { value: "dispensed", label: "Telah Diserahkan" },
          ]}
        />

        {/* Queue list */}
        <div className="p-4">
          {loading ? (
            <LoadingState message="Memuat data antrian farmasi..." />
          ) : error ? (
            <ErrorState error={error} />
          ) : filteredQueue.length === 0 ? (
            <EmptyState
              message={`Tidak ada resep dalam antrian ${
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
                  <PharmacyQueueCards
                    queueData={group.items}
                    onPrepareRx={handlePrepareRx}
                    onReadyRx={handleReadyRx}
                    onDispenseRx={handleDispenseRx}
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
