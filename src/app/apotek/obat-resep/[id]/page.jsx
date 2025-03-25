"use client";

import React, { useState, useEffect, use } from "react";
import {
  ArrowLeft,
  Package,
  CircleDollarSign,
  Boxes,
  FileText,
  Factory,
} from "lucide-react";
import Link from "next/link";

const ProductDetail = ({ params }) => {
  // Menggunakan React.use() untuk membuka Promise params
  const resolvedParams = use(params);
  const [drug, setDrug] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await fetch(`/api/drugs-resep/${resolvedParams.id}`);
        if (!response.ok) throw new Error("Failed to fetch drug details");
        const data = await response.json();
        setDrug(data);
      } catch (error) {
        console.error("Error fetching drug details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (resolvedParams?.id) {
      fetchProductDetail();
    }
  }, [resolvedParams?.id]);

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
              href="/apotek/obat-resep"
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
          href="/apotek/obat-resep"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Kembali ke daftar obat</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{drug.name}</h1>
          <p className="text-gray-600 mt-1">Detail informasi obat</p>
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
                <p className="font-medium text-gray-800">
                  <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {drug.category || "Tidak ada kategori"}
                  </span>
                </p>
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
              <div>
                <p className="text-sm text-gray-500">Tanggal Kadaluarsa</p>
                <p className="font-medium text-gray-800">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
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
                    {drug.stock} pcs
                  </span>
                </p>
              </div>
              {drug.minimumStock && (
                <div>
                  <p className="text-sm text-gray-500">Stok Minimum</p>
                  <p className="font-medium text-gray-800">
                    {drug.minimumStock} pcs
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {drug.description && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <FileText className="w-5 h-5 text-gray-600" />
                  Deskripsi
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-700 whitespace-pre-line">
                  {drug.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
