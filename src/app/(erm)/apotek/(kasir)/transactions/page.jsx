// app/transactions/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/transactions?page=${page}&limit=${limit}`
      );
      const data = await response.json();

      if (response.ok) {
        setTransactions(data.data);
        setTotalPages(data.meta.totalPages);
      } else {
        setError(data.error || "Failed to fetch transactions");
      }
    } catch (err) {
      setError("Error loading transactions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatDateMobile = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleViewReceipt = (id) => {
    router.push(`/apotek/cashier/receipt/${id}`);
  };

  const handleCancelTransaction = async (id) => {
    if (
      !confirm(
        "Are you sure you want to cancel this transaction? This will return all items to inventory."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Transaction cancelled successfully");
        fetchTransactions(); // Refresh the list
      } else {
        const data = await response.json();
        alert(data.error || "Failed to cancel transaction");
      }
    } catch (err) {
      console.error("Error cancelling transaction:", err);
      alert("Error processing your request");
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold">Riwayat Penjualan</h1>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 sm:p-4 rounded mb-4 text-sm sm:text-base">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-500 text-sm sm:text-base">
            Loading transactions...
          </div>
        </div>
      ) : (
        <>
          {/* Mobile View - Cards */}
          <div className="block lg:hidden space-y-3 mb-4">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white rounded-lg shadow p-4 border"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="font-medium text-sm break-all pr-2">
                        {transaction.transactionCode}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDateMobile(transaction.date)}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-sm">
                        Rp{" "}
                        {parseFloat(transaction.totalAmount).toLocaleString()}
                      </div>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                          transaction.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t">
                    <button
                      onClick={() => handleViewReceipt(transaction.id)}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-3 rounded text-sm font-medium"
                    >
                      View Receipt
                    </button>
                    {transaction.status === "COMPLETED" && (
                      <button
                        onClick={() => handleCancelTransaction(transaction.id)}
                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded text-sm font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-gray-500 text-sm">
                  No transactions found
                </div>
              </div>
            )}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                      Transaction Code
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                      Date
                    </th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-gray-700">
                      Total
                    </th>
                    <th className="py-3 px-4 text-center text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="py-3 px-4 text-center text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">
                          {transaction.transactionCode}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="py-3 px-4 text-right text-sm">
                          Rp{" "}
                          {parseFloat(transaction.totalAmount).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                transaction.status === "COMPLETED"
                                  ? "bg-green-100 text-green-800"
                                  : transaction.status === "CANCELLED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {transaction.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleViewReceipt(transaction.id)}
                              className="text-blue-500 hover:text-blue-700 text-sm"
                            >
                              View
                            </button>
                            {transaction.status === "COMPLETED" && (
                              <button
                                onClick={() =>
                                  handleCancelTransaction(transaction.id)
                                }
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-6 text-center text-gray-500 text-sm"
                      >
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center mt-4 gap-2">
              {/* Mobile Pagination */}
              <div className="flex sm:hidden items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`px-3 py-2 rounded text-sm ${
                    page === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  ←
                </button>
                <span className="px-3 py-2 text-sm font-medium">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`px-3 py-2 rounded text-sm ${
                    page === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  →
                </button>
              </div>

              {/* Desktop Pagination */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded ${
                    page === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`px-4 py-2 rounded ${
                    page === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-4 sm:mt-6">
        <Link
          href="/apotek/dashboard"
          className="text-blue-500 hover:text-blue-700 text-sm sm:text-base"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
