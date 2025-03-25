import React from "react";
import { Pill, Beaker, Clipboard } from "lucide-react";
import PrescriptionCard from "./PrescriptionCard";

export default function PrescriptionsSection({ prescriptions }) {
  if (!prescriptions || prescriptions.length === 0) return null;

  return (
    <div>
      <div className="flex items-center mb-4">
        <Pill className="h-5 w-5 text-blue-600 mr-2 print:text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-800">Resep Obat</h3>
      </div>

      <div className="space-y-4">
        {prescriptions.map((prescription, idx) => (
          <PrescriptionCard
            key={prescription.id}
            prescription={prescription}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
}
