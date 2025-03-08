"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Clock,
  ChevronLeft,
  Mic,
  Loader2,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";

export default function OutpatientQueuePage() {
  const router = useRouter();

  const [queueList, setQueueList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("waiting"); // waiting, in-progress, completed
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch queue data
  const fetchQueueData = async () => {
    try {
      const isRefreshing = refreshing;
      if (!isRefreshing) setLoading(true);

      const response = await fetch(`/api/outpatient/queue?status=${filter}`);

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

  // Handle calling a patient
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

        toast.success(`Pasien ${data.patientName} berhasil dipanggil`);

        // Redirect to doctor's examination page
        router.push(`/rawat-jalan/pemeriksaan-dokter/${screeningId}`);
      } else {
        toast.error(data.message || "Failed to call patient");
      }
    } catch (error) {
      console.error("Error calling patient:", error);
      toast.error("An error occurred while calling patient");
    }
  };

  // Filter queue items based on search term
  const filteredQueue = queueList.filter(
    (item) =>
      item.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.queueNumber?.toString() || "").includes(searchTerm)
  );

  // Get status badge class
  const getStatusBadge = (status) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800";
      case "called":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status text
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
        <div className="p-5 md:p-6 border-b border-gray-200 bg-gray-50 flex flex-wrap justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800 mb-1">
              Antrian Rawat Jalan
            </h1>
            <p className="text-gray-600">
              Kelola antrian pasien yang telah melalui skrining
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="mt-2 sm:mt-0 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors flex items-center"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1.5" />
            )}
            <span>Refresh</span>
          </button>
        </div>

        {/* Filters and search */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-4">
          {/* Status filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter className="h-4 w-4 inline mr-1" />
              Filter Status
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="waiting">Menunggu</option>
              <option value="called">Dipanggil</option>
              <option value="in-progress">Sedang Diperiksa</option>
              <option value="completed">Selesai</option>
              <option value="all">Semua Status</option>
            </select>
          </div>

          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Search className="h-4 w-4 inline mr-1" />
              Cari Pasien
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nama pasien atau nomor antrian"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Queue list */}
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
                <p className="mt-4 text-gray-600">Memuat data antrian...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-red-800">Error</h3>
                  <p className="mt-1 text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : filteredQueue.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Tidak ada pasien dalam antrian{" "}
                {filter !== "all" ? getStatusText(filter).toLowerCase() : ""}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      No. Antrian
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Pasien
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      No. RM
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Waktu Daftar
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredQueue.map((queue) => (
                    <tr key={queue.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-lg font-bold text-blue-600">
                        {queue.queueNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {queue.patientName}
                            </div>
                            {queue.isBPJS && (
                              <div className="text-xs text-green-600">BPJS</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">
                          {queue.noRM}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-700">
                          <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                          {new Date(queue.createdAt).toLocaleTimeString(
                            "id-ID",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                            queue.status
                          )}`}
                        >
                          {getStatusText(queue.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {queue.status === "waiting" && (
                          <button
                            onClick={() => handleCallPatient(queue.screeningId)}
                            className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md inline-flex items-center"
                          >
                            <Mic className="h-4 w-4 mr-1.5" />
                            Panggil
                          </button>
                        )}
                        {queue.status === "called" && (
                          <button
                            onClick={() =>
                              router.push(
                                `/rawat-jalan/pemeriksaan-dokter/${queue.screeningId}`
                              )
                            }
                            className="text-white bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-md inline-flex items-center"
                          >
                            <CheckCircle className="h-4 w-4 mr-1.5" />
                            Periksa
                          </button>
                        )}
                        {(queue.status === "in-progress" ||
                          queue.status === "completed") && (
                          <button
                            onClick={() =>
                              router.push(`/rekam-medis/${queue.screeningId}`)
                            }
                            className="text-gray-700 hover:text-blue-700 px-3 py-1 rounded-md inline-flex items-center"
                          >
                            <FileText className="h-4 w-4 mr-1.5" />
                            Lihat
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
