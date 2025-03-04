"use client";
import React, { useState } from "react";
import {
  Search,
  ChevronRight,
  Plus,
  Trash,
  ShoppingCart,
  User,
  Pill,
} from "lucide-react";

const TransactionPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patient, setPatient] = useState(null);
  const [transactionItems, setTransactionItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [dosage, setDosage] = useState("");
  const [isPrescription, setIsPrescription] = useState(false);

  // Contoh data obat
  const drugs = [
    { id: 1, name: "Amoxicillin 500 mg", price: 15000, stock: 100 },
    { id: 2, name: "Paracetamol 500 mg", price: 5000, stock: 50 },
    { id: 3, name: "Omeprazole 20 mg", price: 20000, stock: 30 },
  ];

  const addToTransaction = () => {
    if (!selectedDrug) return;

    const newItem = {
      drug: selectedDrug,
      quantity,
      dosage,
      subtotal: selectedDrug.price * quantity,
    };

    setTransactionItems([...transactionItems, newItem]);
    setSelectedDrug(null);
    setQuantity(1);
    setDosage("");
  };

  const removeItem = (index) => {
    const newItems = transactionItems.filter((_, i) => i !== index);
    setTransactionItems(newItems);
  };

  const totalAmount = transactionItems.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

  return (
    <div className="max-w-6xl mx-auto pt-4 px-1 sm:p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 sm:p-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Transaksi Apotek
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {transactionItems.length} item dalam transaksi
              </p>
            </div>
            <button className="px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Simpan Transaksi</span>
            </button>
          </div>

          {/* Patient Section */}
          <div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <User className="text-blue-600 w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">Pasien</h3>
                {patient ? (
                  <p className="text-sm text-gray-600">{patient.name}</p>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari pasien..."
                      className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Drug Selection Section */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari obat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <select
              value={selectedDrug?.id || ""}
              onChange={(e) => {
                const drug = drugs.find((d) => d.id === Number(e.target.value));
                setSelectedDrug(drug);
              }}
              className="p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Pilih Obat</option>
              {drugs.map((drug) => (
                <option key={drug.id} value={drug.id}>
                  {drug.name} - Rp{drug.price.toLocaleString()}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, e.target.value))}
                className="w-20 p-2 bg-gray-50 rounded-lg border border-gray-200"
              />
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="Dosis"
                className="flex-1 p-2 bg-gray-50 rounded-lg border border-gray-200"
              />
              <button
                onClick={addToTransaction}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Transaction Items */}
          <div className="space-y-3 mb-6">
            {transactionItems.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-white border border-gray-150 rounded-xl group hover:border-green-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {item.drug.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {item.quantity} x Rp{item.drug.price.toLocaleString()} =
                      <span className="font-medium ml-1">
                        Rp{item.subtotal.toLocaleString()}
                      </span>
                    </p>
                    {item.dosage && (
                      <p className="text-sm text-gray-500 mt-1">
                        Dosis: {item.dosage}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-600 p-2"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total Section */}
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Total Transaksi
                </h3>
              </div>
              <div className="text-2xl font-bold text-green-600">
                Rp{totalAmount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
