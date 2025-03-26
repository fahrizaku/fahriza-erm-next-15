"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "react-toastify";

export default function TambahProduk() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
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

  // Add useEffect to simulate data loading
  useEffect(() => {
    const initializeForm = async () => {
      try {
        // Add any initial data fetching here if needed
        // For example, fetching categories, units, etc.

        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.error("Error initializing form:", error);
        toast.error("Gagal memuat data");
      } finally {
        setIsLoading(false);
      }
    };

    initializeForm();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation - only name, price, stock, and unit are required
    const requiredFields = ["name", "price", "stock", "unit"];
    requiredFields.forEach((field) => {
      if (!formData[field] && formData[field] !== 0) {
        newErrors[field] = "Field ini wajib diisi";
      }
    });

    // Numeric validation
    if (
      formData.purchasePrice &&
      (isNaN(parseFloat(formData.purchasePrice)) ||
        parseFloat(formData.purchasePrice) < 0)
    ) {
      newErrors.purchasePrice = "Harus berupa angka positif";
    }

    if (
      formData.price &&
      (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0)
    ) {
      newErrors.price = "Harus berupa angka positif";
    }

    if (
      formData.stock &&
      (isNaN(parseInt(formData.stock)) ||
        parseInt(formData.stock) < 0 ||
        !Number.isInteger(parseFloat(formData.stock)))
    ) {
      newErrors.stock = "Harus berupa bilangan bulat positif";
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
      // Ensure all fields have at least some value to pass backend validation
      const dataToSubmit = {
        ...formData,
        // Set default values for non-required fields if they're empty
        category: formData.category || "Lainnya",
        manufacturer: formData.manufacturer || "-",
        purchasePrice: formData.purchasePrice
          ? parseFloat(formData.purchasePrice)
          : 0,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        expiryDate: formData.expiryDate || null,
      };

      const response = await fetch("/api/drugs/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      const result = await response.json();

      if (!response.ok) {
        // Check if the error is from backend validation
        if (result.error && result.error.includes("category")) {
          throw new Error(
            "Field 'category' harus diisi. Silakan pilih kategori."
          );
        } else {
          throw new Error(result.error || "Gagal menambahkan obat");
        }
      }

      toast.success("Obat berhasil ditambahkan");
      router.push("/apotek/produk");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.message || "Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
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
            Tambah Obat Baru
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Field dengan tanda <span className="text-red-500">*</span> wajib
            diisi
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Produk */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama Produk <span className="text-red-500">*</span>
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
                placeholder="Masukkan nama obat"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Kategori */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Kategori <span className="text-gray-400">(opsional)</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-white rounded-lg border ${
                  errors.category
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-cyan-500"
                } focus:outline-none focus:ring-2 focus:border-transparent`}
              >
                <option value="Lainnya">Pilih kategori</option>
                <option value="Antibiotik">Antibiotik</option>
                <option value="Analgesik">Analgesik</option>
                <option value="Antipiretik">Antipiretik</option>
                <option value="Antihipertensi">Antihipertensi</option>
                <option value="Vitamin">Vitamin</option>
                <option value="Suplemen">Suplemen</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Produsen */}
            <div>
              <label
                htmlFor="manufacturer"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Produsen <span className="text-gray-400">(opsional)</span>
              </label>
              <input
                type="text"
                id="manufacturer"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-white rounded-lg border ${
                  errors.manufacturer
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-cyan-500"
                } focus:outline-none focus:ring-2 focus:border-transparent`}
                placeholder="Masukkan nama produsen"
              />
              {errors.manufacturer && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.manufacturer}
                </p>
              )}
            </div>

            {/* Harga Beli */}
            <div>
              <label
                htmlFor="purchasePrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Harga Beli (Rp){" "}
                <span className="text-gray-400">(opsional)</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  Rp
                </span>
                <input
                  type="number"
                  id="purchasePrice"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full pl-10 pr-4 py-2 bg-white rounded-lg border ${
                    errors.purchasePrice
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-cyan-500"
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                  placeholder="0.00"
                />
              </div>
              {errors.purchasePrice && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.purchasePrice}
                </p>
              )}
            </div>

            {/* Harga Jual */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Harga Jual (Rp) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  Rp
                </span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full pl-10 pr-4 py-2 bg-white rounded-lg border ${
                    errors.price
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-cyan-500"
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            {/* Stok */}
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Stok <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                step="1"
                className={`w-full px-4 py-2 bg-white rounded-lg border ${
                  errors.stock
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-cyan-500"
                } focus:outline-none focus:ring-2 focus:border-transparent`}
                placeholder="0"
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-500">{errors.stock}</p>
              )}
            </div>

            {/* Tanggal Kadaluarsa */}
            <div>
              <label
                htmlFor="expiryDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tanggal Kadaluarsa{" "}
                <span className="text-gray-400">(opsional)</span>
              </label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-white rounded-lg border ${
                  errors.expiryDate
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-cyan-500"
                } focus:outline-none focus:ring-2 focus:border-transparent`}
              />
              {errors.expiryDate && (
                <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>
              )}
            </div>

            {/* Satuan */}
            <div>
              <label
                htmlFor="unit"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Satuan <span className="text-red-500">*</span>
              </label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-white rounded-lg border ${
                  errors.unit
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-cyan-500"
                } focus:outline-none focus:ring-2 focus:border-transparent`}
              >
                <option value="">Pilih satuan</option>
                <option value="Fls">Fls</option>
                <option value="Pcs">Pcs</option>
                <option value="Tablet">Tablet</option>
                <option value="Kapsul">Kapsul</option>
                <option value="Botol">Botol</option>
                <option value="Strip">Strip</option>
                <option value="Ampul">Ampul</option>
                <option value="Vial">Vial</option>
                <option value="Sachet">Sachet</option>
                <option value="Box">Box</option>
              </select>
              {errors.unit && (
                <p className="mt-1 text-sm text-red-500">{errors.unit}</p>
              )}
            </div>
          </div>

          {/* Tombol Submit */}
          <div className="flex justify-end pt-4">
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
                  <span>Simpan Obat</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
