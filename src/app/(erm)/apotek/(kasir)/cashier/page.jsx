// app/apotek/cashier/page.js
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

  // Memuat produk saat halaman dimuat
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter produk berdasarkan kata kunci pencarian
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

  // Mengambil produk dari API
  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products?limit=1000");
      const data = await response.json();
      if (data.data) {
        // Hanya tampilkan produk dengan stok > 0
        setProducts(data.data.filter((p) => p.stock > 0));
        setFilteredProducts(data.data.filter((p) => p.stock > 0));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      showNotification("Gagal memuat produk", "error");
    }
  };

  // Menambahkan produk ke keranjang
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.productId === product.id);

    if (existingItem) {
      // Item sudah ada di cart, jangan tambahkan lagi
      return;
    } else {
      // Menambahkan item baru ke keranjang dengan quantity 0
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: parseFloat(product.price),
          unit: product.unit,
          maxStock: product.stock,
          quantity: 0, // Mulai dari 0
          subtotal: 0, // Subtotal awal 0
        },
      ]);
    }
  };

  // Update jumlah item di keranjang
  const updateQuantity = (productId, newQuantity) => {
    const product = cart.find((item) => item.productId === productId);

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQuantity > product.maxStock) {
      showNotification(
        `Hanya tersedia ${product.maxStock} ${product.unit} di stok`,
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

  // Menghapus item dari keranjang
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  // Menghitung total belanja
  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);

  // Menghitung kembalian
  const calculateChange = () => {
    const paid = parseFloat(payment) || 0;
    return paid - totalAmount;
  };

  // Mengirim transaksi
  const submitTransaction = async () => {
    if (cart.length === 0) {
      showNotification("Keranjang kosong", "error");
      return;
    }

    // Cek apakah ada item dengan quantity 0
    const hasZeroQuantity = cart.some((item) => item.quantity === 0);
    if (hasZeroQuantity) {
      showNotification(
        "Tidak dapat memproses transaksi. Ada item dengan jumlah 0",
        "error"
      );
      return;
    }

    const paid = parseFloat(payment);
    if (!paid || paid < totalAmount) {
      showNotification("Jumlah pembayaran tidak mencukupi", "error");
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
        showNotification("Transaksi berhasil diselesaikan", "success");

        // Bersihkan keranjang dan pembayaran
        setCart([]);
        setPayment("");

        // Refresh produk untuk update stok
        fetchProducts();

        // Redirect ke halaman struk
        router.push(`/apotek/cashier/receipt/${result.data.id}`);
      } else {
        showNotification(
          result.error || "Gagal menyelesaikan transaksi",
          "error"
        );
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
      showNotification("Error memproses transaksi", "error");
    } finally {
      setLoading(false);
    }
  };

  // Menampilkan notifikasi
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Kasir</h1>

      {/* Notifikasi */}
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
        {/* Sisi kiri - Pemilihan produk */}
        <div className="w-full md:w-3/5">
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <input
              type="text"
              placeholder="Cari produk berdasarkan nama atau kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />

            <div className="h-[500px] overflow-y-auto">
              <div className="flex flex-col gap-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md p-3 cursor-pointer"
                    onClick={() => addToCart(product)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{product.name}</h3>
                        <p className="text-xs text-gray-500">
                          {product.category}
                        </p>
                      </div>
                      <div className="ml-4 text-right">
                        <span className="text-sm font-bold block">
                          Rp {parseFloat(product.price).toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          Stok: {product.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    Produk tidak ditemukan
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sisi kanan - Keranjang dan Pembayaran */}
        <div className="w-full md:w-2/5">
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="font-bold text-lg mb-3">Keranjang</h2>

            {cart.length > 0 ? (
              <>
                <div className="max-h-[400px] overflow-y-auto mb-4 space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className={`bg-gray-50 border rounded-lg p-4 relative ${
                        item.quantity === 0
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            Rp {item.price.toLocaleString()} x {item.quantity}{" "}
                            {item.unit}
                          </p>
                          {item.quantity === 0 && (
                            <p className="text-xs text-red-500 mt-1">
                              *Jumlah harus lebih dari 0
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-500 hover:text-red-700 absolute top-2 right-2"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <button
                              className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 10
                                )
                              }
                              disabled={item.quantity < 10}
                            >
                              -10
                            </button>
                            <button
                              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity < 1}
                            >
                              -1
                            </button>
                          </div>

                          <input
                            type="number"
                            value={item.quantity}
                            min="0"
                            max={item.maxStock}
                            onChange={(e) =>
                              updateQuantity(
                                item.productId,
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-16 text-center border rounded p-1"
                          />

                          <div className="flex gap-1">
                            <button
                              className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                            >
                              +1
                            </button>
                            <button
                              className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 4
                                )
                              }
                            >
                              +4
                            </button>
                            <button
                              className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 6
                                )
                              }
                            >
                              +6
                            </button>
                            <button
                              className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 10
                                )
                              }
                            >
                              +10
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                        <span className="text-sm text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          Rp {item.subtotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tambahkan peringatan jika ada item dengan quantity 0 */}
                {cart.some((item) => item.quantity === 0) && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                    Tidak dapat memproses transaksi karena ada item dengan
                    jumlah 0. Harap tambah jumlah atau hapus item tersebut.
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">
                      Rp {totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1 font-medium">
                      Jumlah Pembayaran
                    </label>
                    <input
                      type="number"
                      value={payment}
                      onChange={(e) => setPayment(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Masukkan jumlah pembayaran"
                    />
                  </div>

                  {payment && (
                    <div className="flex justify-between mb-4 text-lg">
                      <span className="font-bold">Kembalian:</span>
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
                      parseFloat(payment) < totalAmount ||
                      cart.some((item) => item.quantity === 0)
                    }
                    className={`w-full py-2 px-4 rounded font-bold ${
                      loading ||
                      cart.length === 0 ||
                      !payment ||
                      parseFloat(payment) < totalAmount ||
                      cart.some((item) => item.quantity === 0)
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {loading ? "Memproses..." : "Selesaikan Transaksi"}
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-gray-500">
                Keranjang kosong. Tambahkan produk dengan mengkliknya.
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Link
              href="/apotek/dashboard"
              className="text-blue-500 hover:text-blue-700"
            >
              ← Kembali ke Dashboard
            </Link>
            {/* <Link
              href="/apotek/inventory"
              className="text-blue-500 hover:text-blue-700"
            >
              Kelola Inventaris →
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
