"use client";

import React, { useState } from "react";
import {
  ClipboardList,
  Pill,
  Clock,
  User,
  Search,
  CheckCircle,
  AlertCircle,
  Truck,
} from "lucide-react";

const PharmacyPage = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const initialPrescriptions = [
    {
      id: "RX20240301-001",
      patient: {
        name: "Ahmad Santoso",
        id: "P2024001",
        age: 45,
        gender: "Laki-laki",
      },
      medications: [
        {
          name: "Amoxicillin 500mg",
          dosage: "1 kaplet",
          frequency: "3x sehari",
          duration: "7 hari",
        },
        {
          name: "Paracetamol 500mg",
          dosage: "1 kaplet",
          frequency: "3x sehari",
          duration: "3 hari",
        },
      ],
      status: "waiting",
      prescribedDate: "2024-03-01 10:00",
      processedDate: null,
      completedDate: null,
    },
    {
      id: "RX20240301-002",
      patient: {
        name: "Dewi Lestari",
        id: "P2024002",
        age: 32,
        gender: "Perempuan",
      },
      medications: [
        {
          name: "Omeprazole 20mg",
          dosage: "1 kaplet",
          frequency: "1x sehari",
          duration: "30 hari",
        },
      ],
      status: "processing",
      prescribedDate: "2024-03-01 09:30",
      processedDate: "2024-03-01 10:15",
      completedDate: null,
    },
  ];

  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);

  const statusColors = {
    waiting: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    ready: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
  };

  const handleStatusChange = (id, newStatus) => {
    setPrescriptions((prev) =>
      prev.map((pres) =>
        pres.id === id
          ? {
              ...pres,
              status: newStatus,
              processedDate:
                newStatus === "processing"
                  ? new Date().toISOString()
                  : pres.processedDate,
              completedDate:
                newStatus === "completed"
                  ? new Date().toISOString()
                  : pres.completedDate,
            }
          : pres
      )
    );
  };

  const filteredPrescriptions = prescriptions.filter((pres) => {
    const statusMatch =
      selectedStatus === "all" || pres.status === selectedStatus;
    const searchMatch =
      pres.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pres.patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pres.id.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Pill className="w-6 h-6 text-green-600" />
              Manajemen Resep
            </h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari resep/nama pasien..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="waiting">Menunggu</option>
              <option value="processing">Diproses</option>
              <option value="ready">Siap Diambil</option>
              <option value="completed">Selesai</option>
            </select>
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredPrescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Patient Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusColors[prescription.status]
                      }`}
                    >
                      {prescription.status === "waiting" && "Menunggu"}
                      {prescription.status === "processing" && "Diproses"}
                      {prescription.status === "ready" && "Siap Diambil"}
                      {prescription.status === "completed" && "Selesai"}
                    </div>
                    <span className="font-mono text-sm text-gray-500">
                      {prescription.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {prescription.patient.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {prescription.patient.gender},{" "}
                        {prescription.patient.age} tahun
                      </p>
                    </div>
                  </div>

                  {/* Medications */}
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Daftar Obat:
                    </h4>
                    <div className="space-y-2">
                      {prescription.medications.map((med, idx) => (
                        <div
                          key={idx}
                          className="flex items-baseline gap-2 text-sm"
                        >
                          <span className="text-gray-500">•</span>
                          <div className="flex-1">
                            <span className="font-medium text-gray-700">
                              {med.name}
                            </span>
                            <span className="text-gray-500 ml-2">
                              {med.dosage} {med.frequency} ({med.duration})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="sm:w-48 space-y-2">
                  {prescription.status === "waiting" && (
                    <button
                      onClick={() =>
                        handleStatusChange(prescription.id, "processing")
                      }
                      className="w-full py-2 px-4 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Proses Resep
                    </button>
                  )}

                  {prescription.status === "processing" && (
                    <button
                      onClick={() =>
                        handleStatusChange(prescription.id, "ready")
                      }
                      className="w-full py-2 px-4 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Tandai Siap
                    </button>
                  )}

                  {prescription.status === "ready" && (
                    <button
                      onClick={() =>
                        handleStatusChange(prescription.id, "completed")
                      }
                      className="w-full py-2 px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
                    >
                      <Truck className="w-4 h-4" />
                      Tandai Diambil
                    </button>
                  )}

                  <div className="text-sm text-gray-500 space-y-1">
                    <p>
                      <Clock className="inline w-4 h-4 mr-1" />
                      Resep:{" "}
                      {new Date(prescription.prescribedDate).toLocaleTimeString(
                        "id-ID"
                      )}
                    </p>
                    {prescription.processedDate && (
                      <p>
                        <Clock className="inline w-4 h-4 mr-1" />
                        Proses:{" "}
                        {new Date(
                          prescription.processedDate
                        ).toLocaleTimeString("id-ID")}
                      </p>
                    )}
                    {prescription.completedDate && (
                      <p>
                        <Clock className="inline w-4 h-4 mr-1" />
                        Selesai:{" "}
                        {new Date(
                          prescription.completedDate
                        ).toLocaleTimeString("id-ID")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPrescriptions.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4 mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <ClipboardList className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              Tidak ada resep ditemukan
            </h3>
            <p className="text-gray-500">
              Silakan sesuaikan filter pencarian atau periksa kembali
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyPage;
