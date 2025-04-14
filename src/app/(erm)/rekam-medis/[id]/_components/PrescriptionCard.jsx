// app/rekam-medis/[id]/components/PrescriptionCard.jsx
import React from "react";
import { Beaker, Clipboard } from "lucide-react";

export default function PrescriptionCard({ prescription, index }) {
  // Function to determine if a prescription is a compound prescription (racikan)
  const isCompoundPrescription = (prescription) => {
    return prescription.prescriptionType === "Racikan";
  };

  // Function to get translated prescription type
  const getPrescriptionTypeLabel = (type) => {
    switch (type) {
      case "Main":
        return "Utama";
      case "Alternative":
        return "Alternatif";
      case "Follow-up":
        return "Lanjutan";
      case "Racikan":
        return "Racikan";
      default:
        return type;
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 print:bg-white">
      <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
        <div className="flex items-center">
          {isCompoundPrescription(prescription) ? (
            <Beaker className="h-4 w-4 text-blue-600 mr-2 print:text-gray-700" />
          ) : (
            <Clipboard className="h-4 w-4 text-blue-600 mr-2 print:text-gray-700" />
          )}
          <h4 className="font-medium text-gray-800">
            Resep {index + 1}
            {prescription.prescriptionType && (
              <span className="ml-2 text-sm text-gray-500">
                ({getPrescriptionTypeLabel(prescription.prescriptionType)})
              </span>
            )}
          </h4>
        </div>
      </div>

      {/* For compound prescriptions (Racikan), show the shared dosage */}
      {isCompoundPrescription(prescription) && prescription.dosage && (
        <div className="mb-3 p-2 bg-blue-50 border border-blue-100 rounded">
          <h5 className="text-xs font-medium text-blue-800 mb-1">
            Dosis Racikan:
          </h5>
          <p className="text-sm text-blue-900">{prescription.dosage}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Obat
              </th>
              {!isCompoundPrescription(prescription) && (
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dosis
                </th>
              )}
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {prescription.items.map((item, index) => (
              <tr key={item.id}>
                <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-800">
                  {item.manualDrugName}
                </td>
                {!isCompoundPrescription(prescription) && (
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                    {item.dosage}
                  </td>
                )}
                <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                  {item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {prescription.notes && (
        <div className="mt-3 text-sm">
          <h5 className="font-medium text-gray-600">Catatan:</h5>
          <p className="text-gray-800">{prescription.notes}</p>
        </div>
      )}
    </div>
  );
}
