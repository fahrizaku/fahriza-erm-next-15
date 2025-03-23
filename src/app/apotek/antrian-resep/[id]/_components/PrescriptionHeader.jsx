import { Clock, CreditCard } from "lucide-react";

export default function PrescriptionHeader({ prescription }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "preparing":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <Clock className="w-4 h-4 mr-1" />
            Sedang Disiapkan
          </div>
        );
      case "ready":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            <Clock className="w-4 h-4 mr-1" />
            Siap Diambil
          </div>
        );
      case "dispensed":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <Clock className="w-4 h-4 mr-1" />
            Telah Diserahkan
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1" />
            Menunggu
          </div>
        );
    }
  };

  const getPaymentTypeBadge = (isBPJSActive) => {
    return isBPJSActive ? (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <CreditCard className="w-4 h-4 mr-1" />
        BPJS
      </div>
    ) : (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
        <CreditCard className="w-4 h-4 mr-1" />
        Umum
      </div>
    );
  };

  return (
    <div className="px-4 sm:px-6 py-5 border-b border-gray-200 bg-gray-50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Detail Resep</h1>
          <p className="mt-1 text-sm text-gray-600">
            Informasi resep dan obat pasien
          </p>
        </div>

        {/* Status badges - Stacked on mobile */}
        <div className="mt-3 md:mt-0 flex flex-wrap gap-2">
          {getStatusBadge(prescription.status)}
          {getPaymentTypeBadge(prescription.isBPJSActive)}
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            Nomor Antrian: {prescription.queueNumber}
          </div>
        </div>
      </div>
    </div>
  );
}
