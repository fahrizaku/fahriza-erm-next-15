import React, { useState, useEffect } from "react";
import { AlertCircle, Plus, Edit2, ChevronDown, ChevronUp } from "lucide-react";

const allergyTypeOptions = [
  { value: "makanan", label: "Makanan" },
  { value: "obat", label: "Obat" },
  { value: "lingkungan", label: "Lingkungan" },
  { value: "lainnya", label: "Lainnya" },
];

const severityOptions = [
  { value: "ringan", label: "Ringan" },
  { value: "sedang", label: "Sedang" },
  { value: "parah", label: "Parah" },
];

const statusOptions = [
  { value: "aktif", label: "Aktif" },
  { value: "tidak_aktif", label: "Tidak Aktif" },
  { value: "sembuh", label: "Sembuh" },
];

export default function AllergyReporting({
  patientId,
  allergies,
  setAllergies,
  isLoading,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    allergyName: "",
    allergyType: "obat",
    severity: "sedang",
    reaction: "",
    notes: "",
    status: "aktif",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [expandedAllergy, setExpandedAllergy] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitAllergy = (e) => {
    if (e) e.preventDefault();

    if (editingIndex !== null) {
      // Update existing allergy
      const updatedAllergies = [...allergies];
      updatedAllergies[editingIndex] = {
        ...updatedAllergies[editingIndex],
        ...formData,
        // Keep the existingAllergyId if it exists
        existingAllergyId:
          updatedAllergies[editingIndex].existingAllergyId || null,
      };
      setAllergies(updatedAllergies);
    } else {
      // Add new allergy
      const newAllergy = {
        ...formData,
        // New allergies don't have existingAllergyId
        existingAllergyId: null,
      };
      setAllergies([...allergies, newAllergy]);
    }

    resetForm();
  };

  const handleEdit = (index) => {
    const allergy = allergies[index];
    setFormData({
      allergyName: allergy.allergyName,
      allergyType: allergy.allergyType || "obat",
      severity: allergy.severity || "sedang",
      reaction: allergy.reaction || "",
      notes: allergy.notes || "",
      status: allergy.status || "aktif",
    });
    setEditingIndex(index);
    setShowAddForm(true);
    // Scroll to form on mobile
    const formElement = document.getElementById("allergyForm");
    if (formElement) {
      setTimeout(() => {
        formElement.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const resetForm = () => {
    setFormData({
      allergyName: "",
      allergyType: "obat",
      severity: "sedang",
      reaction: "",
      notes: "",
      status: "aktif",
    });
    setEditingIndex(null);
    setShowAddForm(false);
  };

  const toggleExpandAllergy = (index) => {
    setExpandedAllergy(expandedAllergy === index ? null : index);
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

  return (
    <div className="mb-8 bg-white rounded-lg border border-gray-200">
      <div className="p-5 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-md font-semibold text-gray-800">
            Riwayat Alergi Pasien
          </h2>
          {!showAddForm && (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="py-1 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Tambah Alergi
            </button>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Dokter dapat memperbarui informasi alergi
        </div>
      </div>

      {isLoading ? (
        <div className="p-5 text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2 text-gray-600">Memuat data alergi...</p>
        </div>
      ) : allergies.length === 0 && !showAddForm ? (
        <div className="p-5">
          <div className="flex items-center justify-center py-6 text-gray-500 border border-dashed border-gray-300 rounded-lg">
            <AlertCircle className="h-5 w-5 mr-2 text-gray-400" />
            <p>Tidak ada data alergi yang tercatat untuk pasien ini</p>
          </div>
        </div>
      ) : (
        <div className="p-5">
          {/* Desktop view - regular table */}
          {allergies.length > 0 && (
            <div className="hidden md:block overflow-x-auto -mx-5">
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
                  {allergies.map((allergy, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {allergy.allergyName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {allergyTypeOptions.find(
                            (opt) => opt.value === allergy.allergyType
                          )?.label || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {allergy.severity && (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityBadgeClass(
                              allergy.severity
                            )}`}
                          >
                            {severityOptions.find(
                              (opt) => opt.value === allergy.severity
                            )?.label || "-"}
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
                          type="button"
                          onClick={() => handleEdit(index)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <span className="flex items-center">
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile view */}
          {allergies.length > 0 && (
            <div className="md:hidden space-y-4">
              {allergies.map((allergy, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div
                    className="p-3 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleExpandAllergy(index)}
                  >
                    <div className="font-medium text-gray-800">
                      {allergy.allergyName}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityBadgeClass(
                          allergy.severity
                        )}`}
                      >
                        {severityOptions.find(
                          (opt) => opt.value === allergy.severity
                        )?.label || "-"}
                      </span>
                      {expandedAllergy === index ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  </div>

                  {expandedAllergy === index && (
                    <div className="p-3 pt-0 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">
                            Tipe Alergi
                          </h4>
                          <p className="text-sm font-medium">
                            {allergyTypeOptions.find(
                              (opt) => opt.value === allergy.allergyType
                            )?.label || "-"}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-medium text-gray-500">
                            Status
                          </h4>
                          <p className="text-sm font-medium">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                allergy.status
                              )}`}
                            >
                              {allergy.status === "tidak_aktif"
                                ? "Tidak Aktif"
                                : allergy.status.charAt(0).toUpperCase() +
                                  allergy.status.slice(1)}
                            </span>
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-medium text-gray-500">
                            Reaksi
                          </h4>
                          <p className="text-sm font-medium">
                            {allergy.reaction || "-"}
                          </p>
                        </div>
                      </div>

                      {allergy.notes && (
                        <div className="mt-3">
                          <h4 className="text-xs font-medium text-gray-500">
                            Catatan
                          </h4>
                          <p className="text-sm font-medium">{allergy.notes}</p>
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(index);
                          }}
                          className="flex items-center text-blue-600 text-sm"
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          Edit Alergi
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {showAddForm && (
            <div
              id="allergyForm"
              className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <h3 className="text-md font-semibold text-gray-800 mb-4">
                {editingIndex !== null ? "Edit Alergi" : "Tambah Alergi Baru"}
              </h3>
              <div>
                <div className="grid grid-cols-1 gap-4 mb-4">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  </div>

                  <div>
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

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-2 sm:mt-0"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitAllergy}
                    className="py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
