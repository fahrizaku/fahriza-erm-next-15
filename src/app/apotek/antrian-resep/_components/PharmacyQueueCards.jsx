import React from "react";
import {
  Clock,
  User,
  Pill,
  CheckCircle,
  Package,
  CreditCard,
  FileText,
  Beaker,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PharmacyQueueCards({
  queueData,
  onPrepareRx,
  onReadyRx,
  onDispenseRx,
}) {
  const router = useRouter();

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

  const getActionButton = (item, e) => {
    // Prevent click event from bubbling up to the card when clicking action buttons
    const handleClick = (callback, id) => (e) => {
      e.stopPropagation();
      callback(id);
    };

    switch (item.status) {
      case "waiting":
        return (
          <button
            onClick={handleClick(onPrepareRx, item.medicalRecordId)}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Beaker className="w-3 h-3 mr-1" />
            Siapkan
          </button>
        );
      case "preparing":
        return (
          <button
            onClick={handleClick(onReadyRx, item.medicalRecordId)}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Package className="w-3 h-3 mr-1" />
            Tandai Siap
          </button>
        );
      case "ready":
        return (
          <button
            onClick={handleClick(onDispenseRx, item.medicalRecordId)}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Serahkan
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

  // Handle card click to view prescription details
  const handleCardClick = (medicalRecordId) => {
    router.push(`/apotek/antrian-resep/${medicalRecordId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {queueData.map((item) => (
        <div
          key={item.medicalRecordId}
          className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleCardClick(item.medicalRecordId)}
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
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2" />
                <p>
                  {item.gender || "N/A"} · {calculateAge(item.birthDate)} tahun
                </p>
              </div>

              <div className="flex items-center">
                <FileText className="h-4 w-4 text-gray-500 mr-2" />
                <p className="line-clamp-2">
                  Diagnosis: {item.diagnosis || "N/A"}
                </p>
              </div>

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
                    <span className="ml-1 font-medium text-gray-900">Umum</span>
                  )}
                </div>
              </div>
            </div>

            {item.pharmacistName && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  Apoteker: {item.pharmacistName}
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
  );
}
