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
  Truck,
  FileText,
  Plus,
} from "lucide-react";
import { toast } from "react-toastify";

export default function TambahProduk() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    manufacturer: "",
    purchasePrice: "",
    price: "",
    stock: "",
    expiryDate: "",
    unit: "",
    supplierId: "",
    batchNumber: "",
    ingredients: "",
  });

  // For multiple categories
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");

  // Autocomplete suggestions
  const categoryOptions = [
    "Obat Bebas",
    "Obat Bebas Terbatas",
    "Obat Keras",
    "High Alert",
    "Jamu",
    "Obat Herbal Terstandar",
    "Fitofarmaka",
    "Kosmetika",
    "Lainnya",
    "OTC",
    "Narkotika",
    "Psikotropika",
    "OOT",
    "Paten Keras",
    "Paten Antibiotik",
    "Generik",
    "Prekursor",
    "Prekursor Kombinasi",
    "Labor",
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
  const [unitInput, setUnitInput] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
  const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [supplierInput, setSupplierInput] = useState("");

  // Refs for handling clicks outside dropdown
  const categoryRef = useRef(null);
  const unitRef = useRef(null);
  const supplierRef = useRef(null);

  // Fetch suppliers and initialize form
  useEffect(() => {
    const initializeForm = async () => {
      try {
        // Fetch suppliers
        const suppliersResponse = await fetch("/api/suppliers");
        if (suppliersResponse.ok) {
          const suppliersData = await suppliersResponse.json();
          setSuppliers(suppliersData);
          setFilteredSuppliers(suppliersData);
        } else {
          console.error("Failed to fetch suppliers");
        }

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
      if (supplierRef.current && !supplierRef.current.contains(event.target)) {
        setIsSupplierDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update formData.category whenever selectedCategories changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      category: selectedCategories.join(", "),
    }));
  }, [selectedCategories]);

  // Filter categories based on input
  useEffect(() => {
    if (categoryInput === "") {
      setFilteredCategories(categoryOptions);
    } else {
      setFilteredCategories(
        categoryOptions.filter(
          (option) =>
            option.toLowerCase().includes(categoryInput.toLowerCase()) &&
            !selectedCategories.includes(option)
        )
      );
    }
  }, [categoryInput, selectedCategories]);

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

  // Filter suppliers based on input
  useEffect(() => {
    if (supplierInput === "") {
      setFilteredSuppliers(suppliers);
    } else {
      setFilteredSuppliers(
        suppliers.filter((supplier) =>
          supplier.name.toLowerCase().includes(supplierInput.toLowerCase())
        )
      );
    }
  }, [supplierInput, suppliers]);

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
    setIsCategoryDropdownOpen(true);

    // Clear error when field is edited
    if (errors.category) {
      setErrors({
        ...errors,
        category: undefined,
      });
    }
  };

  // Add a category
  const addCategory = () => {
    if (categoryInput && !selectedCategories.includes(categoryInput)) {
      setSelectedCategories([...selectedCategories, categoryInput]);
      setCategoryInput("");
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

  // Handle supplier input change
  const handleSupplierInputChange = (e) => {
    setSupplierInput(e.target.value);
    setFormData((prev) => ({
      ...prev,
      supplierId: "",
    }));
    setIsSupplierDropdownOpen(true);
  };

  // Handle selection from category dropdown
  const handleSelectCategory = (category) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
      setCategoryInput("");
      setIsCategoryDropdownOpen(false);
    }
  };

  // Remove a category
  const removeCategory = (categoryToRemove) => {
    setSelectedCategories(
      selectedCategories.filter((cat) => cat !== categoryToRemove)
    );
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

  // Handle selection from supplier dropdown
  const handleSelectSupplier = (supplier) => {
    setFormData((prev) => ({
      ...prev,
      supplierId: supplier.id,
    }));
    setSupplierInput(supplier.name);
    setIsSupplierDropdownOpen(false);
  };

  // Clear input fields
  const handleClearCategoryInput = () => {
    setCategoryInput("");
  };

  const handleClearUnit = () => {
    setUnitInput("");
    setFormData((prev) => ({
      ...prev,
      unit: "",
    }));
  };

  const handleClearSupplier = () => {
    setSupplierInput("");
    setFormData((prev) => ({
      ...prev,
      supplierId: "",
    }));
  };

  // Handle keypress for category input
  const handleCategoryKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCategory();
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
        // Category is already set from the useEffect that watches selectedCategories
        manufacturer: formData.manufacturer || "-",
        purchasePrice: formData.purchasePrice
          ? parseFloat(formData.purchasePrice)
          : 0,
        price: parseFloat(formData.price),
        // Auto-fill stock with 100 if not provided
        stock: formData.stock ? parseInt(formData.stock) : 100,
        expiryDate: formData.expiryDate || null,
        supplierId: formData.supplierId ? parseInt(formData.supplierId) : null,
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

                {/* Kategori with multi-select */}
                <div ref={categoryRef} className="relative">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Kategori <span className="text-gray-400">(opsional)</span>
                  </label>

                  {/* Selected Categories */}
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedCategories.map((cat, index) => (
                        <div
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {cat}
                          <button
                            type="button"
                            onClick={() => removeCategory(cat)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input and dropdown for adding categories */}
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        id="category"
                        value={categoryInput}
                        onChange={handleCategoryInputChange}
                        onFocus={() => setIsCategoryDropdownOpen(true)}
                        onKeyPress={handleCategoryKeyPress}
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
                          onClick={handleClearCategoryInput}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={addCategory}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  {isCategoryDropdownOpen && filteredCategories.length > 0 && (
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

                {/* Supplier */}
                <div ref={supplierRef} className="relative">
                  <label
                    htmlFor="supplier"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Supplier <span className="text-gray-400">(opsional)</span>
                  </label>
                  <div className="relative">
                    <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      id="supplier"
                      value={supplierInput}
                      onChange={handleSupplierInputChange}
                      onFocus={() => setIsSupplierDropdownOpen(true)}
                      className="w-full pl-10 pr-10 py-2 bg-white rounded-lg border border-gray-300 focus:ring-cyan-500 focus:outline-none focus:ring-2 focus:border-transparent"
                      placeholder="Pilih supplier"
                    />
                    {supplierInput && (
                      <button
                        type="button"
                        onClick={handleClearSupplier}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {isSupplierDropdownOpen && filteredSuppliers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredSuppliers.map((supplier) => (
                        <div
                          key={supplier.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelectSupplier(supplier)}
                        >
                          {supplier.name}
                        </div>
                      ))}
                    </div>
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

                {/* Ingredients */}
                <div>
                  <label
                    htmlFor="ingredients"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Kandungan/Komposisi{" "}
                    <span className="text-gray-400">(opsional)</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      id="ingredients"
                      name="ingredients"
                      value={formData.ingredients}
                      onChange={handleChange}
                      rows="3"
                      className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-300 focus:ring-cyan-500 focus:outline-none focus:ring-2 focus:border-transparent"
                      placeholder="Masukkan kandungan/komposisi obat"
                    ></textarea>
                  </div>
                </div>

                {/* Batch Number and Expiry Date in one row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Batch Number */}
                  <div>
                    <label
                      htmlFor="batchNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nomor Batch{" "}
                      <span className="text-gray-400">(opsional)</span>
                    </label>
                    <input
                      type="text"
                      id="batchNumber"
                      name="batchNumber"
                      value={formData.batchNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white rounded-lg border border-gray-300 focus:ring-cyan-500 focus:outline-none focus:ring-2 focus:border-transparent"
                      placeholder="Masukkan nomor batch"
                    />
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
                {/* Stock */}
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
