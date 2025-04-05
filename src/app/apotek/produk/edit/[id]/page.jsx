"use client";

import React, { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Package,
  CircleDollarSign,
  Boxes,
  Calendar,
  Factory,
  Truck,
  Tag,
  FileText,
  X,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function EditProductPage({ params }) {
  const router = useRouter();
  const drugId = use(params).id;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [supplierInput, setSupplierInput] = useState("");

  // For multiple categories
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Category options
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
    "Injeksi",
  ];

  // Refs for handling clicks outside dropdown
  const supplierRef = useRef(null);
  const categoryRef = useRef(null);

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

  // Handle clicks outside of dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (supplierRef.current && !supplierRef.current.contains(event.target)) {
        setIsSupplierDropdownOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
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

  // Fetch suppliers and drug data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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

        // Fetch drug data
        const response = await fetch(`/api/drugs/${drugId}`);
        if (!response.ok) throw new Error("Failed to fetch drug data");
        const drugData = await response.json();

        // Parse categories if they exist
        let categoriesArray = [];
        if (drugData.category) {
          categoriesArray = drugData.category
            .split(",")
            .map((cat) => cat.trim());
          setSelectedCategories(categoriesArray);
        }

        setFormData({
          name: drugData.name || "",
          category: drugData.category || "",
          manufacturer: drugData.manufacturer || "",
          purchasePrice:
            drugData.purchasePrice != null
              ? drugData.purchasePrice.toString()
              : "",
          price: drugData.price != null ? drugData.price.toString() : "",
          stock: drugData.stock != null ? drugData.stock.toString() : "",
          expiryDate: drugData.expiryDate || "",
          unit: drugData.unit || "",
          supplierId: drugData.supplierId || "",
          batchNumber: drugData.batchNumber || "",
          ingredients: drugData.ingredients || "",
        });

        // Set supplier input if there's a supplier
        if (drugData.supplier) {
          setSupplierInput(drugData.supplier.name);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Gagal memuat data");
      } finally {
        setIsLoading(false);
      }
    };

    if (drugId) fetchData();
  }, [drugId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle category input change
  const handleCategoryInputChange = (e) => {
    setCategoryInput(e.target.value);
    setIsCategoryDropdownOpen(true);
  };

  // Add a category
  const addCategory = () => {
    if (categoryInput && !selectedCategories.includes(categoryInput)) {
      setSelectedCategories([...selectedCategories, categoryInput]);
      setCategoryInput("");
    }
  };

  // Remove a category
  const removeCategory = (categoryToRemove) => {
    setSelectedCategories(
      selectedCategories.filter((cat) => cat !== categoryToRemove)
    );
  };

  // Handle selection from category dropdown
  const handleSelectCategory = (category) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
      setCategoryInput("");
      setIsCategoryDropdownOpen(false);
    }
  };

  // Handle keypress for category input
  const handleCategoryKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCategory();
    }
  };

  // Clear category input
  const handleClearCategoryInput = () => {
    setCategoryInput("");
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

  // Handle selection from supplier dropdown
  const handleSelectSupplier = (supplier) => {
    setFormData((prev) => ({
      ...prev,
      supplierId: supplier.id,
    }));
    setSupplierInput(supplier.name);
    setIsSupplierDropdownOpen(false);
  };

  // Clear supplier
  const handleClearSupplier = () => {
    setSupplierInput("");
    setFormData((prev) => ({
      ...prev,
      supplierId: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const apiData = {
        ...formData,
        purchasePrice: formData.purchasePrice
          ? parseFloat(formData.purchasePrice)
          : null,
        price: formData.price ? parseFloat(formData.price) : 0,
        stock: formData.stock ? parseInt(formData.stock, 10) : 0,
        supplierId: formData.supplierId
          ? parseInt(formData.supplierId, 10)
          : null,
      };

      const response = await fetch(`/api/drugs/${drugId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update drug");
      }

      toast.success("Data obat berhasil diperbarui");
      router.push(`/apotek/produk/${drugId}`);
    } catch (error) {
      console.error("Error updating drug:", error);
      toast.error(error.message || "Gagal memperbarui data obat");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Link
          href={`/apotek/produk/${drugId}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Kembali ke detail produk</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Edit Data Produk
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Field dengan tanda <span className="text-red-500">*</span> wajib
            diisi
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nama Obat */}
          <div className="col-span-1 sm:col-span-2 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Obat <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan nama obat"
            />
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
                {/* Satuan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Satuan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                    placeholder="Masukkan satuan"
                    className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Kategori with multi-select */}
                <div ref={categoryRef} className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
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
                        value={categoryInput}
                        onChange={handleCategoryInputChange}
                        onFocus={() => setIsCategoryDropdownOpen(true)}
                        onKeyPress={handleCategoryKeyPress}
                        className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                </div>

                {/* Supplier - Dropdown with search */}
                <div ref={supplierRef} className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Truck className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={supplierInput}
                      onChange={handleSupplierInputChange}
                      onFocus={() => setIsSupplierDropdownOpen(true)}
                      className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Produsen
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Factory className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan nama produsen"
                    />
                  </div>
                </div>

                {/* Batch Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Batch
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="batchNumber"
                      value={formData.batchNumber}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan nomor batch"
                    />
                  </div>
                </div>

                {/* Tanggal Kadaluarsa */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Kadaluarsa
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Price Information */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 p-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <CircleDollarSign className="w-5 h-5 text-green-600" />
                    Informasi Harga
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {/* Harga Beli */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Harga Beli (Rp)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        Rp
                      </span>
                      <input
                        type="number"
                        name="purchasePrice"
                        value={formData.purchasePrice}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 sm:pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Harga Jual */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Harga Jual (Rp) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        Rp
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-3 sm:pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Margin Preview (read-only) */}
                  {formData.purchasePrice && formData.price && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preview Margin
                      </label>
                      <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-green-600 font-medium">
                        {(
                          ((parseFloat(formData.price) -
                            parseFloat(formData.purchasePrice)) /
                            parseFloat(formData.purchasePrice)) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
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
                  {/* Stok */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stok <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Boxes className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-3 sm:pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Komposisi/Kandungan */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <FileText className="w-5 h-5 text-gray-600" />
                Kandungan/Komposisi
              </div>
            </div>
            <div className="p-4">
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan informasi kandungan atau komposisi obat"
              ></textarea>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end pt-4 gap-4">
            <Link
              href={`/apotek/produk/${drugId}`}
              className="w-full sm:w-auto px-6 py-2 text-center border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
