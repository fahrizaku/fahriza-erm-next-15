export default function PrescriptionItem({ prescription, index }) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg ${
        index > 0 ? "mt-4" : ""
      }`}
    >
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">
            Resep {index + 1}{" "}
            {prescription.prescriptionType
              ? `(${prescription.prescriptionType})`
              : ""}
          </h3>
          {prescription.prescriptionType === "Racikan" && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Racikan
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Racikan dosage */}
        {prescription.prescriptionType === "Racikan" && prescription.dosage && (
          <div className="mb-3 pb-2 border-b border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Aturan Pakai:</p>
            <p className="font-medium">{prescription.dosage}</p>
          </div>
        )}

        {/* Table for desktop/tablet */}
        <div className="hidden sm:block overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nama Obat
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Dosis
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Jumlah
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prescription.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-2 text-sm font-medium text-gray-900">
                      {item.manualDrugName}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-500">
                      {prescription.prescriptionType === "Racikan"
                        ? "-"
                        : item.dosage || "-"}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-500 text-right">
                      {item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card view for mobile */}
        <div className="block sm:hidden mt-2">
          {prescription.items.map((item) => (
            <div
              key={item.id}
              className="border-b border-gray-200 py-3 last:border-b-0"
            >
              <div className="flex justify-between">
                <div className="font-medium text-gray-900">
                  {item.manualDrugName}
                </div>
                <div className="text-gray-500">{item.quantity}</div>
              </div>
              {prescription.prescriptionType !== "Racikan" && item.dosage && (
                <div className="text-sm text-gray-500 mt-1">
                  Dosis: {item.dosage}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Notes */}
        {prescription.notes && (
          <div className="mt-3 pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Catatan:</p>
            <p className="text-sm italic">{prescription.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
