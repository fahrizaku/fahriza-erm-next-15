import React from "react";

export default function ComplaintsSection({ screening, handleInputChange }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Keluhan Pasien <span className="text-red-500">*</span>
      </label>
      <textarea
        name="complaints"
        value={screening.complaints}
        onChange={handleInputChange}
        rows="3"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Keluhan utama pasien"
        required
      />
    </div>
  );
}
