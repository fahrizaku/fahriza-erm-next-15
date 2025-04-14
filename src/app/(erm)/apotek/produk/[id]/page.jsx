"use client";

import React, { useState, useEffect, use } from "react";
import {
  ArrowLeft,
  Package,
  CircleDollarSign,
  Boxes,
  FileText,
  Factory,
  Truck,
  Calendar,
  Tag,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ProductDetail = ({ params }) => {
  const router = useRouter();
  // Menggunakan React.use() untuk membuka Promise params
  const resolvedParams = use(params);
  const [drug, setDrug] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await fetch(`/api/drugs/${resolvedParams.id}`);
        if (!response.ok) throw new Error("Failed to fetch drug details");
        const data = await response.json();

        // Parse categories if they exist
        if (data.category) {
          setCategories(
            data.category
              .split(",")
              .map((cat) => cat.trim())
              .filter((cat) => cat)
          );
        }

        setDrug(data);
      } catch (error) {
        console.error("Error fetching drug details:", error);
        toast.error("Gagal memuat data produk");
      } finally {
        setIsLoading(false);
      }
    };

    if (resolvedParams?.id) {
      fetchProductDetail();
    }
  }, [resolvedParams?.id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/drugs/${resolvedParams.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menghapus produk");
      }

      toast.success("Produk berhasil dihapus");
      router.push("/apotek/produk");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.message || "Terjadi kesalahan saat menghapus produk");
      setConfirmDelete(false);
    }
  };

  // Function to get a different color for each category
  const getCategoryColor = (index) => {
    const colors = [
      "bg-purple-100 text-purple-800",
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-red-100 text-red-800",
      "bg-yellow-100 text-yellow-800",
      "bg-indigo-100 text-indigo-800",
      "bg-pink-100 text-pink-800",
      "bg-cyan-100 text-cyan-800",
    ];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!drug) {
    return (
      <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-800">
              Obat tidak ditemukan
            </h2>
            <p className="text-gray-600 mt-2">
              Data obat yang Anda cari tidak tersedia
            </p>
            <Link
              href="/apotek/produk"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Kembali ke daftar obat
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/apotek/produk"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Kembali ke daftar obat</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{drug.name}</h1>
            <p className="text-gray-600 mt-1">Detail informasi obat</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Link
              href={`/apotek/produk/edit/${drug.id}`}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </Link>
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Package className="w-5 h-5 text-blue-600" />
                Informasi Dasar
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Satuan</p>
                <p className="font-medium text-gray-800">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {drug.unit}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kategori</p>
                {categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {categories.map((category, index) => (
                      <span
                        key={index}
                        className={`inline-block px-2 py-1 rounded-full text-sm ${getCategoryColor(
                          index
                        )}`}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="font-medium text-gray-500 italic">
                    Tidak ada kategori
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Pabrik</p>
                <p className="font-medium text-gray-800">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                    <Factory className="w-4 h-4" />
                    {drug.manufacturer || "Tidak ada informasi pabrik"}
                  </span>
                </p>
              </div>

              {drug.supplier && (
                <div>
                  <p className="text-sm text-gray-500">Supplier</p>
                  <p className="font-medium text-gray-800">
                    <Link
                      href={`/apotek/supplier/${drug.supplierId}`}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-sm hover:bg-teal-200 transition-colors"
                    >
                      <Truck className="w-4 h-4" />
                      {drug.supplier.name}
                    </Link>
                  </p>
                </div>
              )}

              {drug.batchNumber && (
                <div>
                  <p className="text-sm text-gray-500">Nomor Batch</p>
                  <p className="font-medium text-gray-800">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      <Tag className="w-4 h-4" />
                      {drug.batchNumber}
                    </span>
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">Tanggal Kadaluarsa</p>
                <p className="font-medium text-gray-800">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    <Calendar className="w-4 h-4" />
                    {drug.expiryDate
                      ? new Date(drug.expiryDate).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "Tidak ada tanggal kadaluarsa"}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Terakhir Diperbarui</p>
                <p className="font-medium text-gray-800">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {new Date(drug.updatedAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Price Information */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <CircleDollarSign className="w-5 h-5 text-green-600" />
                Informasi Harga
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Harga Beli</p>
                <p className="font-medium text-gray-800">
                  {drug.purchasePrice
                    ? `Rp ${drug.purchasePrice.toLocaleString("id-ID")}`
                    : "Tidak ada informasi harga beli"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Harga Jual</p>
                <p className="font-medium text-cyan-800">
                  Rp {drug.price.toLocaleString("id-ID")}
                </p>
              </div>
              {drug.purchasePrice && (
                <div>
                  <p className="text-sm text-gray-500">Margin</p>
                  <p className="font-medium text-green-600">
                    {(
                      ((drug.price - drug.purchasePrice) / drug.purchasePrice) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Stock Information */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Boxes className="w-5 h-5 text-amber-600" />
                Informasi Stok
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Stok Tersedia</p>
                <p className="font-medium text-gray-800">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-sm
                    ${
                      drug.stock > 50
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {drug.stock} {drug.unit}
                  </span>
                </p>
              </div>
              {drug.minimumStock && (
                <div>
                  <p className="text-sm text-gray-500">Stok Minimum</p>
                  <p className="font-medium text-gray-800">
                    {drug.minimumStock} {drug.unit}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Ingredients Information */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <FileText className="w-5 h-5 text-gray-600" />
                Kandungan/Komposisi
              </div>
            </div>
            <div className="p-4">
              {drug.ingredients ? (
                <p className="text-gray-700 whitespace-pre-line">
                  {drug.ingredients}
                </p>
              ) : (
                <p className="text-gray-500 italic">
                  Tidak ada informasi kandungan
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Konfirmasi Hapus
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus produk{" "}
              <span className="font-medium">{drug.name}</span>? Tindakan ini
              tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
