// app/apotek/finance/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function FinancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: "EXPENSE",
    category: "OPERATIONAL",
    amount: "",
    description: "",
  });
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Categories for financial records
  const categories = {
    INCOME: ["SALES", "REFUND", "INVESTMENT", "OTHER_INCOME"],
    EXPENSE: [
      "INVENTORY_PURCHASE",
      "OPERATIONAL",
      "SALARY",
      "RENT",
      "UTILITY",
      "MAINTENANCE",
      "OTHER_EXPENSE",
    ],
  };

  useEffect(() => {
    fetchRecords();
  }, [page, filterType, filterCategory, startDate, endDate]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      let url = `/api/financial?page=${page}&limit=${limit}`;

      if (filterType) url += `&type=${filterType}`;
      if (filterCategory) url += `&category=${filterCategory}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setRecords(data.data);
        setTotalPages(data.meta.totalPages);
        setSummary(data.meta.summary);
      } else {
        setError(data.error || "Failed to fetch financial records");
      }
    } catch (err) {
      setError("Error loading financial data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilterType("");
    setFilterCategory("");
    setStartDate("");
    setEndDate("");
    setPage(1);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({
      ...newRecord,
      [name]: value,
    });
  };

  const handleTypeChange = (e) => {
    setNewRecord({
      ...newRecord,
      type: e.target.value,
      category: categories[e.target.value][0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newRecord.amount || parseFloat(newRecord.amount) <= 0) {
      showNotification("Please enter a valid amount", "error");
      return;
    }

    try {
      const response = await fetch("/api/financial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: newRecord.type,
          category: newRecord.category,
          amount: parseFloat(newRecord.amount),
          description: newRecord.description,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showNotification("Financial record added successfully", "success");
        setNewRecord({
          type: "EXPENSE",
          category: "OPERATIONAL",
          amount: "",
          description: "",
        });
        setShowForm(false);
        // Refresh records
        fetchRecords();
      } else {
        showNotification(
          result.error || "Failed to add financial record",
          "error"
        );
      }
    } catch (error) {
      console.error("Error adding financial record:", error);
      showNotification("Error processing your request", "error");
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Financial Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showForm ? "Cancel" : "Add Financial Record"}
        </button>
      </div>

      {/* Notification */}
      {notification.show && (
        <div
          className={`p-4 mb-4 rounded-md ${
            notification.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {notification.message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2 text-green-600">Income</h3>
          <p className="text-2xl font-bold">
            Rp {parseFloat(summary.income).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2 text-red-600">Expense</h3>
          <p className="text-2xl font-bold">
            Rp {parseFloat(summary.expense).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2 text-blue-600">Balance</h3>
          <p
            className={`text-2xl font-bold ${
              parseFloat(summary.balance) < 0
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            Rp {parseFloat(summary.balance).toLocaleString()}
          </p>
        </div>
      </div>

      {/* New Record Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="font-bold text-lg mb-4">Add Financial Record</h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 font-medium">Type</label>
                <select
                  name="type"
                  value={newRecord.type}
                  onChange={handleTypeChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Category</label>
                <select
                  name="category"
                  value={newRecord.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {categories[newRecord.type].map((category) => (
                    <option key={category} value={category}>
                      {category.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Amount</label>
              <input
                type="number"
                name="amount"
                value={newRecord.amount}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter amount"
                step="0.01"
                min="0"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                name="description"
                value={newRecord.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                rows="3"
                placeholder="Enter description"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="font-bold mb-3">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block mb-1 text-sm">Type</label>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setFilterCategory("");
                setPage(1);
              }}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 border border-gray-300 rounded"
              disabled={!filterType}
            >
              <option value="">All Categories</option>
              {filterType &&
                categories[filterType].map((category) => (
                  <option key={category} value={category}>
                    {category.replace("_", " ")}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Financial Records List */}
      {loading ? (
        <div className="text-center py-8">
          <p>Loading financial records...</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-left">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {records.length > 0 ? (
                  records.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{formatDate(record.date)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            record.type === "INCOME"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {record.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {record.category.replace("_", " ")}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={
                            record.type === "INCOME"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          Rp {parseFloat(record.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">{record.description || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-gray-500">
                      No financial records found
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
