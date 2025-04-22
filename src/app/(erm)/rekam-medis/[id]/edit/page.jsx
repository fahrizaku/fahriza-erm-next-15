// app/rekam-medis/[id]/edit/page.jsx
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import PatientInfoCard from "../_components/PatientInfoCard";
import { LoadingState, ErrorState } from "../_components/UIState";
import PageHeader from "../_components/PageHeader";

export default function EditMedicalRecordPage({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [patient, setPatient] = useState(null);
  const [screening, setScreening] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);

  // Fungsi untuk menghasilkan ID sementara yang unik
  const generateTempId = () => {
    return `new-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  // Form state
  const [formData, setFormData] = useState({
    diagnosis: "",
    icdCode: "",
    clinicalNotes: "",
    doctorName: "",
    screening: {
      id: 0,
      temperature: null,
      systolicBP: null,
      diastolicBP: null,
      pulse: null,
      respiratoryRate: null,
      weight: null,
      height: null,
      oxygenSaturation: null,
      waistCircumference: null,
    },
    prescriptions: [],
  });

  // Fetch medical record data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/medical-records/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setMedicalRecord(data.medicalRecord);
          setPatient(data.patient);
          setScreening(data.screening);
          setPrescriptions(data.prescriptions);

          // Initialize form data with current values
          setFormData({
            diagnosis: data.medicalRecord.diagnosis || "",
            icdCode: data.medicalRecord.icdCode || "",
            clinicalNotes: data.medicalRecord.clinicalNotes || "",
            doctorName: data.medicalRecord.doctorName || "",
            screening: {
              id: data.screening.id,
              temperature: data.screening.temperature,
              systolicBP: data.screening.systolicBP,
              diastolicBP: data.screening.diastolicBP,
              pulse: data.screening.pulse,
              respiratoryRate: data.screening.respiratoryRate,
              weight: data.screening.weight,
              height: data.screening.height,
              oxygenSaturation: data.screening.oxygenSaturation,
              waistCircumference: data.screening.waistCircumference,
            },
            prescriptions: data.prescriptions.map((prescription) => ({
              id: prescription.id,
              notes: prescription.notes || "",
              prescriptionType: prescription.prescriptionType || "",
              dosage: prescription.dosage || "",
              items: prescription.items.map((item) => ({
                id: item.id,
                manualDrugName: item.manualDrugName || "",
                dosage: item.dosage || "",
                quantity: item.quantity,
              })),
            })),
          });
        } else {
          setError(data.message || "Failed to fetch medical record data");
          toast.error(data.message || "Failed to fetch medical record data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
        toast.error("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle screening changes
  const handleScreeningChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      screening: {
        ...prev.screening,
        [field]:
          value === ""
            ? null
            : field === "temperature" ||
              field === "weight" ||
              field === "oxygenSaturation" ||
              field === "waistCircumference"
            ? parseFloat(value)
            : parseInt(value),
      },
    }));
  };

  // Handle prescription changes
  const handlePrescriptionChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedPrescriptions = [...prev.prescriptions];
      updatedPrescriptions[index] = {
        ...updatedPrescriptions[index],
        [field]: value,
      };
      return {
        ...prev,
        prescriptions: updatedPrescriptions,
      };
    });
  };

  // Handle prescription item changes
  const handlePrescriptionItemChange = (
    prescriptionIndex,
    itemIndex,
    field,
    value
  ) => {
    setFormData((prev) => {
      const updatedPrescriptions = [...prev.prescriptions];
      const updatedItems = [...updatedPrescriptions[prescriptionIndex].items];

      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        [field]: field === "quantity" ? parseInt(value) || 1 : value,
      };

      updatedPrescriptions[prescriptionIndex] = {
        ...updatedPrescriptions[prescriptionIndex],
        items: updatedItems,
      };

      return {
        ...prev,
        prescriptions: updatedPrescriptions,
      };
    });
  };

  // Add new prescription item
  const addPrescriptionItem = (prescriptionIndex) => {
    setFormData((prev) => {
      const updatedPrescriptions = [...prev.prescriptions];
      updatedPrescriptions[prescriptionIndex].items.push({
        id: generateTempId(),
        manualDrugName: "",
        dosage: "",
        quantity: 1,
      });

      return {
        ...prev,
        prescriptions: updatedPrescriptions,
      };
    });
  };

  // Remove prescription item
  const removePrescriptionItem = (prescriptionIndex, itemIndex) => {
    setFormData((prev) => {
      const updatedPrescriptions = [...prev.prescriptions];
      updatedPrescriptions[prescriptionIndex].items = updatedPrescriptions[
        prescriptionIndex
      ].items.filter((_, i) => i !== itemIndex);

      return {
        ...prev,
        prescriptions: updatedPrescriptions,
      };
    });
  };

  // Add new prescription
  const addPrescription = () => {
    const prescriptionId = generateTempId();
    setFormData((prev) => ({
      ...prev,
      prescriptions: [
        ...prev.prescriptions,
        {
          id: prescriptionId,
          notes: "",
          prescriptionType: "Main",
          dosage: "",
          items: [
            {
              id: `item-${generateTempId()}`,
              manualDrugName: "",
              dosage: "",
              quantity: 1,
            },
          ],
        },
      ],
    }));
  };

  // Remove prescription
  const removePrescription = (index) => {
    setFormData((prev) => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      // Validate form data before sending
      if (!formData.diagnosis.trim()) {
        toast.warning("Diagnosis tidak boleh kosong");
        setSaving(false);
        return;
      }

      // Validate prescriptions
      if (formData.prescriptions.length > 0) {
        for (let i = 0; i < formData.prescriptions.length; i++) {
          const prescription = formData.prescriptions[i];

          // Validate prescription items
          if (!prescription.items || prescription.items.length === 0) {
            toast.warning(`Resep #${i + 1} tidak memiliki item obat`);
            setSaving(false);
            return;
          }

          for (let j = 0; j < prescription.items.length; j++) {
            const item = prescription.items[j];
            if (!item.manualDrugName.trim()) {
              toast.warning(
                `Nama obat pada resep #${i + 1} item #${
                  j + 1
                } tidak boleh kosong`
              );
              setSaving(false);
              return;
            }

            if (item.quantity <= 0) {
              toast.warning(
                `Jumlah obat pada resep #${i + 1} item #${
                  j + 1
                } harus lebih dari 0`
              );
              setSaving(false);
              return;
            }
          }
        }
      }

      console.log("Mengirim data form:", formData);

      const response = await fetch(`/api/medical-records/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response dari server:", data);

      if (data.success) {
        toast.success("Rekam medis berhasil diperbarui");
        // Redirect back to the view page
        router.push(`/rekam-medis/${id}`);
      } else {
        toast.error(data.message || "Gagal memperbarui rekam medis");
      }
    } catch (error) {
      console.error("Error updating medical record:", error);
      toast.error(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error && !medicalRecord) {
    return <ErrorState error={error} router={router} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Edit Rekam Medis</h1>
        <div>
          <button
            type="button"
            onClick={() => router.push(`/rekam-medis/${id}`)}
            className="mr-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <PageHeader visitDate={medicalRecord?.visitDate} />

        <PatientInfoCard patient={patient} />

        {/* Edit form */}
        <form className="p-5 md:p-6 space-y-6">
          {/* Diagnosis Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Diagnosis
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="diagnosis"
                  className="block text-sm font-medium text-gray-700"
                >
                  Diagnosis:
                </label>
                <textarea
                  id="diagnosis"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="icdCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  ICD Code:
                </label>
                <input
                  type="text"
                  id="icdCode"
                  name="icdCode"
                  value={formData.icdCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="clinicalNotes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Catatan Klinis:
                </label>
                <textarea
                  id="clinicalNotes"
                  name="clinicalNotes"
                  value={formData.clinicalNotes}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Vitals Section - Now editable */}
          {screening && (
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Tanda Vital
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="temperature"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Suhu Tubuh (°C):
                  </label>
                  <input
                    type="number"
                    id="temperature"
                    name="temperature"
                    step="0.1"
                    value={formData.screening.temperature || ""}
                    onChange={(e) =>
                      handleScreeningChange("temperature", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="systolicBP"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tekanan Darah Sistolik (mmHg):
                  </label>
                  <input
                    type="number"
                    id="systolicBP"
                    name="systolicBP"
                    value={formData.screening.systolicBP || ""}
                    onChange={(e) =>
                      handleScreeningChange("systolicBP", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="diastolicBP"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tekanan Darah Diastolik (mmHg):
                  </label>
                  <input
                    type="number"
                    id="diastolicBP"
                    name="diastolicBP"
                    value={formData.screening.diastolicBP || ""}
                    onChange={(e) =>
                      handleScreeningChange("diastolicBP", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pulse"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Detak Jantung (bpm):
                  </label>
                  <input
                    type="number"
                    id="pulse"
                    name="pulse"
                    value={formData.screening.pulse || ""}
                    onChange={(e) =>
                      handleScreeningChange("pulse", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="respiratoryRate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Laju Pernapasan (/menit):
                  </label>
                  <input
                    type="number"
                    id="respiratoryRate"
                    name="respiratoryRate"
                    value={formData.screening.respiratoryRate || ""}
                    onChange={(e) =>
                      handleScreeningChange("respiratoryRate", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="weight"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Berat Badan (kg):
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    step="0.1"
                    value={formData.screening.weight || ""}
                    onChange={(e) =>
                      handleScreeningChange("weight", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="height"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tinggi Badan (cm):
                  </label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.screening.height || ""}
                    onChange={(e) =>
                      handleScreeningChange("height", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="oxygenSaturation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Saturasi Oksigen (%):
                  </label>
                  <input
                    type="number"
                    id="oxygenSaturation"
                    name="oxygenSaturation"
                    step="0.1"
                    value={formData.screening.oxygenSaturation || ""}
                    onChange={(e) =>
                      handleScreeningChange("oxygenSaturation", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="waistCircumference"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Lingkar Pinggang (cm):
                  </label>
                  <input
                    type="number"
                    id="waistCircumference"
                    name="waistCircumference"
                    step="0.1"
                    value={formData.screening.waistCircumference || ""}
                    onChange={(e) =>
                      handleScreeningChange(
                        "waistCircumference",
                        e.target.value
                      )
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Prescriptions Section */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Resep</h2>
              <button
                type="button"
                onClick={addPrescription}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Tambah Resep
              </button>
            </div>

            {formData.prescriptions.length === 0 ? (
              <p className="text-gray-500 italic">Belum ada resep</p>
            ) : (
              <div className="space-y-6">
                {formData.prescriptions.map(
                  (prescription, prescriptionIndex) => (
                    <div
                      key={prescription.id}
                      className="bg-gray-50 p-4 rounded-md relative"
                    >
                      <button
                        type="button"
                        onClick={() => removePrescription(prescriptionIndex)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Jenis Resep:
                          </label>
                          <select
                            value={prescription.prescriptionType}
                            onChange={(e) =>
                              handlePrescriptionChange(
                                prescriptionIndex,
                                "prescriptionType",
                                e.target.value
                              )
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          >
                            <option value="Main">Utama</option>
                            <option value="Follow-up">Lanjutan</option>
                            <option value="Alternative">Alternatif</option>
                            <option value="Racikan">Racikan</option>
                          </select>
                        </div>

                        {prescription.prescriptionType === "Racikan" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Aturan Pakai Gabungan:
                            </label>
                            <input
                              type="text"
                              value={prescription.dosage}
                              onChange={(e) =>
                                handlePrescriptionChange(
                                  prescriptionIndex,
                                  "dosage",
                                  e.target.value
                                )
                              }
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              placeholder="mis., 3 kali sehari setelah makan"
                            />
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Catatan:
                        </label>
                        <textarea
                          value={prescription.notes}
                          onChange={(e) =>
                            handlePrescriptionChange(
                              prescriptionIndex,
                              "notes",
                              e.target.value
                            )
                          }
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div className="mb-2">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-medium text-gray-700">
                            Daftar Obat
                          </h3>
                          <button
                            type="button"
                            onClick={() =>
                              addPrescriptionItem(prescriptionIndex)
                            }
                            className="px-2 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
                          >
                            Tambah Obat
                          </button>
                        </div>

                        {prescription.items.length === 0 ? (
                          <p className="text-gray-500 italic text-sm">
                            Belum ada obat
                          </p>
                        ) : (
                          <div className="space-y-4">
                            {prescription.items.map((item, itemIndex) => (
                              <div
                                key={item.id}
                                className="bg-white p-3 rounded border border-gray-200 relative"
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    removePrescriptionItem(
                                      prescriptionIndex,
                                      itemIndex
                                    )
                                  }
                                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-700">
                                      Nama Obat:
                                    </label>
                                    <input
                                      type="text"
                                      value={item.manualDrugName}
                                      onChange={(e) =>
                                        handlePrescriptionItemChange(
                                          prescriptionIndex,
                                          itemIndex,
                                          "manualDrugName",
                                          e.target.value
                                        )
                                      }
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                      placeholder="mis., Paracetamol 500mg"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-xs font-medium text-gray-700">
                                      Jumlah:
                                    </label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={item.quantity}
                                      onChange={(e) =>
                                        handlePrescriptionItemChange(
                                          prescriptionIndex,
                                          itemIndex,
                                          "quantity",
                                          e.target.value
                                        )
                                      }
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                  </div>

                                  {prescription.prescriptionType !==
                                    "Racikan" && (
                                    <div className="md:col-span-3">
                                      <label className="block text-xs font-medium text-gray-700">
                                        Aturan Pakai:
                                      </label>
                                      <input
                                        type="text"
                                        value={item.dosage}
                                        onChange={(e) =>
                                          handlePrescriptionItemChange(
                                            prescriptionIndex,
                                            itemIndex,
                                            "dosage",
                                            e.target.value
                                          )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="mis., 1 tablet 3 kali sehari setelah makan"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Doctor Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Informasi Dokter
            </h2>
            <div>
              <label
                htmlFor="doctorName"
                className="block text-sm font-medium text-gray-700"
              >
                Nama Dokter:
              </label>
              <input
                type="text"
                id="doctorName"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
