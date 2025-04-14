"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Truck,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";

export default function TambahSupplier() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const validateForm = () => {
    const newErrors = {};
    // Only name is required
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Nama supplier wajib diisi";
    }

    // Email validation if provided
    if (
      formData.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Format email tidak valid";
    }

    // Phone validation if provided
    if (formData.phone && !/^[\d\s\-\+\(\)\.]+$/.test(formData.phone)) {
      newErrors.phone = "Format telepon tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form first
    if (!validateForm()) {
      toast.error("Harap perbaiki error pada form");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/suppliers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menambahkan supplier");
      }

      toast.success("Supplier berhasil ditambahkan");
      router.push("/apotek/supplier");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.message || "Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Kembali</span>
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Tambah Supplier Baru
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Field dengan tanda <span className="text-red-500">*</span> wajib diisi
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Truck className="w-5 h-5 text-blue-600" />
              Informasi Supplier
            </div>
          </div>
          <div className="p-6 space-y-6">
            {/* Nama Supplier */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama Supplier <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-white rounded-lg border ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-cyan-500"
                } focus:outline-none focus:ring-2 focus:border-transparent`}
                placeholder="Masukkan nama supplier"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Contact Person & Phone in one row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Person */}
              <div>
                <label
                  htmlFor="contactName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Kontak <span className="text-gray-400">(opsional)</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-300 focus:ring-cyan-500 focus:outline-none focus:ring-2 focus:border-transparent"
                    placeholder="Nama kontak person"
                  />
                </div>
                {errors.contactName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.contactName}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Telepon <span className="text-gray-400">(opsional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 bg-white rounded-lg border ${
                      errors.phone
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-cyan-500"
                    } focus:outline-none focus:ring-2 focus:border-transparent`}
                    placeholder="Nomor telepon"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email <span className="text-gray-400">(opsional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 bg-white rounded-lg border ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-cyan-500"
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                  placeholder="email@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Alamat <span className="text-gray-400">(opsional)</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-300 focus:ring-cyan-500 focus:outline-none focus:ring-2 focus:border-transparent"
                  placeholder="Alamat lengkap supplier"
                ></textarea>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Catatan <span className="text-gray-400">(opsional)</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-300 focus:ring-cyan-500 focus:outline-none focus:ring-2 focus:border-transparent"
                  placeholder="Catatan tambahan tentang supplier (opsional)"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Submit */}
        <div className="flex justify-end pt-6 pb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg mr-4 hover:bg-gray-50 transition-all"
            disabled={isSubmitting}
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Simpan Supplier</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
