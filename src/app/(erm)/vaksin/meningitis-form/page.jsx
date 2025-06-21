// meningitis form page
"use client";

import { useState } from "react";
import { ChevronRight, AlertCircle, Calendar } from "lucide-react";
import { toast } from "react-toastify";

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
  const [isLoading, setIsLoading] = useState(false); // State untuk loading

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Jika tanggal lahir diubah, hitung umur
    if (name === "tanggalLahir") {
      const age = calculateAge(value);
      setFormData((prevData) => ({
        ...prevData,
        umur: age,
      }));
    }
  };

  // Handle custom date input dengan format dd/mm/yyyy
  const handleDateChange = (name, value) => {
    // Jika input kosong, set empty
    if (value === '') {
      setFormData({ ...formData, [name]: '' });
      if (name === "tanggalLahir") {
        setFormData((prevData) => ({
          ...prevData,
          [name]: '',
          umur: '',
        }));
      }
      return;
    }

    // Ambil nilai sebelumnya untuk deteksi penghapusan
    const previousValue = formData[name];
    
    // Jika user menghapus karakter (panjang input berkurang)
    if (value.length < previousValue.length) {
      // Jika menghapus di posisi slash, hapus juga digit sebelumnya
      if (previousValue.charAt(value.length) === '/') {
        // Hapus sampai digit terakhir sebelum slash
        const newValue = previousValue.substring(0, value.length - 1);
        setFormData({ ...formData, [name]: newValue });
        
        if (name === "tanggalLahir") {
          const age = calculateAgeFromDDMMYYYY(newValue);
          setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
            umur: age,
          }));
        }
        return;
      } else {
        // Penghapusan normal
        setFormData({ ...formData, [name]: value });
        if (name === "tanggalLahir") {
          const age = calculateAgeFromDDMMYYYY(value);
          setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            umur: age,
          }));
        }
        return;
      }
    }

    // Format input untuk penambahan karakter
    let formattedValue = value.replace(/\D/g, '');
    
    // Batasi maksimal 8 digit (ddmmyyyy)
    if (formattedValue.length > 8) {
      formattedValue = formattedValue.substring(0, 8);
    }
    
    // Tambahkan slash otomatis
    if (formattedValue.length >= 2) {
      formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2);
    }
    if (formattedValue.length >= 5) {
      formattedValue = formattedValue.substring(0, 5) + '/' + formattedValue.substring(5, 9);
    }
    
    setFormData({ ...formData, [name]: formattedValue });

    // Jika tanggal lahir diubah, hitung umur
    if (name === "tanggalLahir") {
      const age = calculateAgeFromDDMMYYYY(formattedValue);
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
        umur: age,
      }));
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "";

    try {
      const birthDateObj = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDateObj.getFullYear();
      const monthDifference = today.getMonth() - birthDateObj.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
      ) {
        age--;
      }

      setError(""); // Hapus pesan kesalahan
      return age.toString();
    } catch (err) {
      setError("Format tanggal tidak valid");
      return "";
    }
  };

  const calculateAgeFromDDMMYYYY = (dateString) => {
    if (!dateString || dateString.length !== 10) return "";

    try {
      const [day, month, year] = dateString.split('/');
      if (!day || !month || !year) return "";
      
      const birthDateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const today = new Date();
      let age = today.getFullYear() - birthDateObj.getFullYear();
      const monthDifference = today.getMonth() - birthDateObj.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
      ) {
        age--;
      }

      setError(""); // Hapus pesan kesalahan
      return age.toString();
    } catch (err) {
      setError("Format tanggal tidak valid");
      return "";
    }
  };

  // Validasi format tanggal dd/mm/yyyy
  const isValidDate = (dateString) => {
    if (!dateString || dateString.length !== 10) return false;
    
    const [day, month, year] = dateString.split('/');
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    if (dayNum < 1 || dayNum > 31) return false;
    if (monthNum < 1 || monthNum > 12) return false;
    if (yearNum < 1900 || yearNum > new Date().getFullYear()) return false;
    
    // Check if date is valid
    const date = new Date(yearNum, monthNum - 1, dayNum);
    return date.getDate() === dayNum && 
           date.getMonth() === monthNum - 1 && 
           date.getFullYear() === yearNum;
  };

  const generateWordDocument = async (e) => {
    e.preventDefault();
    setError(""); // Reset pesan error

    // Validasi tanggal sebelum submit
    if (formData.tanggalLahir && !isValidDate(formData.tanggalLahir)) {
      setError("Format tanggal lahir tidak valid. Gunakan format dd/mm/yyyy");
      return;
    }
    
    if (formData.tanggalKeberangkatan && !isValidDate(formData.tanggalKeberangkatan)) {
      setError("Format tanggal keberangkatan tidak valid. Gunakan format dd/mm/yyyy");
      return;
    }

    try {
      // Tampilkan loading state
      setIsLoading(true);

      const response = await fetch("/api/generate-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Data sudah dalam format dd/mm/yyyy
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("Gagal menyimpan dokumen");
        throw new Error(errorData.error || "Gagal menghasilkan dokumen");
      }

      // Parse response JSON dari API
      const data = await response.json();

      toast.success(data.message || "Dokumen berhasil dibuat dan disimpan");

      // Opsional: Reset form setelah berhasil
      setFormData({
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
    } catch (error) {
      console.error("Error:", error);
      setError("Gagal membuat dokumen: " + error.message);
    } finally {
      setIsLoading(false); // Matikan loading state
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-4 px-1 sm:p-6">
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <div className="p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            Form Persetujuan dan Permohonan Vaksin Meningitis
          </h1>

          {/* Pesan error global */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

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
                <div className="relative">
                  <input
                    type="text"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={(e) => handleDateChange("tanggalLahir", e.target.value)}
                    placeholder="dd/mm/yyyy"
                    maxLength="10"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 pr-10 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400"
                    required
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Format: dd/mm/yyyy (contoh: 25/12/1990)</p>
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

            {/* Kota Kelahiran dan Jenis Kelamin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {/* Informasi Travel dan Tanggal Keberangkatan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Keberangkatan
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="tanggalKeberangkatan"
                    value={formData.tanggalKeberangkatan}
                    onChange={(e) => handleDateChange("tanggalKeberangkatan", e.target.value)}
                    placeholder="dd/mm/yyyy"
                    maxLength="10"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 pr-10 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Format: dd/mm/yyyy</p>
              </div>
            </div>

            {/* Tombol Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex items-center gap-2 px-5 py-3 ${
                  isLoading
                    ? "bg-gray-400"
                    : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg"
                } text-white rounded-xl transition-all font-medium`}
              >
                <span>{isLoading ? "Memproses..." : "Generate Dokumen"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}