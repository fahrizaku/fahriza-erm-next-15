// _components/QueueCards.js
import React from "react";
import {
  Clock,
  User,
  PhoneCall,
  Stethoscope,
  CheckCircle,
  CreditCard,
  MapPin,
} from "lucide-react";

export default function QueueCards({
  queueData,
  onCallPatient,
  onExaminePatient,
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "waiting":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Menunggu
          </span>
        );
      case "called":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <PhoneCall className="w-3 h-3 mr-1" />
            Dipanggil
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <Stethoscope className="w-3 h-3 mr-1" />
            Sedang Diperiksa
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Selesai
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

  const getActionButton = (item) => {
    switch (item.status) {
      case "waiting":
        return (
          <button
            onClick={() => onCallPatient(item.screeningId)}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PhoneCall className="w-3 h-3 mr-1" />
            Panggil
          </button>
        );
      case "called":
        return (
          // <button
          //   onClick={() => onExaminePatient(item.screeningId)}
          //   className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          // >
          //   <Stethoscope className="w-3 h-3 mr-1" />
          //   Periksa
          // </button>
          <></>
        );
      case "in-progress":
        return (
          // <button
          //   onClick={() => onExaminePatient(item.screeningId)}
          //   className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          // >
          //   <Stethoscope className="w-3 h-3 mr-1" />
          //   Lanjutkan
          // </button>
          <></>
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {queueData.map((item) => (
        <div
          key={item.screeningId}
          className="bg-white border border-gray-200 rounded-lg shadow-sm"
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

              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                <p className="line-clamp-2">{item.address || "N/A"}</p>
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

            <div className="mt-3 pt-2 border-t border-gray-200 flex justify-end">
              {getActionButton(item)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
