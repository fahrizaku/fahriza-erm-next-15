// app/rekam-medis/[id]/components/DoctorSignature.jsx
import React from "react";

export default function DoctorSignature({ doctorName }) {
  if (!doctorName) return null;

  return (
    <div className="mt-8 text-right print:mt-20">
      <p className="text-gray-600 mb-10">
        Dokter Pemeriksa,
        <br />
        <br />
        <br />
        <br />
        <span className="font-medium text-gray-800">{doctorName}</span>
      </p>
    </div>
  );
}
