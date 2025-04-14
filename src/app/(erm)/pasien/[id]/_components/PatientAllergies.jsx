import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const severityOptions = [
  { value: "ringan", label: "Ringan" },
  { value: "sedang", label: "Sedang" },
  { value: "parah", label: "Parah" },
];

const allergyTypeOptions = [
  { value: "makanan", label: "Makanan" },
  { value: "obat", label: "Obat" },
  { value: "lingkungan", label: "Lingkungan" },
  { value: "lainnya", label: "Lainnya" },
];

const statusOptions = [
  { value: "aktif", label: "Aktif" },
  { value: "tidak_aktif", label: "Tidak Aktif" },
  { value: "sembuh", label: "Sembuh" },
];

export default function PatientAllergies({ patientId }) {
  const [allergies, setAllergies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    allergyName: "",
    allergyType: "obat",
    severity: "sedang",
    reaction: "",
    notes: "",
    status: "aktif",
    reportedAt: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAllergyId, setEditingAllergyId] = useState(null);

  // Fetch patient allergies
  useEffect(() => {
    if (patientId) {
      fetchAllergies();
    }
  }, [patientId]);

  const fetchAllergies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/patients/${patientId}/allergies`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setAllergies(data.allergies);
      } else {
        console.error("Failed to fetch allergies:", data.message);
      }
    } catch (error) {
      console.error("Error fetching allergies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingAllergyId
        ? `/api/patients/${patientId}/allergies/${editingAllergyId}`
        : `/api/patients/${patientId}/allergies`;

      const method = editingAllergyId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          editingAllergyId
            ? "Alergi berhasil diperbarui"
            : "Alergi berhasil ditambahkan"
        );
        resetForm();
        fetchAllergies();
      } else {
        toast.error(data.message || "Gagal menyimpan data alergi");
      }
    } catch (error) {
      console.error("Error saving allergy:", error);
      toast.error("Terjadi kesalahan saat menyimpan data alergi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus data alergi ini?")) return;

    try {
      const response = await fetch(
        `/api/patients/${patientId}/allergies/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Alergi berhasil dihapus");
        fetchAllergies();
      } else {
        toast.error(data.message || "Gagal menghapus data alergi");
      }
    } catch (error) {
      console.error("Error deleting allergy:", error);
      toast.error("Terjadi kesalahan saat menghapus data alergi");
    }
  };

  const handleEdit = (allergy) => {
    // Format the date to YYYY-MM-DD for the input field
    const formattedReportedAt = allergy.reportedAt
      ? new Date(allergy.reportedAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    setFormData({
      allergyName: allergy.allergyName,
      allergyType: allergy.allergyType || "obat",
      severity: allergy.severity || "sedang",
      reaction: allergy.reaction || "",
      notes: allergy.notes || "",
      status: allergy.status || "aktif",
      reportedAt: formattedReportedAt,
    });
    setEditingAllergyId(allergy.id);
    setShowAddForm(true);

    // Scroll to form
    setTimeout(() => {
      document
        .getElementById("allergyForm")
        .scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const resetForm = () => {
    setFormData({
      allergyName: "",
      allergyType: "obat",
      severity: "sedang",
      reaction: "",
      notes: "",
      status: "aktif",
      reportedAt: new Date().toISOString().split("T")[0],
    });
    setEditingAllergyId(null);
    setShowAddForm(false);
  };

  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case "ringan":
        return "bg-green-100 text-green-800";
      case "sedang":
        return "bg-yellow-100 text-yellow-800";
      case "parah":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "aktif":
        return "bg-red-100 text-red-800";
      case "tidak_aktif":
        return "bg-gray-100 text-gray-800";
      case "sembuh":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="mt-8 bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Riwayat Alergi</h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="py-1 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition-colors"
          >
            Tambah Alergi
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2 text-gray-600">Memuat data alergi...</p>
        </div>
      ) : allergies.length === 0 && !showAddForm ? (
        <div className="text-center py-6 text-gray-500">
          <p>Tidak ada data alergi yang tercatat</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allergies.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Nama Alergi
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tipe
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tingkat
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Dilaporkan
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Reaksi
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Catatan
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tindakan
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allergies.map((allergy) => (
                    <tr key={allergy.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {allergy.allergyName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {allergy.allergyType || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {allergy.severity && (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityBadgeClass(
                              allergy.severity
                            )}`}
                          >
                            {allergy.severity.charAt(0).toUpperCase() +
                              allergy.severity.slice(1)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {allergy.status && (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                              allergy.status
                            )}`}
                          >
                            {allergy.status === "tidak_aktif"
                              ? "Tidak Aktif"
                              : allergy.status.charAt(0).toUpperCase() +
                                allergy.status.slice(1)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {formatDate(allergy.reportedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {allergy.reaction || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {allergy.notes || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(allergy)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(allergy.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {showAddForm && (
            <div
              id="allergyForm"
              className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <h3 className="text-lg font-medium mb-4">
                {editingAllergyId ? "Edit Alergi" : "Tambah Alergi Baru"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="allergyName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nama Alergi *
                    </label>
                    <input
                      type="text"
                      id="allergyName"
                      name="allergyName"
                      value={formData.allergyName}
                      onChange={handleInputChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Contoh: Penisilin"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="allergyType"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Jenis Alergi
                    </label>
                    <select
                      id="allergyType"
                      name="allergyType"
                      value={formData.allergyType}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {allergyTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="severity"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tingkat Keparahan
                    </label>
                    <select
                      id="severity"
                      name="severity"
                      value={formData.severity}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {severityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Status Alergi
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="reportedAt"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tanggal Dilaporkan
                    </label>
                    <input
                      type="date"
                      id="reportedAt"
                      name="reportedAt"
                      value={formData.reportedAt}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="reaction"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Reaksi yang Terjadi
                    </label>
                    <input
                      type="text"
                      id="reaction"
                      name="reaction"
                      value={formData.reaction}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Contoh: Ruam merah, gatal"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Catatan Tambahan
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Catatan tambahan tentang alergi ini"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Menyimpan...
                      </span>
                    ) : (
                      "Simpan"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
