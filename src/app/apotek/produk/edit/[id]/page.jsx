"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function EditDrugPage({ params }) {
  const router = useRouter();
  const drugId = use(params).id;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    manufacturer: "",
    purchasePrice: "",
    price: "",
    stock: "",
    expiryDate: "",
    unit: "",
  });

  useEffect(() => {
    const fetchDrugData = async () => {
      try {
        const response = await fetch(`/api/drugs/${drugId}`);
        if (!response.ok) throw new Error("Failed to fetch drug data");
        const drugData = await response.json();

        setFormData({
          name: drugData.name || "",
          category: drugData.category || "",
          manufacturer: drugData.manufacturer || "",
          purchasePrice:
            drugData.purchasePrice != null
              ? drugData.purchasePrice.toString()
              : "",
          price: drugData.price != null ? drugData.price.toString() : "",
          stock: drugData.stock != null ? drugData.stock.toString() : "",
          expiryDate: drugData.expiryDate || "",
          unit: drugData.unit || "",
        });
      } catch (error) {
        console.error("Error fetching drug data:", error);
        toast.error("Gagal memuat data obat");
      } finally {
        setIsLoading(false);
      }
    };

    if (drugId) fetchDrugData();
  }, [drugId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const apiData = {
        ...formData,
        purchasePrice: formData.purchasePrice
          ? parseFloat(formData.purchasePrice)
          : 0,
        price: formData.price ? parseFloat(formData.price) : 0,
        stock: formData.stock ? parseInt(formData.stock, 10) : 0,
      };

      const response = await fetch(`/api/drugs/${drugId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) throw new Error("Failed to update drug");

      toast.success("Data obat berhasil diperbarui");
      router.push("/apotek/produk/");
    } catch (error) {
      console.error("Error updating drug:", error);
      toast.error("Gagal memperbarui data obat");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="mb-6">
          <Link
            href="/apotek/produk"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Kembali</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Edit Data Obat
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Field dengan tanda <span className="text-red-500">*</span> wajib
            diisi
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Nama Obat */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Obat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan nama obat"
              />
            </div>

            {/* Kategori */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih kategori</option>
                <option value="Antibiotik">Antibiotik</option>
                <option value="Analgesik">Analgesik</option>
                <option value="Antipiretik">Antipiretik</option>
                <option value="Antihipertensi">Antihipertensi</option>
                <option value="Vitamin">Vitamin</option>
                <option value="Suplemen">Suplemen</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* Produsen */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Produsen
              </label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan nama produsen"
              />
            </div>

            {/* Harga Beli */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga Beli (Rp)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  Rp
                </span>
                <input
                  type="number"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 sm:pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Harga Jual */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga Jual (Rp) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  Rp
                </span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-3 sm:pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Stok */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stok <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            {/* Satuan */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Satuan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                required
                placeholder="Masukkan satuan"
                className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tanggal Kadaluarsa */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Kadaluarsa
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end pt-4 gap-4">
            <Link
              href="/apotek/produk"
              className="w-full sm:w-auto px-6 py-2 text-center border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
