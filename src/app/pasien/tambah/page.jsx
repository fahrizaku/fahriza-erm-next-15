//app/pasien/tambah/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import { toast } from "react-toastify";
import PatientInfoForm from "./_components/PatientInfoForm";
import PageHeader from "./_components/PageHeader";

const PatientRegistration = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [savingPatient, setSavingPatient] = useState(false);
  const [isBPJS, setIsBPJS] = useState(false);
  const [nextRmNumber, setNextRmNumber] = useState("");

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    birthDate: "",
    address: "",
    no_rm: "",
    no_bpjs: "",
    nik: "",
    phoneNumber: "",
  });

  // Fetch next RM number when component loads
  useEffect(() => {
    const fetchNextRmNumber = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/patients/next-rm`);
        const data = await response.json();

        if (data.success) {
          setNextRmNumber(data.nextRmNumber);
          setFormData((prev) => ({
            ...prev,
            no_rm: data.nextRmNumber,
          }));
        } else {
          console.error("Failed to fetch next RM number:", data.message);
          toast.error("Failed to fetch next RM number");
        }
      } catch (error) {
        console.error("Error fetching next RM number:", error);
        toast.error("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    fetchNextRmNumber();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle BPJS toggle
  const handleBPJSChange = (e) => {
    const newIsBPJS = e.target.checked;
    setIsBPJS(newIsBPJS);

    // Clear BPJS number if switching to regular patient
    if (!newIsBPJS) {
      setFormData((prev) => ({
        ...prev,
        no_bpjs: "",
      }));
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name) {
      toast.error("Nama pasien wajib diisi");
      return;
    }

    if (isBPJS && (!formData.no_bpjs || formData.no_bpjs.trim() === "")) {
      toast.error("Nomor BPJS wajib diisi untuk pasien BPJS");
      return;
    }

    try {
      setSavingPatient(true);

      // Prepare data for API
      const patientData = {
        ...formData,
        isBPJS,
        no_rm: parseInt(formData.no_rm, 10),
        // Convert empty strings to null
        nik: formData.nik?.trim() || null,
        no_bpjs: isBPJS ? formData.no_bpjs?.trim() || null : null,
        phoneNumber: formData.phoneNumber?.trim() || null,
      };

      // Create toast promise that shows loading/success/error states
      await toast.promise(
        fetch("/api/patients/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patientData),
        }).then(async (response) => {
          const data = await response.json();

          if (data.success) {
            setTimeout(() => {
              router.push(`/pasien/${data.patientId}`);
            }, 1000);
            return data;
          } else {
            throw new Error(data.message || "Gagal menyimpan data pasien");
          }
        }),
        {
          loading: "Menyimpan data pasien...",
          success: "Data pasien berhasil disimpan!",
          error: (err) =>
            `${err.message || "Terjadi kesalahan saat menyimpan data"}`,
        }
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      // The toast.promise will handle the error display
    } finally {
      setSavingPatient(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pt-4 px-1 sm:p-6">
      <PageHeader />

      {/* Registration Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
      >
        <h2 className="text-lg font-medium text-gray-800 mb-4">Data Pasien</h2>

        <PatientInfoForm
          formData={formData}
          handleInputChange={handleInputChange}
          isBPJS={isBPJS}
          handleBPJSChange={handleBPJSChange}
        />

        {/* Submit Button - Full width across both columns */}
        <div className="mt-8 col-span-full">
          <button
            type="submit"
            disabled={savingPatient || loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {savingPatient ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>Simpan Data Pasien</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientRegistration;
