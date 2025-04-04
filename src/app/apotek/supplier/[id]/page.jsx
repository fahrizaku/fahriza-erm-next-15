"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Truck,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Loader2,
  Package,
  Edit,
  Trash2,
  Calendar,
  CircleDollarSign,
  Boxes,
  Factory,
} from "lucide-react";
import { toast } from "react-toastify";

export default function SupplierDetail({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const [supplier, setSupplier] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Fetch supplier data
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await fetch(`/api/suppliers/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Supplier tidak ditemukan");
            router.push("/apotek/supplier");
            return;
          }
          throw new Error("Gagal mengambil data supplier");
        }

        const data = await response.json();
        setSupplier(data);
      } catch (error) {
        console.error("Error fetching supplier:", error);
        toast.error(error.message || "Terjadi kesalahan saat memuat data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupplier();
  }, [id, router]);

  // Handle delete supplier
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/suppliers/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.productCount) {
          toast.error(
            `Supplier tidak dapat dihapus karena masih memiliki ${data.productCount} produk terkait`
          );
        } else {
          toast.error(data.error || "Gagal menghapus supplier");
        }
        setConfirmDelete(false);
        return;
      }

      toast.success("Supplier berhasil dihapus");
      router.push("/apotek/supplier");
    } catch (error) {
      console.error("Error deleting supplier:", error);
      toast.error("Terjadi kesalahan saat menghapus supplier");
      setConfirmDelete(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="ml-2 text-gray-600">Memuat data supplier...</span>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <Truck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">
            Supplier tidak ditemukan
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Data supplier yang Anda cari tidak tersedia.
          </p>
          <button
            onClick={() => router.push("/apotek/supplier")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Kembali ke Daftar Supplier
          </button>
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              {supplier.name}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Detail informasi supplier
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              onClick={() =>
                router.push(`/apotek/supplier/edit/${supplier.id}`)
              }
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Supplier Information Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Truck className="w-5 h-5 text-blue-600" />
                Informasi Supplier
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center space-x-3 py-2 border-b border-gray-100">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Truck className="h-5 w-5" />
                </div>
                <div className="text-gray-800 font-medium">{supplier.name}</div>
              </div>

              {supplier.contactName && (
                <div className="flex items-start space-x-3 py-2 border-b border-gray-100">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">
                      Nama Kontak
                    </div>
                    <div className="text-gray-800">{supplier.contactName}</div>
                  </div>
                </div>
              )}

              {supplier.phone && (
                <div className="flex items-start space-x-3 py-2 border-b border-gray-100">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Telepon</div>
                    <div className="text-gray-800">{supplier.phone}</div>
                  </div>
                </div>
              )}

              {supplier.email && (
                <div className="flex items-start space-x-3 py-2 border-b border-gray-100">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Email</div>
                    <div className="text-gray-800">{supplier.email}</div>
                  </div>
                </div>
              )}

              {supplier.address && (
                <div className="flex items-start space-x-3 py-2 border-b border-gray-100">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Alamat</div>
                    <div className="text-gray-800">{supplier.address}</div>
                  </div>
                </div>
              )}

              {supplier.notes && (
                <div className="flex items-start space-x-3 py-2">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Catatan</div>
                    <div className="text-gray-800">{supplier.notes}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <Package className="w-5 h-5 text-blue-600" />
                  Produk dari Supplier Ini
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  {supplier.products?.length || 0} produk
                </div>
              </div>
            </div>
            <div className="p-5">
              {!supplier.products || supplier.products.length === 0 ? (
                <div className="text-center py-6">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Belum ada produk
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Supplier ini belum memiliki produk terkait.
                  </p>
                  <button
                    onClick={() => router.push("/apotek/produk/tambah")}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Tambah Produk
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Nama Produk
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Kategori
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Harga
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Stok
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {supplier.products.map((product) => (
                        <tr
                          key={product.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {product.manufacturer || "-"}
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {product.category || "Lainnya"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {product.unit}
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              Rp{" "}
                              {product.price
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {product.stock} {product.unit}
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() =>
                                router.push(`/apotek/produk/${product.id}`)
                              }
                              className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Konfirmasi Hapus
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus supplier{" "}
              <span className="font-medium">{supplier.name}</span>? Tindakan ini
              tidak dapat dibatalkan.
            </p>
            {supplier.products && supplier.products.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  <span className="font-bold">Perhatian:</span> Supplier ini
                  memiliki {supplier.products.length} produk terkait. Anda perlu
                  memindahkan atau menghapus produk-produk tersebut sebelum
                  dapat menghapus supplier.
                </p>
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
