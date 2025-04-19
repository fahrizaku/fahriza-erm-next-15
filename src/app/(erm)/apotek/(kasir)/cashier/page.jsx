// app/cashier/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CashierPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Load products on page load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.category &&
            product.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products?limit=1000");
      const data = await response.json();
      if (data.data) {
        // Only show products with stock > 0
        setProducts(data.data.filter((p) => p.stock > 0));
        setFilteredProducts(data.data.filter((p) => p.stock > 0));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      showNotification("Failed to load products", "error");
    }
  };

  // Add product to cart
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.productId === product.id);

    if (existingItem) {
      // Check if we have enough stock
      if (existingItem.quantity >= product.stock) {
        showNotification(
          `Only ${product.stock} ${product.unit} available in stock`,
          "error"
        );
        return;
      }

      // Update quantity of existing item
      const updatedCart = cart.map((item) =>
        item.productId === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
              subtotal: (item.quantity + 1) * item.price,
            }
          : item
      );
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: parseFloat(product.price),
          unit: product.unit,
          maxStock: product.stock,
          quantity: 1,
          subtotal: parseFloat(product.price),
        },
      ]);
    }
  };

  // Update item quantity in cart
  const updateQuantity = (productId, newQuantity) => {
    const product = cart.find((item) => item.productId === productId);

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQuantity > product.maxStock) {
      showNotification(
        `Only ${product.maxStock} ${product.unit} available in stock`,
        "error"
      );
      return;
    }

    const updatedCart = cart.map((item) =>
      item.productId === productId
        ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price }
        : item
    );

    setCart(updatedCart);
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  // Calculate total amount
  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);

  // Calculate change
  const calculateChange = () => {
    const paid = parseFloat(payment) || 0;
    return paid - totalAmount;
  };

  // Submit transaction
  const submitTransaction = async () => {
    if (cart.length === 0) {
      showNotification("Cart is empty", "error");
      return;
    }

    const paid = parseFloat(payment);
    if (!paid || paid < totalAmount) {
      showNotification("Insufficient payment amount", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          paid: paid,
          notes: "",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showNotification("Transaction completed successfully", "success");

        // Clear cart and payment
        setCart([]);
        setPayment("");

        // Refresh products to update stock
        fetchProducts();

        // Redirect to receipt page
        router.push(`/cashier/receipt/${result.data.id}`);
      } else {
        showNotification(
          result.error || "Failed to complete transaction",
          "error"
        );
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
      showNotification("Error processing transaction", "error");
    } finally {
      setLoading(false);
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
      <h1 className="text-2xl font-bold mb-6">Cashier</h1>

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

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - Product selection */}
        <div className="w-full md:w-3/5">
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />

            <div className="h-[500px] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md p-3 cursor-pointer"
                    onClick={() => addToCart(product)}
                  >
                    <h3 className="font-medium text-sm truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-1">
                      {product.category}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold">
                        Rp {parseFloat(product.price).toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="col-span-4 py-8 text-center text-gray-500">
                    No products found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Cart and Payment */}
        <div className="w-full md:w-2/5">
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="font-bold text-lg mb-3">Cart</h2>

            {cart.length > 0 ? (
              <>
                <div className="max-h-[300px] overflow-y-auto mb-4">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-2">Product</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">Qty</th>
                        <th className="p-2">Subtotal</th>
                        <th className="p-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.productId} className="border-b">
                          <td className="p-2">{item.name}</td>
                          <td className="p-2 text-right">
                            Rp {item.price.toLocaleString()}
                          </td>
                          <td className="p-2">
                            <div className="flex items-center justify-center">
                              <button
                                className="px-2 bg-gray-200 rounded-l"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity - 1
                                  )
                                }
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                min="1"
                                max={item.maxStock}
                                onChange={(e) =>
                                  updateQuantity(
                                    item.productId,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-12 text-center border-t border-b"
                              />
                              <button
                                className="px-2 bg-gray-200 rounded-r"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity + 1
                                  )
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="p-2 text-right">
                            Rp {item.subtotal.toLocaleString()}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">
                      Rp {totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1 font-medium">
                      Payment Amount
                    </label>
                    <input
                      type="number"
                      value={payment}
                      onChange={(e) => setPayment(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Enter payment amount"
                    />
                  </div>

                  {payment && (
                    <div className="flex justify-between mb-4 text-lg">
                      <span className="font-bold">Change:</span>
                      <span
                        className={`font-bold ${
                          calculateChange() < 0
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        Rp {calculateChange().toLocaleString()}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={submitTransaction}
                    disabled={
                      loading ||
                      cart.length === 0 ||
                      !payment ||
                      parseFloat(payment) < totalAmount
                    }
                    className={`w-full py-2 px-4 rounded font-bold ${
                      loading ||
                      cart.length === 0 ||
                      !payment ||
                      parseFloat(payment) < totalAmount
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {loading ? "Processing..." : "Complete Transaction"}
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-gray-500">
                Cart is empty. Add products by clicking on them.
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Link
              href="/dashboard"
              className="text-blue-500 hover:text-blue-700"
            >
              ← Back to Dashboard
            </Link>
            <Link
              href="/inventory"
              className="text-blue-500 hover:text-blue-700"
            >
              Manage Inventory →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
