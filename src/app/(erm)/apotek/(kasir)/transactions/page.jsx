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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Link
          href="/apotek/cashier"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          New Transaction
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p>Loading transactions...</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left">Transaction Code</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {transaction.transactionCode}
                      </td>
                      <td className="py-3 px-4">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="py-3 px-4 text-right">
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
                            className="text-blue-500 hover:text-blue-700"
                          >
                            View
                          </button>
                          {transaction.status === "COMPLETED" && (
                            <button
                              onClick={() =>
                                handleCancelTransaction(transaction.id)
                              }
                              className="text-red-500 hover:text-red-700"
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
                    <td colSpan="5" className="py-6 text-center text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`mx-1 px-3 py-1 rounded ${
                  page === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Previous
              </button>
              <span className="mx-2 px-3 py-1">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`mx-1 px-3 py-1 rounded ${
                  page === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <div className="mt-6">
        <Link
          href="/apotek/dashboard"
          className="text-blue-500 hover:text-blue-700"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
