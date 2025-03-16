"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import VisitHistoryList from "./_components/VisitHistoryList";
import SearchFilter from "./_components/SearchFilter";
import Pagination from "./_components/Pagination";

// Create a client component that uses useSearchParams
function VisitHistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State untuk data, loading dan error
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [metadata, setMetadata] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk pagination
  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam) : 1;
  });
  const [limit] = useState(20);

  // Membuat URL query parameters
  const buildQueryString = () => {
    const params = new URLSearchParams();

    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (search) params.append("search", search);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    params.append("page", page.toString());
    params.append("limit", limit.toString());

    return params.toString();
  };

  // Fetch data function
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/medical-records?${buildQueryString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      setMedicalRecords(result.data);
      setMetadata(result.meta);
    } catch (err) {
      console.error("Error fetching medical records:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts or when dependencies change
  useEffect(() => {
    fetchData();
  }, [page, searchParams]);

  // Update URL ketika halaman berubah
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/pasien/riwayat-kunjungan?${params.toString()}`, {
      scroll: false,
    });
  }, [page]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <SearchFilter onSearch={() => setPage(1)} />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          <p>Terjadi kesalahan saat mengambil data. Silakan coba lagi.</p>
        </div>
      ) : medicalRecords.length === 0 ? (
        <div className="bg-yellow-50 p-4 rounded-md">
          <p>Tidak ada riwayat kunjungan yang ditemukan.</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-gray-600">
            Menampilkan {medicalRecords.length} dari {metadata.total} kunjungan
          </p>

          <VisitHistoryList medicalRecords={medicalRecords} />

          {metadata.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={metadata.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex justify-center py-10">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );
}

// Main page component that uses Suspense
export default function VisitHistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Riwayat Kunjungan Pasien</h1>

      <Suspense fallback={<LoadingFallback />}>
        <VisitHistoryContent />
      </Suspense>
    </div>
  );
}
