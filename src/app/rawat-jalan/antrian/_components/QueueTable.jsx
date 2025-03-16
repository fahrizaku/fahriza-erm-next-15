import React from "react";
import { User, Clock, Mic, CheckCircle, FileText } from "lucide-react";

export default function QueueTable({ queueData, onCallPatient, router }) {
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
          {queueData.map((queue) => (
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
                  {new Date(queue.createdAt).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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
                    onClick={() => onCallPatient(queue.screeningId)}
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
  );
}
