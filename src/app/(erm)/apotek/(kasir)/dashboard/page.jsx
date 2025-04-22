// app/apotek/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [ringkasan, setRingkasan] = useState({
    produk: 0,
    stokRendah: 0,
    transaksi: 0,
    penjualanHariIni: 0,
    pendapatan: 0,
    pengeluaran: 0,
    saldo: 0,
  });
  const [transaksiTerbaru, setTransaksiTerbaru] = useState([]);
  const [perubahanStokTerbaru, setPerubahanStokTerbaru] = useState([]);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    ambilDataDashboard();
  }, []);

  const ambilDataDashboard = async () => {
    setMemuat(true);

    try {
      // Ambil jumlah produk dan jumlah stok rendah
      const resProduk = await fetch("/api/products?limit=1");
      const dataProduk = await resProduk.json();

      // Hitung produk dengan stok rendah (kurang dari 5)
      const resStokRendah = await fetch("/api/products?stock=low&limit=1000");
      const dataStokRendah = await resStokRendah.json();

      // Ambil transaksi terbaru
      const resTransaksi = await fetch("/api/transactions?limit=5");
      const dataTransaksi = await resTransaksi.json();

      // Ambil penjualan hari ini
      const hariIni = new Date().toISOString().split("T")[0];
      const resPenjualanHariIni = await fetch(
        `/api/financial?type=INCOME&category=SALES&startDate=${hariIni}&limit=1`
      );
      const dataPenjualanHariIni = await resPenjualanHariIni.json();

      // Ambil ringkasan keuangan
      const resKeuangan = await fetch("/api/financial?limit=1");
      const dataKeuangan = await resKeuangan.json();

      // Ambil perubahan stok terbaru
      const resPerubahan = await fetch("/api/inventory?limit=5");
      const dataPerubahan = await resPerubahan.json();

      // Tetapkan semua data
      setRingkasan({
        produk: dataProduk.meta?.total || 0,
        stokRendah: dataStokRendah.data?.length || 0,
        transaksi: dataTransaksi.meta?.total || 0,
        penjualanHariIni: dataPenjualanHariIni.meta?.summary?.income || 0,
        pendapatan: dataKeuangan.meta?.summary?.income || 0,
        pengeluaran: dataKeuangan.meta?.summary?.expense || 0,
        saldo: dataKeuangan.meta?.summary?.balance || 0,
      });

      setTransaksiTerbaru(dataTransaksi.data || []);
      setPerubahanStokTerbaru(dataPerubahan.data || []);
    } catch (error) {
      console.error("Error mengambil data dashboard:", error);
    } finally {
      setMemuat(false);
    }
  };

  const formatTanggal = (stringTanggal) => {
    const tanggal = new Date(stringTanggal);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(tanggal);
  };

  if (memuat) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Memuat data dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Pengelolaan Apotek</h1>

      {/* Aksi Cepat */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link
          href="/apotek/cashier"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-4 text-center"
        >
          <h2 className="text-lg font-medium">Kasir</h2>
          <p className="text-sm mt-1">Proses penjualan</p>
        </Link>

        <Link
          href="/apotek/produk"
          className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-4 text-center"
        >
          <h2 className="text-lg font-medium">Produk</h2>
          <p className="text-sm mt-1">Kelola inventaris</p>
        </Link>

        <Link
          href="/apotek/finance"
          className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg p-4 text-center"
        >
          <h2 className="text-lg font-medium">Keuangan</h2>
          <p className="text-sm mt-1">Lacak pendapatan & pengeluaran</p>
        </Link>

        <Link
          href="/apotek/transactions"
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg p-4 text-center"
        >
          <h2 className="text-lg font-medium">Transaksi</h2>
          <p className="text-sm mt-1">Lihat riwayat penjualan</p>
        </Link>
      </div>

      {/* Kartu Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm text-gray-500 mb-1">Produk</h3>
          <p className="text-2xl font-bold">{ringkasan.produk}</p>
          <p className="text-sm text-red-500 mt-2">
            {ringkasan.stokRendah} produk dengan stok rendah
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm text-gray-500 mb-1">Total Transaksi</h3>
          <p className="text-2xl font-bold">{ringkasan.transaksi}</p>
          <p className="text-sm text-green-500 mt-2">
            Penjualan Hari Ini: Rp{" "}
            {parseFloat(ringkasan.penjualanHariIni).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm text-gray-500 mb-1">Total Pendapatan</h3>
          <p className="text-2xl font-bold text-green-600">
            Rp {parseFloat(ringkasan.pendapatan).toLocaleString()}
          </p>
          <p className="text-sm text-red-500 mt-2">
            Pengeluaran: Rp {parseFloat(ringkasan.pengeluaran).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm text-gray-500 mb-1">Saldo</h3>
          <p
            className={`text-2xl font-bold ${
              parseFloat(ringkasan.saldo) < 0
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            Rp {parseFloat(ringkasan.saldo).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Aktivitas Terbaru */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transaksi Terbaru */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Transaksi Terbaru</h2>
            <Link
              href="/apotek/transactions"
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              Lihat Semua
            </Link>
          </div>

          {transaksiTerbaru.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-3 text-left">Tanggal</th>
                    <th className="py-2 px-3 text-left">Kode</th>
                    <th className="py-2 px-3 text-right">Jumlah</th>
                    <th className="py-2 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transaksiTerbaru.map((transaksi) => (
                    <tr key={transaksi.id} className="hover:bg-gray-50">
                      <td className="py-2 px-3">
                        {formatTanggal(transaksi.date)}
                      </td>
                      <td className="py-2 px-3">
                        <Link
                          href={`/cashier/receipt/${transaksi.id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          {transaksi.transactionCode}
                        </Link>
                      </td>
                      <td className="py-2 px-3 text-right">
                        Rp {parseFloat(transaksi.totalAmount).toLocaleString()}
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex justify-center">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              transaksi.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : transaksi.status === "CANCELLED"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {transaksi.status === "COMPLETED"
                              ? "SELESAI"
                              : transaksi.status === "CANCELLED"
                              ? "DIBATALKAN"
                              : "MENUNGGU"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">
              Tidak ada transaksi terbaru
            </p>
          )}
        </div>

        {/* Perubahan Inventaris Terbaru */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Perubahan Stok Terbaru</h2>
            <Link
              href="/apotek/inventory/movements"
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              Lihat Semua
            </Link>
          </div>

          {perubahanStokTerbaru.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-3 text-left">Tanggal</th>
                    <th className="py-2 px-3 text-left">Produk</th>
                    <th className="py-2 px-3 text-center">Tipe</th>
                    <th className="py-2 px-3 text-center">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {perubahanStokTerbaru.map((perubahan) => (
                    <tr key={perubahan.id} className="hover:bg-gray-50">
                      <td className="py-2 px-3">
                        {formatTanggal(perubahan.date)}
                      </td>
                      <td className="py-2 px-3">{perubahan.product.name}</td>
                      <td className="py-2 px-3">
                        <div className="flex justify-center">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              perubahan.type === "IN"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {perubahan.type === "IN" ? "MASUK" : "KELUAR"}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center">
                        {perubahan.quantity} {perubahan.product.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">
              Tidak ada perubahan stok terbaru
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
