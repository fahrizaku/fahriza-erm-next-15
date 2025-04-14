"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Trash,
  User,
  Pill,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";

const NewTransactionPage = () => {
  // State Management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [patient, setPatient] = useState("");
  const [cartItems, setCartItems] = useState([]);

  // Contoh Data
  const drugs = [
    {
      id: 1,
      code: "OBT-001",
      name: "Amoxicillin 500mg",
      price: 15000,
      stock: 100,
    },
    {
      id: 2,
      code: "OBT-002",
      name: "Paracetamol 500mg",
      price: 5000,
      stock: 50,
    },
    {
      id: 3,
      code: "OBT-003",
      name: "Omeprazole 20mg",
      price: 20000,
      stock: 30,
    },
  ];

  // Fungsi untuk Menambah Item ke Keranjang
  const addToCart = () => {
    if (!selectedDrug || quantity < 1 || quantity > selectedDrug.stock) return;

    const newItem = {
      ...selectedDrug,
      quantity,
      subtotal: selectedDrug.price * quantity,
    };

    setCartItems([...cartItems, newItem]);
    setSelectedDrug(null);
    setQuantity(1);
  };

  // Fungsi Hapus Item
  const removeItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  // Hitung Total
  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Transaksi Baru</h1>
            <p className="text-gray-500 mt-1">Apotek Sehat Sentosa</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
              <User className="text-blue-600 w-5 h-5" />
              <input
                type="text"
                placeholder="Nama Pasien"
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
                className="bg-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Pencarian Obat */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari obat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {/* Daftar Obat */}
        <div className="grid gap-4 mb-8">
          {drugs
            .filter(
              (drug) =>
                drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                drug.code.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((drug) => (
              <div
                key={drug.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedDrug?.id === drug.id
                    ? "border-green-400 bg-green-50"
                    : "border-gray-200 hover:border-green-200"
                }`}
                onClick={() => setSelectedDrug(drug)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">{drug.name}</h3>
                    <p className="text-sm text-gray-500">{drug.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      Rp{drug.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">Stok: {drug.stock}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Input Jumlah */}
        {selectedDrug && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">
                  {selectedDrug.name}
                </h4>
                <p className="text-sm text-gray-500">
                  Maksimal: {selectedDrug.stock}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max={selectedDrug.stock}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(1, Math.min(selectedDrug.stock, e.target.value))
                    )
                  }
                  className="w-20 px-3 py-2 border rounded-lg"
                />
                <button
                  onClick={addToCart}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Keranjang Belanja */}
        <div className="border rounded-xl overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <h3 className="font-semibold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Keranjang Obat
            </h3>
          </div>

          <div className="p-4">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Belum ada obat ditambahkan
              </p>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 border-b last:border-0"
                  >
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x Rp{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-medium">
                        Rp{item.subtotal.toLocaleString()}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Total Pembayaran */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Total Pembayaran</h3>
                    <p className="text-2xl font-bold text-green-600">
                      Rp{total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-6 flex justify-end gap-3">
          <button className="px-6 py-3 border rounded-lg hover:bg-gray-50">
            Batal
          </button>
          <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Proses Transaksi
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTransactionPage;
