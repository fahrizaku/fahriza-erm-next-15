import React from "react";
import { AlertTriangle } from "lucide-react";

export default function PatientAllergies({ allergies }) {
  if (!allergies || allergies.length === 0) {
    return (
      <div className="px-6 py-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Informasi Alergi
        </h3>
        <p className="text-gray-600">Tidak ada riwayat alergi tercatat.</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 border-t border-gray-200">
      <div className="flex items-center mb-3">
        <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">
          Informasi Alergi
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama Alergi
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jenis
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tingkat Keparahan
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Reaksi
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allergies.map((allergy) => (
              <tr key={allergy.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {allergy.allergyName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {allergy.allergyType || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {allergy.severity || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {allergy.reaction || "-"}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      allergy.status === "aktif"
                        ? "bg-red-100 text-red-800"
                        : allergy.status === "sembuh"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {allergy.status || "Tidak Diketahui"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
