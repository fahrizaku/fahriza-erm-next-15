"use client";

import { useState } from "react";
import { CalendarDays, ChevronRight } from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    kotaKelahiran: "",
    tanggalLahir: "",
    umur: "",
    jenisKelamin: "",
    namaTravel: "",
    tanggalKeberangkatan: "",
    asalTravel: "",
  });

  const [error, setError] = useState(""); // State untuk pesan kesalahan

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateDate = (date) => {
    // Validasi format DD/MM/YYYY
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    return regex.test(date);
  };

  const calculateAge = (birthDate) => {
    if (!validateDate(birthDate)) {
      setError("Format tanggal lahir harus DD/MM/YYYY");
      return "";
    }

    const [day, month, year] = birthDate.split("/");
    const birthDateObj = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }
    setError(""); // Hapus pesan kesalahan jika format benar
    return age.toString();
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    // Format otomatis: DD/MM/YYYY
    const formatted = value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .slice(0, 10);

    setFormData((prevData) => ({
      ...prevData,
      [name]: formatted,
    }));

    if (name === "tanggalLahir") {
      const age = calculateAge(formatted);
      setFormData((prevData) => ({
        ...prevData,
        umur: age,
      }));
    }
  };

  const generateWordDocument = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/generate-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Gagal menghasilkan dokumen");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Surat_Keterangan.docx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-4 px-1 sm:p-6">
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <div className="p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            Form Persetujuan dan Permohonan Vaksin Meningitis
          </h1>

          <form onSubmit={generateWordDocument} className="space-y-5">
            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            {/* Tanggal Lahir dan Umur */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Lahir
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleDateChange}
                    placeholder="contoh: 29/02/1960"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 pr-10 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400"
                    required
                  />
                  <CalendarDays className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Umur
                </label>
                <div className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                  {formData.umur || "-"}
                </div>
              </div>
            </div>

            {/* Kota Kelahiran */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kota Kelahiran
              </label>
              <input
                type="text"
                name="kotaKelahiran"
                value={formData.kotaKelahiran}
                onChange={handleChange}
                placeholder="Masukkan kota kelahiran"
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Alamat
              </label>
              <textarea
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                placeholder="contoh: bendorejo 1/1, pogalan, trenggalek"
                rows={3}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Jenis Kelamin
              </label>
              <select
                name="jenisKelamin"
                value={formData.jenisKelamin}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {/* Informasi Travel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nama Travel
                </label>
                <input
                  type="text"
                  name="namaTravel"
                  value={formData.namaTravel}
                  onChange={handleChange}
                  placeholder="Masukkan nama travel"
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Asal Travel
                </label>
                <input
                  type="text"
                  name="asalTravel"
                  value={formData.asalTravel}
                  onChange={handleChange}
                  placeholder="Masukkan asal travel"
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>

            {/* Tanggal Keberangkatan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Keberangkatan
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  name="tanggalKeberangkatan"
                  value={formData.tanggalKeberangkatan}
                  onChange={handleDateChange}
                  placeholder="contoh: 29/02/2028"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 pr-10 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400"
                />
                <CalendarDays className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Tombol Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all font-medium"
              >
                <span>Generate Dokumen</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
