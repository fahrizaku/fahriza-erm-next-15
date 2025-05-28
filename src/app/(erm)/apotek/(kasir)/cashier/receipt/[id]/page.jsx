// app/apotek/cashier/receipt/[id]/page.jsx
"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ReceiptPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchTransaction(id);
    }
  }, [id]);

  const fetchTransaction = async (transactionId) => {
    try {
      const response = await fetch(`/api/transactions/${transactionId}`);
      const data = await response.json();

      if (response.ok) {
        setTransaction(data.data);
      } else {
        setError(data.error || "Failed to fetch transaction");
      }
    } catch (err) {
      setError("Error loading transaction details");
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

  const handlePrint = () => {
    window.print();
  };

  const handleCancelTransaction = async () => {
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
        router.push("/apotek/cashier");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to cancel transaction");
      }
    } catch (err) {
      console.error("Error cancelling transaction:", err);
      alert("Error processing your request");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 text-center">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-gray-500 text-sm sm:text-base">
            Loading transaction details...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="bg-red-100 text-red-700 p-3 sm:p-4 rounded mb-4 text-sm sm:text-base">
          {error}
        </div>
        <Link
          href="/apotek/cashier"
          className="text-blue-500 hover:text-blue-700 text-sm sm:text-base"
        >
          ← Back to Cashier
        </Link>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="bg-yellow-100 text-yellow-700 p-3 sm:p-4 rounded mb-4 text-sm sm:text-base">
          Transaction not found
        </div>
        <Link
          href="/apotek/cashier"
          className="text-blue-500 hover:text-blue-700 text-sm sm:text-base"
        >
          ← Back to Cashier
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 print:shadow-none print:border">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold">RECEIPT</h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Drug Store Management System
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2 sm:gap-0">
            <div className="mb-2 sm:mb-0">
              <p className="font-bold text-sm sm:text-base">Transaction #:</p>
              <p className="text-sm sm:text-base break-all">
                {transaction.transactionCode}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="font-bold text-sm sm:text-base">Date:</p>
              <p className="text-sm sm:text-base">
                {formatDate(transaction.date)}
              </p>
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <p className="font-bold mb-2 text-sm sm:text-base">Status:</p>
            <span
              className={`px-2 py-1 rounded text-xs sm:text-sm inline-block ${
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

          <div className="mb-4 sm:mb-6">
            <h2 className="font-bold text-base sm:text-lg mb-2 border-b pb-2">
              Items
            </h2>

            {/* Mobile view - Card layout */}
            <div className="block sm:hidden space-y-3">
              {transaction.items.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-3 border">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm leading-tight flex-1 pr-2">
                      {item.product.name}
                    </h3>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold">
                        Rp {parseFloat(item.subtotal).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>
                      Rp {parseFloat(item.price).toLocaleString()} ×{" "}
                      {item.quantity} {item.product.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop view - Table layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Product</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-center py-2">Qty</th>
                    <th className="text-right py-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {transaction.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">{item.product.name}</td>
                      <td className="text-right py-2">
                        Rp {parseFloat(item.price).toLocaleString()}
                      </td>
                      <td className="text-center py-2">
                        {item.quantity} {item.product.unit}
                      </td>
                      <td className="text-right py-2">
                        Rp {parseFloat(item.subtotal).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-sm sm:text-base">Total:</span>
                <span className="text-sm sm:text-base">
                  Rp {parseFloat(transaction.totalAmount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-sm sm:text-base">Paid:</span>
                <span className="text-sm sm:text-base">
                  Rp {parseFloat(transaction.paid).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-sm sm:text-base">Change:</span>
                <span className="text-sm sm:text-base">
                  Rp {parseFloat(transaction.change).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {transaction.notes && (
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <p className="font-bold text-sm sm:text-base">Notes:</p>
              <p className="text-sm sm:text-base mt-1">{transaction.notes}</p>
            </div>
          )}

          <div className="mt-4 sm:mt-6 text-center text-gray-500 text-xs sm:text-sm">
            <p>Thank you for your purchase!</p>
          </div>
        </div>

        {/* Navigation and Actions */}
        <div className="print:hidden">
          {/* Mobile Layout - Stacked */}
          <div className="block sm:hidden space-y-3">
            <div className="flex flex-col gap-2">
              <Link
                href="/apotek/cashier"
                className="text-blue-500 hover:text-blue-700 text-sm text-center py-2 border border-blue-200 rounded"
              >
                ← Back to Cashier
              </Link>
              <Link
                href="/apotek/transactions"
                className="text-blue-500 hover:text-blue-700 text-sm text-center py-2 border border-blue-200 rounded"
              >
                View All Transactions
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handlePrint}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
              >
                Print Receipt
              </button>
              {transaction.status === "COMPLETED" && (
                <button
                  onClick={handleCancelTransaction}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium"
                >
                  Cancel Transaction
                </button>
              )}
            </div>
          </div>

          {/* Desktop Layout - Side by side */}
          <div className="hidden sm:flex justify-between">
            <div>
              <Link
                href="/apotek/cashier"
                className="text-blue-500 hover:text-blue-700 mr-4"
              >
                ← Back to Cashier
              </Link>
              <Link
                href="/apotek/transactions"
                className="text-blue-500 hover:text-blue-700"
              >
                View All Transactions
              </Link>
            </div>
            <div>
              <button
                onClick={handlePrint}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
              >
                Print Receipt
              </button>
              {transaction.status === "COMPLETED" && (
                <button
                  onClick={handleCancelTransaction}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Cancel Transaction
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
