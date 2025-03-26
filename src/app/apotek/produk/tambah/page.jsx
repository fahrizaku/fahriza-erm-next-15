"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  X,
  Package,
  CircleDollarSign,
  Boxes,
  Calendar,
  Factory,
} from "lucide-react";
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

  // Autocomplete suggestions
  const categoryOptions = [
    "Antibiotik",
    "Analgesik",
    "Antipiretik",
    "Antihipertensi",
    "Vitamin",
    "Suplemen",
    "Lainnya",
  ];

  const unitOptions = [
    "Fls",
    "Pcs",
    "Tablet",
    "Kapsul",
    "Botol",
    "Strip",
    "Ampul",
    "Vial",
    "Sachet",
    "Box",
  ];

  // Autocomplete state
  const [categoryInput, setCategoryInput] = useState("");
  const [unitInput, setUnitInput] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);

  // Refs for handling clicks outside dropdown
  const categoryRef = useRef(null);
  const unitRef = useRef(null);

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

  // Handle clicks outside of dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
      if (unitRef.current && !unitRef.current.contains(event.target)) {
        setIsUnitDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter categories based on input
  useEffect(() => {
    if (categoryInput === "") {
      setFilteredCategories(categoryOptions);
    } else {
      setFilteredCategories(
        categoryOptions.filter((option) =>
          option.toLowerCase().includes(categoryInput.toLowerCase())
        )
      );
    }
  }, [categoryInput]);

  // Filter units based on input
  useEffect(() => {
    if (unitInput === "") {
      setFilteredUnits(unitOptions);
    } else {
      setFilteredUnits(
        unitOptions.filter((option) =>
          option.toLowerCase().includes(unitInput.toLowerCase())
        )
      );
    }
  }, [unitInput]);

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation - only name, price, and unit are required (stock is optional)
    const requiredFields = ["name", "price", "unit"];
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

  // Handle category input change
  const handleCategoryInputChange = (e) => {
    setCategoryInput(e.target.value);
    setFormData((prev) => ({
      ...prev,
      category: e.target.value,
    }));
    setIsCategoryDropdownOpen(true);

    // Clear error when field is edited
    if (errors.category) {
      setErrors({
        ...errors,
        category: undefined,
      });
    }
  };

  // Handle unit input change
  const handleUnitInputChange = (e) => {
    setUnitInput(e.target.value);
    setFormData((prev) => ({
      ...prev,
      unit: e.target.value,
    }));
    setIsUnitDropdownOpen(true);

    // Clear error when field is edited
    if (errors.unit) {
      setErrors({
        ...errors,
        unit: undefined,
      });
    }
  };

  // Handle selection from category dropdown
  const handleSelectCategory = (category) => {
    setFormData((prev) => ({
      ...prev,
      category,
    }));
    setCategoryInput(category);
    setIsCategoryDropdownOpen(false);
  };

  // Handle selection from unit dropdown
  const handleSelectUnit = (unit) => {
    setFormData((prev) => ({
      ...prev,
      unit,
    }));
    setUnitInput(unit);
    setIsUnitDropdownOpen(false);
  };

  // Clear input fields
  const handleClearCategory = () => {
    setCategoryInput("");
    setFormData((prev) => ({
      ...prev,
      category: "",
    }));
  };

  const handleClearUnit = () => {
    setUnitInput("");
    setFormData((prev) => ({
      ...prev,
      unit: "",
    }));
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
        // Auto-fill stock with 100 if not provided
        stock: formData.stock ? parseInt(formData.stock) : 100,
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
          Tambah Produk Baru
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Field dengan tanda <span className="text-red-500">*</span> wajib diisi
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column (spans 2/3 width on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Nama Produk Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 p-4 bg-gray-50">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <Package className="w-5 h-5 text-blue-600" />
                  Informasi Dasar
                </div>
              </div>
              <div className="p-5 space-y-4">
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

                {/* Kategori and Unit in one row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Kategori with Autocomplete */}
                  <div ref={categoryRef} className="relative">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Kategori <span className="text-gray-400">(opsional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="category"
                        value={categoryInput}
                        onChange={handleCategoryInputChange}
                        onFocus={() => setIsCategoryDropdownOpen(true)}
                        className={`w-full px-4 py-2 bg-white rounded-lg border ${
                          errors.category
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-cyan-500"
                        } focus:outline-none focus:ring-2 focus:border-transparent pr-10`}
                        placeholder="Ketik atau pilih kategori"
                      />
                      {categoryInput && (
                        <button
                          type="button"
                          onClick={handleClearCategory}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {isCategoryDropdownOpen &&
                      filteredCategories.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredCategories.map((option, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleSelectCategory(option)}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Satuan with Autocomplete */}
                  <div ref={unitRef} className="relative">
                    <label
                      htmlFor="unit"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Satuan <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="unit"
                        value={unitInput}
                        onChange={handleUnitInputChange}
                        onFocus={() => setIsUnitDropdownOpen(true)}
                        className={`w-full px-4 py-2 bg-white rounded-lg border ${
                          errors.unit
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-cyan-500"
                        } focus:outline-none focus:ring-2 focus:border-transparent pr-10`}
                        placeholder="Ketik atau pilih satuan"
                      />
                      {unitInput && (
                        <button
                          type="button"
                          onClick={handleClearUnit}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {isUnitDropdownOpen && filteredUnits.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredUnits.map((option, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelectUnit(option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.unit && (
                      <p className="mt-1 text-sm text-red-500">{errors.unit}</p>
                    )}
                  </div>
                </div>

                {/* Produsen */}
                <div>
                  <label
                    htmlFor="manufacturer"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Produsen <span className="text-gray-400">(opsional)</span>
                  </label>
                  <div className="relative">
                    <Factory className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      id="manufacturer"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 bg-white rounded-lg border ${
                        errors.manufacturer
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-cyan-500"
                      } focus:outline-none focus:ring-2 focus:border-transparent`}
                      placeholder="Masukkan nama produsen"
                    />
                  </div>
                  {errors.manufacturer && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.manufacturer}
                    </p>
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
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 bg-white rounded-lg border ${
                        errors.expiryDate
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-cyan-500"
                      } focus:outline-none focus:ring-2 focus:border-transparent`}
                    />
                  </div>
                  {errors.expiryDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.expiryDate}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (spans 1/3 width on large screens) */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 p-4 bg-gray-50">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <CircleDollarSign className="w-5 h-5 text-green-600" />
                  Informasi Harga
                </div>
              </div>
              <div className="p-5 space-y-4">
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
              </div>
            </div>

            {/* Stock Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 p-4 bg-gray-50">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <Boxes className="w-5 h-5 text-amber-600" />
                  Informasi Stok
                </div>
              </div>
              <div className="p-5">
                {/* Stok */}
                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Stok{" "}
                    <span className="text-gray-400">
                      (opsional, default: 100)
                    </span>
                  </label>
                  <div className="relative">
                    <Boxes className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      step="1"
                      className={`w-full pl-10 pr-4 py-2 bg-white rounded-lg border ${
                        errors.stock
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-cyan-500"
                      } focus:outline-none focus:ring-2 focus:border-transparent`}
                      placeholder="100"
                    />
                  </div>
                  {errors.stock && (
                    <p className="mt-1 text-sm text-red-500">{errors.stock}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Submit */}
        <div className="flex justify-end pt-2 pb-6">
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
  );
}
