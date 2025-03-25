import React from "react";
import { Beaker } from "lucide-react";
import { formatDate, formatTime } from "../utils/formatters";

export default function PharmacySection({ pharmacyQueue, screening }) {
  if (!pharmacyQueue) return null;

  // Format pharmacy queue status
  const formatPharmacyStatus = (status) => {
    switch (status) {
      case "waiting":
        return "Menunggu";
      case "preparing":
        return "Sedang Disiapkan";
      case "ready":
        return "Siap Diambil";
      case "dispensed":
        return "Telah Diberikan";
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <Beaker className="h-5 w-5 text-blue-600 mr-2 print:text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-800">
          Informasi Farmasi
        </h3>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 print:bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">
              Nomor Antrian:
            </h4>
            <p className="text-gray-800 font-medium">
              {pharmacyQueue.queueNumber}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Status:</h4>
            <div className="flex items-center">
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium
                  ${
                    pharmacyQueue.status === "waiting"
                      ? "bg-yellow-100 text-yellow-800"
                      : ""
                  }
                  ${
                    pharmacyQueue.status === "preparing"
                      ? "bg-blue-100 text-blue-800"
                      : ""
                  }
                  ${
                    pharmacyQueue.status === "ready"
                      ? "bg-green-100 text-green-800"
                      : ""
                  }
                  ${
                    pharmacyQueue.status === "dispensed"
                      ? "bg-gray-100 text-gray-800"
                      : ""
                  }
                `}
              >
                {formatPharmacyStatus(pharmacyQueue.status)}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">
              Tipe Pembayaran:
            </h4>
            <div className="flex items-center">
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  screening?.isBPJSActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {screening?.isBPJSActive ? "BPJS Aktif" : "Umum"}
              </span>
            </div>
          </div>

          {pharmacyQueue.pharmacistName && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">
                Apoteker:
              </h4>
              <p className="text-gray-800">{pharmacyQueue.pharmacistName}</p>
            </div>
          )}

          {pharmacyQueue.startedAt && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">
                Mulai Diproses:
              </h4>
              <p className="text-gray-800">
                {formatDate(pharmacyQueue.startedAt)}{" "}
                {formatTime(pharmacyQueue.startedAt)}
              </p>
            </div>
          )}

          {pharmacyQueue.completedAt && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">
                Selesai Diproses:
              </h4>
              <p className="text-gray-800">
                {formatDate(pharmacyQueue.completedAt)}{" "}
                {formatTime(pharmacyQueue.completedAt)}
              </p>
            </div>
          )}

          {pharmacyQueue.dispensedAt && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">
                Telah Diberikan:
              </h4>
              <p className="text-gray-800">
                {formatDate(pharmacyQueue.dispensedAt)}{" "}
                {formatTime(pharmacyQueue.dispensedAt)}
              </p>
            </div>
          )}

          {pharmacyQueue.notes && (
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-sm font-medium text-gray-600 mb-1">
                Catatan Farmasi:
              </h4>
              <p className="text-gray-800 whitespace-pre-line">
                {pharmacyQueue.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
