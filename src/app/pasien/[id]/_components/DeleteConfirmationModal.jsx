import React from "react";
import { AlertTriangle, X, Loader2, Trash2 } from "lucide-react";

// Helper function to capitalize each word
const capitalizeEachWord = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const DeleteConfirmationModal = ({ patientName, isDeleting, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={isDeleting}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-5">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Konfirmasi Hapus Pasien
          </h3>
          <p className="text-gray-500">
            Apakah Anda yakin ingin menghapus data pasien{" "}
            <span className="font-semibold">
              {capitalizeEachWord(patientName)}
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Batal
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                <span>Hapus</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;