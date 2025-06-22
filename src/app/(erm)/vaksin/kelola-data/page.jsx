// Halaman Kelola Data - /kelola-data/page.js
"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Search, Save, X } from "lucide-react";

export default function KelolaData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newForm, setNewForm] = useState({
    nama: "",
    no_telp: "",
    alamat: "",
    kotaKelahiran: "",
    tanggalLahir: "",
    umur: "",
    jenisKelamin: "",
    namaTravel: "",
    tanggalKeberangkatan: "",
    asalTravel: "",
  });

  // Load data saat komponen dimount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/data-vaksin");
      const result = await response.json();
      setData(result.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  // Filter data berdasarkan pencarian
  const filteredData = data.filter(
    (item) =>
      item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.no_telp?.includes(searchTerm) ||
      item.alamat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaTravel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle tambah data baru
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newForm.nama.trim()) {
      alert("Nama wajib diisi");
      return;
    }

    try {
      const response = await fetch("/api/data-vaksin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newForm),
      });

      if (response.ok) {
        alert("Data berhasil ditambahkan");
        setNewForm({
          nama: "",
          no_telp: "",
          alamat: "",
          kotaKelahiran: "",
          tanggalLahir: "",
          umur: "",
          jenisKelamin: "",
          namaTravel: "",
          tanggalKeberangkatan: "",
          asalTravel: "",
        });
        setShowAddForm(false);
        loadData();
      } else {
        const error = await response.json();
        alert(error.error || "Gagal menambahkan data");
      }
    } catch (error) {
      console.error("Error adding data:", error);
      alert("Gagal menambahkan data");
    }
  };

  // Handle edit data
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.nama?.trim()) {
      alert("Nama wajib diisi");
      return;
    }

    try {
      const response = await fetch("/api/data-vaksin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        alert("Data berhasil diupdate");
        setEditingId(null);
        setEditForm({});
        loadData();
      } else {
        const error = await response.json();
        alert(error.error || "Gagal mengupdate data");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Gagal mengupdate data");
    }
  };

  // Handle hapus data
  const handleDelete = async (id, nama) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data ${nama}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/data-vaksin?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Data berhasil dihapus");
        loadData();
      } else {
        const error = await response.json();
        alert(error.error || "Gagal menghapus data");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Gagal menghapus data");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Memuat data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Kelola Data Vaksin Meningitis
            </h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              Tambah Data
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, telepon, alamat, atau travel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          {/* Form Tambah Data */}
          {showAddForm && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium mb-4">Tambah Data Baru</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nama Lengkap *"
                    value={newForm.nama}
                    onChange={(e) =>
                      setNewForm({ ...newForm, nama: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Nomor Telepon"
                    value={newForm.no_telp}
                    onChange={(e) =>
                      setNewForm({ ...newForm, no_telp: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
                  />
                  <textarea
                    placeholder="Alamat"
                    value={newForm.alamat}
                    onChange={(e) =>
                      setNewForm({ ...newForm, alamat: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
                    rows="2"
                  />
                  <input
                    type="text"
                    placeholder="Kota Kelahiran"
                    value={newForm.kotaKelahiran}
                    onChange={(e) =>
                      setNewForm({ ...newForm, kotaKelahiran: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
                  />
                  <input
                    type="text"
                    placeholder="Tanggal Lahir (dd/mm/yyyy)"
                    value={newForm.tanggalLahir}
                    onChange={(e) =>
                      setNewForm({ ...newForm, tanggalLahir: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
                  />
                  <select
                    value={newForm.jenisKelamin}
                    onChange={(e) =>
                      setNewForm({ ...newForm, jenisKelamin: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Nama Travel"
                    value={newForm.namaTravel}
                    onChange={(e) =>
                      setNewForm({ ...newForm, namaTravel: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
                  />
                  <input
                    type="text"
                    placeholder="Asal Travel"
                    value={newForm.asalTravel}
                    onChange={(e) =>
                      setNewForm({ ...newForm, asalTravel: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
                  />
                  <input
                    type="text"
                    placeholder="Tanggal Keberangkatan (dd/mm/yyyy)"
                    value={newForm.tanggalKeberangkatan}
                    onChange={(e) =>
                      setNewForm({
                        ...newForm,
                        tanggalKeberangkatan: e.target.value,
                      })
                    }
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Save className="w-4 h-4" />
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    <X className="w-4 h-4" />
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Data Table */}
          <div className="overflow-x-auto">
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {searchTerm
                    ? "Tidak ada data yang sesuai dengan pencarian"
                    : "Belum ada data"}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Nama
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Telepon
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Tanggal Lahir
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Alamat
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Jenis Kelamin
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Travel
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      {editingId === item.id ? (
                        <td colSpan="7" className="py-4 px-4">
                          <form onSubmit={handleUpdate} className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <input
                                type="text"
                                placeholder="Nama Lengkap *"
                                value={editForm.nama || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    nama: e.target.value,
                                  })
                                }
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
                                required
                              />
                              <input
                                type="tel"
                                placeholder="Nomor Telepon"
                                value={editForm.no_telp || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    no_telp: e.target.value,
                                  })
                                }
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
                              />
                              <textarea
                                placeholder="Alamat"
                                value={editForm.alamat || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    alamat: e.target.value,
                                  })
                                }
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
                                rows="2"
                              />
                              <input
                                type="text"
                                placeholder="Kota Kelahiran"
                                value={editForm.kotaKelahiran || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    kotaKelahiran: e.target.value,
                                  })
                                }
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
                              />
                              <input
                                type="text"
                                placeholder="Tanggal Lahir (dd/mm/yyyy)"
                                value={editForm.tanggalLahir || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    tanggalLahir: e.target.value,
                                  })
                                }
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
                              />
                              <select
                                value={editForm.jenisKelamin || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    jenisKelamin: e.target.value,
                                  })
                                }
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
                              >
                                <option value="">Pilih Jenis Kelamin</option>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                              </select>
                              <input
                                type="text"
                                placeholder="Nama Travel"
                                value={editForm.namaTravel || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    namaTravel: e.target.value,
                                  })
                                }
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
                              />
                              <input
                                type="text"
                                placeholder="Asal Travel"
                                value={editForm.asalTravel || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    asalTravel: e.target.value,
                                  })
                                }
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
                              />
                              <input
                                type="text"
                                placeholder="Tanggal Keberangkatan (dd/mm/yyyy)"
                                value={editForm.tanggalKeberangkatan || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    tanggalKeberangkatan: e.target.value,
                                  })
                                }
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                              >
                                <Save className="w-4 h-4" />
                                Simpan
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="flex items-center gap-2 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                              >
                                <X className="w-4 h-4" />
                                Batal
                              </button>
                            </div>
                          </form>
                        </td>
                      ) : (
                        <>
                          <td className="py-3 px-4 font-medium">{item.nama}</td>
                          <td className="py-3 px-4">{item.no_telp || "-"}</td>
                          <td className="py-3 px-4">
                            {item.tanggalLahir ? (
                              <div>
                                <div>{item.tanggalLahir}</div>
                                {item.umur && (
                                  <div className="text-sm text-gray-500">
                                    ({item.umur} tahun)
                                  </div>
                                )}
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-3 px-4">{item.alamat || "-"}</td>
                          <td className="py-3 px-4">
                            {item.jenisKelamin || "-"}
                          </td>
                          <td className="py-3 px-4">
                            {item.namaTravel ? (
                              <div>
                                <div>{item.namaTravel}</div>
                                {item.asalTravel && (
                                  <div className="text-sm text-gray-500">
                                    Asal: {item.asalTravel}
                                  </div>
                                )}
                                {item.tanggalKeberangkatan && (
                                  <div className="text-sm text-gray-500">
                                    Berangkat: {item.tanggalKeberangkatan}
                                  </div>
                                )}
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit(item)}
                                className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                              >
                                <Edit className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item.id, item.nama)}
                                className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                              >
                                <Trash2 className="w-3 h-3" />
                                Hapus
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Summary */}
          {data.length > 0 && (
            <div className="mt-6 text-sm text-gray-500">
              <span>Total: {data.length} data</span>
              {searchTerm && (
                <span className="ml-4">
                  Ditampilkan: {filteredData.length} data
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
