// app/inventory/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [movementType, setMovementType] = useState("IN");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("PURCHASE");
  const [notes, setNotes] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Load data on page load
  useEffect(() => {
    fetchProducts();
    fetchMovements();
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products?limit=1000");
      const data = await response.json();
      if (data.data) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      showNotification("Failed to load products", "error");
    }
  };

  // Fetch inventory movements
  const fetchMovements = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/inventory?limit=10");
      const data = await response.json();

      if (response.ok) {
        setMovements(data.data);
      } else {
        setError(data.error || "Failed to fetch inventory movements");
      }
    } catch (err) {
      setError("Error loading inventory data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle product selection for inventory adjustment
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setSelectedProduct(null);
    setMovementType("IN");
    setQuantity("");
    setReason("PURCHASE");
    setNotes("");
    setShowForm(false);
  };

  // Submit inventory movement
  const handleSubmitMovement = async (e) => {
    e.preventDefault();

    if (!selectedProduct || !quantity || parseInt(quantity) <= 0) {
      showNotification("Please enter a valid quantity", "error");
      return;
    }

    try {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          type: movementType,
          quantity: parseInt(quantity),
          reason,
          notes,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showNotification("Inventory updated successfully", "success");
        resetForm();
        // Refresh data
        fetchProducts();
        fetchMovements();
      } else {
        showNotification(result.error || "Failed to update inventory", "error");
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      showNotification("Error processing your request", "error");
    }
  };

  // Format date
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
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <div>
          <Link
            href="/products"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
          >
            Manage Products
          </Link>
          <Link
            href="/suppliers"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Manage Suppliers
          </Link>
        </div>
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

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - Products */}
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="font-bold text-lg mb-3">Products Inventory</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-3 text-left">Product</th>
                    <th className="py-2 px-3 text-center">Stock</th>
                    <th className="py-2 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="py-2 px-3">
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-gray-500">
                            {product.category}
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`${
                            product.stock <= 5 ? "text-red-500 font-bold" : ""
                          }`}
                        >
                          {product.stock} {product.unit}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => handleSelectProduct(product)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Adjust Stock
                        </button>
                      </td>
                    </tr>
                  ))}

                  {products.length === 0 && (
                    <tr>
                      <td
                        colSpan="3"
                        className="py-6 text-center text-gray-500"
                      >
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right side - Adjustment Form or Recent Movements */}
        <div className="w-full md:w-1/2">
          {showForm ? (
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h2 className="font-bold text-lg mb-3">Adjust Inventory</h2>

              <form onSubmit={handleSubmitMovement}>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Product</label>
                  <div className="p-2 border border-gray-300 rounded bg-gray-50">
                    <div className="font-medium">{selectedProduct.name}</div>
                    <div className="text-sm text-gray-500">
                      Current Stock: {selectedProduct.stock}{" "}
                      {selectedProduct.unit}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">
                    Movement Type
                  </label>
                  <select
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="IN">Stock In</option>
                    <option value="OUT">Stock Out</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter quantity"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">Reason</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    {movementType === "IN" ? (
                      <>
                        <option value="PURCHASE">Purchase</option>
                        <option value="RETURN">Return</option>
                        <option value="ADJUSTMENT">Adjustment</option>
                      </>
                    ) : (
                      <>
                        <option value="SALE">Sale</option>
                        <option value="EXPIRED">Expired</option>
                        <option value="DAMAGED">Damaged</option>
                        <option value="ADJUSTMENT">Adjustment</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows="3"
                    placeholder="Enter any additional notes"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h2 className="font-bold text-lg mb-3">
                Recent Inventory Movements
              </h2>

              {loading ? (
                <div className="text-center py-4">
                  <p>Loading inventory movements...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-2 px-3 text-left">Date</th>
                        <th className="py-2 px-3 text-left">Product</th>
                        <th className="py-2 px-3 text-center">Type</th>
                        <th className="py-2 px-3 text-center">Qty</th>
                        <th className="py-2 px-3 text-left">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {movements.length > 0 ? (
                        movements.map((movement) => (
                          <tr key={movement.id} className="hover:bg-gray-50">
                            <td className="py-2 px-3 text-sm">
                              {formatDate(movement.date)}
                            </td>
                            <td className="py-2 px-3">
                              {movement.product.name}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  movement.type === "IN"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {movement.type}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center">
                              {movement.quantity}
                            </td>
                            <td className="py-2 px-3">{movement.reason}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="py-6 text-center text-gray-500"
                          >
                            No inventory movements found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {movements.length > 0 && (
                    <div className="mt-4 text-center">
                      <Link
                        href="/inventory/movements"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        View All Inventory Movements →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Link href="/dashboard" className="text-blue-500 hover:text-blue-700">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
