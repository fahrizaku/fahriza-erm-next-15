"use client";

import { useRouter } from "next/navigation";

export default function VisitCard({ record }) {
  const router = useRouter();
  const { id, patient, screening, visitDate, diagnosis, icdCode, doctorName } =
    record;

  // Menghitung usia pasien
  const getAge = (birthDate) => {
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

    return `${age} tahun`;
  };

  // Format tanggal
  const formatDatetime = (datetime) => {
    if (!datetime) return "-";
    const d = new Date(datetime);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle klik detail
  const handleViewDetail = () => {
    router.push(`/rekam-medis/${id}`);
  };

  // Handle klik cetak
  const handlePrint = () => {
    // Buka window cetak
    window.open(`/api/print/rekam-medis/${id}`, "_blank");
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="bg-blue-600 px-4 py-2 text-white">
        <h3 className="font-semibold truncate">{patient.name}</h3>
        <div className="flex justify-between text-sm">
          <span>No. RM: {patient.no_rm}</span>
          {patient.isBPJS && (
            <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs">
              BPJS
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <p className="text-gray-500">Tanggal Kunjungan</p>
            <p className="font-medium">{formatDatetime(visitDate)}</p>
          </div>
          <div>
            <p className="text-gray-500">Dokter</p>
            <p className="font-medium truncate">
              {doctorName || "Tidak tercatat"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <p className="text-gray-500">Jenis Kelamin</p>
            <p className="font-medium">{patient.gender || "Tidak tercatat"}</p>
          </div>
          <div>
            <p className="text-gray-500">Usia</p>
            <p className="font-medium">{getAge(patient.birthDate)}</p>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-gray-500">Keluhan</p>
          <p className="font-medium line-clamp-2">
            {screening?.complaints || "Tidak tercatat"}
          </p>
        </div>

        <div className="mb-3">
          <p className="text-gray-500">Diagnosis</p>
          <p className="font-medium line-clamp-2">
            {diagnosis
              ? `${diagnosis} ${icdCode ? `(${icdCode})` : ""}`
              : "Tidak tercatat"}
          </p>
        </div>

        <div className="mt-4 border-t pt-3 flex justify-between">
          <button
            className="text-blue-600 hover:text-blue-800 text-sm"
            onClick={handleViewDetail}
          >
            Lihat Detail
          </button>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
            onClick={handlePrint}
          >
            Cetak Rekam Medis
          </button>
        </div>
      </div>
    </div>
  );
}
