// app/apotek/cashier/receipt/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ReceiptPage({ params }) {
  const router = useRouter();
  const { id } = params;
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
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading transaction details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
        <Link
          href="/apotek/cashier"
          className="text-blue-500 hover:text-blue-700"
        >
          ← Back to Cashier
        </Link>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded mb-4">
          Transaction not found
        </div>
        <Link
          href="/apotek/cashier"
          className="text-blue-500 hover:text-blue-700"
        >
          ← Back to Cashier
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-4 print:shadow-none print:border">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">RECEIPT</h1>
            <p className="text-gray-500">Drug Store Management System</p>
          </div>

          <div className="flex justify-between mb-4">
            <div>
              <p className="font-bold">Transaction #:</p>
              <p>{transaction.transactionCode}</p>
            </div>
            <div>
              <p className="font-bold">Date:</p>
              <p>{formatDate(transaction.date)}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="font-bold mb-2">Status:</p>
            <span
              className={`px-2 py-1 rounded text-sm ${
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

          <div className="mb-6">
            <h2 className="font-bold text-lg mb-2 border-b pb-2">Items</h2>
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

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="font-bold">Total:</span>
              <span>
                Rp {parseFloat(transaction.totalAmount).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold">Paid:</span>
              <span>Rp {parseFloat(transaction.paid).toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold">Change:</span>
              <span>Rp {parseFloat(transaction.change).toLocaleString()}</span>
            </div>
          </div>

          {transaction.notes && (
            <div className="mt-4 p-2 bg-gray-50 rounded">
              <p className="font-bold">Notes:</p>
              <p>{transaction.notes}</p>
            </div>
          )}

          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>Thank you for your purchase!</p>
          </div>
        </div>

        <div className="flex justify-between print:hidden">
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
  );
}
