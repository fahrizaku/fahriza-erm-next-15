"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

// Import komponen yang sudah dipisah
import { ErrorMessage } from "./_components/ErrorMessage";
import { PersonalInfoSection } from "./_components/PersonalInfoSection";
import { TravelInfoSection } from "./_components/TravelInfoSection";
// import { VaccineInfoSection } from "./_components/VaccineInfoSection"; // DISABLED
import { SubmitButton } from "./_components/SubmitButton";

// Import utils
import {
  calculateAge,
  calculateAgeFromDDMMYYYY,
  formatDateInput,
} from "./_utils/dateUtils";
import { validateFormDates } from "./_utils/validationUtils";
import { capitalizeFormData } from "./_utils/textUtils";

export default function Home() {
  const [formData, setFormData] = useState({
    nama: "",
    no_telp: "",
    alamat: "",
    kotaKelahiran: "",
    tanggalLahir: "",
    umur: "",
    jenisKelamin: "",
    namaTravel: "",
    tanggalKeberangkatan: "",
    asalTravel: "",
    // Vaccine fields disabled
    // selectedVaccines: [],
    // ppTest: false,
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const namaInputRef = useRef(null);

  // Focus pada nama input saat component mount (refresh)
  useEffect(() => {
    if (namaInputRef.current) {
      namaInputRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "tanggalLahir") {
      try {
        const age = calculateAge(value);
        setFormData((prevData) => ({
          ...prevData,
          umur: age,
        }));
        setError("");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Disabled vaccine checkbox handler
  // const handleCheckboxChange = (e) => {
  //   const { name, value, checked } = e.target;
  //   // ... vaccine handling code disabled
  // };

  const handleDateChange = (name, value) => {
    if (value === "") {
      setFormData({ ...formData, [name]: "" });
      if (name === "tanggalLahir") {
        setFormData((prevData) => ({
          ...prevData,
          [name]: "",
          umur: "",
        }));
      }
      return;
    }

    const previousValue = formData[name];

    // Handle backspace on separator
    if (value.length < previousValue.length) {
      if (previousValue.charAt(value.length) === "/") {
        const newValue = previousValue.substring(0, value.length - 1);
        setFormData({ ...formData, [name]: newValue });

        if (name === "tanggalLahir") {
          try {
            const age = calculateAgeFromDDMMYYYY(newValue);
            setFormData((prevData) => ({
              ...prevData,
              [name]: newValue,
              umur: age,
            }));
            setError("");
          } catch (err) {
            setError(err.message);
          }
        }
        return;
      } else {
        setFormData({ ...formData, [name]: value });
        if (name === "tanggalLahir") {
          try {
            const age = calculateAgeFromDDMMYYYY(value);
            setFormData((prevData) => ({
              ...prevData,
              [name]: value,
              umur: age,
            }));
            setError("");
          } catch (err) {
            setError(err.message);
          }
        }
        return;
      }
    }

    // Format the input
    const formattedValue = formatDateInput(value);
    setFormData({ ...formData, [name]: formattedValue });

    if (name === "tanggalLahir") {
      try {
        const age = calculateAgeFromDDMMYYYY(formattedValue);
        setFormData((prevData) => ({
          ...prevData,
          [name]: formattedValue,
          umur: age,
        }));
        setError("");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Disabled pricing functions
  // const calculateTotalPrice = () => { ... }
  // const formatVaccineSelection = () => { ... }

  const generateWordDocument = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form dates using utils (now only validates nama as required)
    const validation = validateFormDates(formData);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    // Vaccine validation disabled
    // const selectedVaccines = formData.selectedVaccines || [];
    // ... vaccine validation code disabled

    try {
      setIsLoading(true);

      // Capitalize form data using utils
      const capitalizedFormData = capitalizeFormData(formData);

      // Pricing calculation disabled
      // const totalHarga = calculateTotalPrice();
      // const jenisVaksin = formatVaccineSelection();

      // Send basic form data without vaccine/pricing info
      const formDataToSend = {
        ...capitalizedFormData,
        // jenisVaksin: "", // Disabled
        // totalHarga: 0,   // Disabled
      };

      const response = await fetch("/api/generate-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("Gagal menyimpan dokumen");
        throw new Error(errorData.error || "Gagal menghasilkan dokumen");
      }

      const data = await response.json();
      toast.success(data.message || "Dokumen berhasil dibuat dan disimpan");

      // Reset form
      setFormData({
        nama: "",
        no_telp: "",
        alamat: "",
        kotaKelahiran: "",
        tanggalLahir: "",
        umur: "",
        jenisKelamin: "",
        namaTravel: "",
        tanggalKeberangkatan: "",
        asalTravel: "",
        // selectedVaccines: [], // Disabled
        // ppTest: false,        // Disabled
      });

      // Focus kembali ke nama input setelah submit berhasil
      setTimeout(() => {
        if (namaInputRef.current) {
          namaInputRef.current.focus();
        }
      }, 100);
    } catch (error) {
      console.error("Error:", error);
      setError("Gagal membuat dokumen: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-4 px-1 sm:p-6">
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <div className="p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            Form Persetujuan dan Permohonan Vaksin
          </h1>

          <ErrorMessage message={error} />

          <form onSubmit={generateWordDocument} className="space-y-5">
            <PersonalInfoSection
              formData={formData}
              handleChange={handleChange}
              handleDateChange={handleDateChange}
              namaInputRef={namaInputRef}
            />

            <TravelInfoSection
              formData={formData}
              handleChange={handleChange}
              handleDateChange={handleDateChange}
            />

            {/* VaccineInfoSection disabled */}
            {/* <VaccineInfoSection
              formData={formData}
              handleCheckboxChange={handleCheckboxChange}
            /> */}

            <SubmitButton isLoading={isLoading} />
          </form>
        </div>
      </div>
    </div>
  );
}
