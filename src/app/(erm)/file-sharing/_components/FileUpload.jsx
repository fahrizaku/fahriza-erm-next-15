"use client";

import { useState } from "react";

export default function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadError("");
      setUploadSuccess(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setUploadError("Silakan pilih file terlebih dahulu");
      return;
    }

    setUploadLoading(true);
    setUploadError("");
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/file-sharing/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengunggah file");
      }

      // Reset form and refresh file list
      setFile(null);
      e.target.reset();
      setUploadSuccess(true);
      onUploadSuccess();

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Terjadi kesalahan saat mengunggah file");
    } finally {
      setUploadLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
      <div className="p-5">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadLoading}
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <span className="truncate">
                    {file ? file.name : "Pilih file untuk diunggah..."}
                  </span>
                  <span className="text-xs font-medium text-blue-500 bg-blue-50 px-2 py-1 rounded">
                    Browse
                  </span>
                </label>
              </div>

              {file && (
                <div className="mt-2 text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={uploadLoading}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-colors min-w-24 ${
                uploadLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {uploadLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Uploading
                </span>
              ) : (
                "Upload"
              )}
            </button>
          </div>

          {uploadError && (
            <div className="mt-3 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-md">
              {uploadError}
            </div>
          )}

          {uploadSuccess && (
            <div className="mt-3 px-3 py-2 text-sm text-green-600 bg-green-50 rounded-md">
              File berhasil diunggah
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
