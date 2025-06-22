"use client";

export default function FileList({
  files,
  loading,
  error,
  onDeleteFile,
  onRetry,
}) {
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
      onDeleteFile(fileId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 rounded-lg bg-white border border-gray-100 shadow-sm">
        <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-blue-500 border-r-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-white border border-gray-100 shadow-sm">
        <div className="text-sm text-red-500">{error}</div>
        <button
          onClick={onRetry}
          className="mt-2 px-3 py-1 text-xs font-medium text-blue-500 hover:bg-blue-50 rounded"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 rounded-lg bg-white border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-500">Belum ada file yang diunggah</p>
      </div>
    );
  }

  return (
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
                  index !== files.length - 1 ? "border-b border-gray-100" : ""
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
  );
}
