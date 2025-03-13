import React from "react";
import { PenTool } from "lucide-react";

const DoctorSignature = ({ doctorName, onChange }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <div className="flex items-center">
          <PenTool className="h-4 w-4 mr-2 text-gray-500" />
          <span>Nama Dokter</span>
        </div>
      </label>
      <input
        type="text"
        name="doctorName"
        value={doctorName}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Nama dokter yang memeriksa"
        required
      />
    </div>
  );
};

export default DoctorSignature;
