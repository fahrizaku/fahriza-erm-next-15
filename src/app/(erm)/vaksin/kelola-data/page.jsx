// /kelola-data/page.js
"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

// Import semua komponen
import LoadingState from "./_components/LoadingState";
import SearchInput from "./_components/SearchInput";
import AddForm from "./_components/AddForm";
import DataTable from "./_components/DataTable";
import SummaryStats from "./_components/SummaryStats";

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
    } finally {
      setLoading(false);
    }
  };

  // Filter data berdasarkan pencarian
  const filteredData = data.filter(
    (item) =>
      item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.noTelp?.includes(searchTerm) ||
      item.alamat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaTravel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort data berdasarkan createdAt (terbaru dulu)
  const sortedData = filteredData.sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return dateB - dateA;
  });

  // Handle tambah data baru
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newForm.nama.trim()) {
      return;
    }

    try {
      const response = await fetch("/api/data-vaksin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newForm),
      });

      if (response.ok) {
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
        console.error("Failed to add data");
      }
    } catch (error) {
      console.error("Error adding data:", error);
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
      return;
    }

    try {
      const response = await fetch("/api/data-vaksin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        setEditingId(null);
        setEditForm({});
        loadData();
      } else {
        console.error("Failed to update data");
      }
    } catch (error) {
      console.error("Error updating data:", error);
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
        loadData();
      } else {
        console.error("Failed to delete data");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  if (loading) {
    return <LoadingState />;
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

          {/* Search Component */}
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {/* Add Form Component */}
          <AddForm
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
            newForm={newForm}
            setNewForm={setNewForm}
            handleAdd={handleAdd}
          />

          {/* Data Table Component */}
          <DataTable
            sortedData={sortedData}
            searchTerm={searchTerm}
            editingId={editingId}
            editForm={editForm}
            setEditForm={setEditForm}
            handleUpdate={handleUpdate}
            cancelEdit={cancelEdit}
            startEdit={startEdit}
            handleDelete={handleDelete}
          />

          {/* Summary Stats Component */}
          <SummaryStats
            totalData={data.length}
            displayedData={sortedData.length}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    </div>
  );
}
