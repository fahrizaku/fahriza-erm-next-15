import React, { useState } from "react";
import { FileText, Shield, User, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";

// Helper function to capitalize each word
const capitalizeEachWord = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const PatientHeader = ({ patient, editUrl, onDeleteClick }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = () => {
    setIsLoading(true);
    // Loading state will be visible until navigation completes
  };

  return (
    <div className="p-5 md:p-8 border-b border-gray-200">
      <div className="space-y-4 md:space-y-0 md:flex md:items-start md:justify-between">
        {/* Patient info */}
        <div className="flex-1">
          {/* Name */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mr-2">
              {capitalizeEachWord(patient.name)}
            </h1>
          </div>

          {/* Medical record number with BPJS badge */}
          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-600 mr-2">No. RM:</span>
              <span className="font-mono px-3 py-1 rounded text-black font-bold">
                {patient.no_rm}
              </span>
            </div>

            {/* Status badge */}
            {patient.isBPJS ? (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-sm font-medium shadow-sm">
                <Shield className="h-4 w-4" />
                <span>BPJS</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                <User className="h-4 w-4" />
                <span>Umum</span>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href={editUrl} prefetch={true} legacyBehavior>
            <a
              onClick={handleEditClick}
              className={`px-4 py-2 ${
                isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white rounded-lg transition-colors flex items-center shadow-sm justify-center`}
              title="Edit Data Pasien"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Edit className="h-4 w-4 mr-2" />
              )}
              <span>{isLoading ? "Memuat..." : "Edit Data"}</span>
            </a>
          </Link>

          {/* Delete button */}
          <button
            onClick={onDeleteClick}
            disabled={isLoading}
            className={`px-4 py-2 ${
              isLoading ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
            } text-white rounded-lg transition-colors flex items-center shadow-sm justify-center`}
            title="Hapus Pasien"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span>Hapus</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;