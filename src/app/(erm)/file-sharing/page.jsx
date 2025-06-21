"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FileManagement() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/file-sharing/files");

      if (!response.ok) {
        throw new Error("Gagal mengambil daftar file");
      }

      const data = await response.json();

      // Sort files by createdAt date (newest first)
      const sortedFiles = data.files.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setFiles(sortedFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
      setError("Gagal memuat daftar file");
    } finally {
      setLoading(false);
    }
  };

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
      fetchFiles();
      setUploadSuccess(true);

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

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const handleDeleteFile = async (fileId) => {
    if (confirm("Yakin ingin menghapus file ini?")) {
      try {
        const response = await fetch(`/api/file-sharing/files/${fileId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Gagal menghapus file");
        }

        // Update file list (maintain sorting)
        const updatedFiles = files.filter((f) => f.id !== fileId);
        setFiles(updatedFiles);
      } catch (error) {
        console.error("Error deleting file:", error);
        alert("Gagal menghapus file");
      }
    }
  };

  const handleDeleteAll = async () => {
    if (!files.length) {
      alert("Tidak ada file untuk dihapus");
      return;
    }

    if (confirm(`Yakin ingin menghapus semua ${files.length} file? Tindakan ini tidak dapat dibatalkan.`)) {
      setBulkLoading(true);
      
      try {
        const response = await fetch("/api/file-sharing/files/bulk-delete", {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Gagal menghapus semua file");
        }

        setFiles([]);
        alert("Semua file berhasil dihapus");
      } catch (error) {
        console.error("Error deleting all files:", error);
        alert("Gagal menghapus semua file");
      } finally {
        setBulkLoading(false);
      }
    }
  };

  const handleDownloadAll = async () => {
    if (!files.length) {
      alert("Tidak ada file untuk diunduh");
      return;
    }

    setBulkLoading(true);
    
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
      a.download = `all-files-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error("Error downloading all files:", error);
      alert("Gagal mengunduh semua file");
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-5 space-y-8">
      <h1 className="text-2xl font-medium text-gray-800">File Sharing</h1>

      {/* Upload Section */}
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
                  uploadLoading
                    ? "bg-gray-400"
                    : "bg-blue-500 hover:bg-blue-600"
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

      {/* File List Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">Files</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{files.length} files</span>
            
            {/* Bulk Actions */}
            {files.length > 0 && (
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
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40 rounded-lg bg-white border border-gray-100 shadow-sm">
            <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-blue-500 border-r-transparent"></div>
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg bg-white border border-gray-100 shadow-sm">
            <div className="text-sm text-red-500">{error}</div>
            <button
              onClick={fetchFiles}
              className="mt-2 px-3 py-1 text-xs font-medium text-blue-500 hover:bg-blue-50 rounded"
            >
              Coba Lagi
            </button>
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 rounded-lg bg-white border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">
              Belum ada file yang diunggah
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg bg-white border border-gray-100 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama File
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ukuran
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Tanggal
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, index) => (
                    <tr
                      key={file.id}
                      className={`hover:bg-gray-50 ${
                        index !== files.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      <td className="px-5 py-4 text-sm font-medium text-gray-800">
                        {file.name}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 hidden md:table-cell">
                        {formatDate(file.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-sm text-right">
                        <div className="flex justify-end gap-2">
                          <a
                            href={`/api/file-sharing/files/download/${file.id}`}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                          >
                            Download
                          </a>
                          <button
                            onClick={() => handleDeleteFile(file.id)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}