"use client";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Fungsi untuk menghasilkan array halaman yang akan ditampilkan
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Tampilkan semua halaman jika totalPages <= maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Selalu tampilkan halaman pertama
      pageNumbers.push(1);

      // Tentukan range halaman yang ditampilkan
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Pastikan kita selalu menampilkan maxVisiblePages - 2 halaman (tidak termasuk first & last)
      const pagesInRange = endPage - startPage + 1;
      if (pagesInRange < maxVisiblePages - 2) {
        if (startPage === 2) {
          endPage = Math.min(
            totalPages - 1,
            endPage + (maxVisiblePages - 2 - pagesInRange)
          );
        } else if (endPage === totalPages - 1) {
          startPage = Math.max(
            2,
            startPage - (maxVisiblePages - 2 - pagesInRange)
          );
        }
      }

      // Tambahkan ellipsis jika diperlukan
      if (startPage > 2) {
        pageNumbers.push("...");
      }

      // Tambahkan halaman di tengah
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Tambahkan ellipsis jika diperlukan
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Selalu tampilkan halaman terakhir
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 mx-1 rounded ${
          currentPage === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        &laquo; Prev
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          className={`px-3 py-1 mx-1 rounded ${
            page === currentPage
              ? "bg-blue-600 text-white"
              : page === "..."
              ? "bg-white text-gray-500 cursor-default"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 mx-1 rounded ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Next &raquo;
      </button>
    </div>
  );
}
