"use client";

import { useState } from "react";

export default function BulkActions({ files, onMessage }) {
  const [bulkLoading, setBulkLoading] = useState(false);

  const handleDownloadAll = async () => {
    if (!files.length) {
      onMessage({ type: "warning", text: "Tidak ada file untuk diunduh" });
      return;
    }

    setBulkLoading(true);
    onMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/file-sharing/files/bulk-download", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Gagal mengunduh semua file");
      }

      // Create blob from response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create download link
      const a = document.createElement("a");
      a.href = url;
      a.download = `all-files-${new Date().toISOString().split("T")[0]}.zip`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      onMessage({ type: "success", text: "Semua file berhasil diunduh" });
    } catch (error) {
      console.error("Error downloading all files:", error);
      onMessage({ type: "error", text: "Gagal mengunduh semua file" });
    } finally {
      setBulkLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!files.length) {
      onMessage({ type: "warning", text: "Tidak ada file untuk dihapus" });
      return;
    }

    if (
      confirm(
        `Yakin ingin menghapus semua ${files.length} file? Tindakan ini tidak dapat dibatalkan.`
      )
    ) {
      setBulkLoading(true);
      onMessage({ type: "", text: "" });

      try {
        const response = await fetch("/api/file-sharing/files/bulk-delete", {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Gagal menghapus semua file");
        }

        onMessage({ type: "success", text: "Semua file berhasil dihapus" });
      } catch (error) {
        console.error("Error deleting all files:", error);
        onMessage({ type: "error", text: "Gagal menghapus semua file" });
      } finally {
        setBulkLoading(false);
      }
    }
  };

  if (files.length === 0) return null;

  return (
    <div className="flex gap-2">
      <button
        onClick={handleDownloadAll}
        disabled={bulkLoading}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          bulkLoading
            ? "bg-gray-100 text-gray-400"
            : "bg-green-50 text-green-600 hover:bg-green-100"
        }`}
      >
        {bulkLoading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-1 h-3 w-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          "Download Semua"
        )}
      </button>

      <button
        onClick={handleDeleteAll}
        disabled={bulkLoading}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          bulkLoading
            ? "bg-gray-100 text-gray-400"
            : "bg-red-50 text-red-600 hover:bg-red-100"
        }`}
      >
        Hapus Semua
      </button>
    </div>
  );
}
