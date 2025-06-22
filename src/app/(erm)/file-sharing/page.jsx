"use client";

import { useState, useEffect } from "react";

// Import components
import FileUpload from "./_components/FileUpload";
import BulkActions from "./_components/BulkActions";
import FileList from "./_components/FileList";
import MessageDisplay from "./_components/MessageDisplay";

export default function FileManagement() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bulkMessage, setBulkMessage] = useState({ type: "", text: "" });

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

  const handleDeleteFile = async (fileId) => {
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
      setBulkMessage({ type: "error", text: "Gagal menghapus file" });
      setTimeout(() => setBulkMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleBulkMessage = (message) => {
    setBulkMessage(message);
    if (message.text) {
      const timeout = message.type === "success" ? 4000 : 3000;
      setTimeout(() => setBulkMessage({ type: "", text: "" }), timeout);
    }

    // If it's a successful bulk delete, refresh files
    if (message.type === "success" && message.text.includes("dihapus")) {
      setFiles([]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-5 space-y-8">
      <h1 className="text-2xl font-medium text-gray-800">File Sharing</h1>

      {/* Upload Section */}
      <FileUpload onUploadSuccess={fetchFiles} />

      {/* Bulk Action Messages */}
      <MessageDisplay message={bulkMessage} />

      {/* File List Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">Files</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{files.length} files</span>
            <BulkActions files={files} onMessage={handleBulkMessage} />
          </div>
        </div>

        <FileList
          files={files}
          loading={loading}
          error={error}
          onDeleteFile={handleDeleteFile}
          onRetry={fetchFiles}
        />
      </div>
    </div>
  );
}
