"use client";

import { useState } from "react";
import { toast } from "react-toastify";

// Import komponen yang sudah dipisah
import { ErrorMessage } from "./_components/ErrorMessage";
import { PersonalInfoSection } from "./_components/PersonalInfoSection";
import { TravelInfoSection } from "./_components/TravelInfoSection";
import { SubmitButton } from "./_components/SubmitButton";

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
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "tanggalLahir") {
      const age = calculateAge(value);
      setFormData((prevData) => ({
        ...prevData,
        umur: age,
      }));
    }
  };

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

    if (value.length < previousValue.length) {
      if (previousValue.charAt(value.length) === "/") {
        const newValue = previousValue.substring(0, value.length - 1);
        setFormData({ ...formData, [name]: newValue });

        if (name === "tanggalLahir") {
          const age = calculateAgeFromDDMMYYYY(newValue);
          setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
            umur: age,
          }));
        }
        return;
      } else {
        setFormData({ ...formData, [name]: value });
        if (name === "tanggalLahir") {
          const age = calculateAgeFromDDMMYYYY(value);
          setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            umur: age,
          }));
        }
        return;
      }
    }

    let formattedValue = value.replace(/\D/g, "");

    if (formattedValue.length > 8) {
      formattedValue = formattedValue.substring(0, 8);
    }

    if (formattedValue.length >= 2) {
      formattedValue =
        formattedValue.substring(0, 2) + "/" + formattedValue.substring(2);
    }
    if (formattedValue.length >= 5) {
      formattedValue =
        formattedValue.substring(0, 5) + "/" + formattedValue.substring(5, 9);
    }

    setFormData({ ...formData, [name]: formattedValue });

    if (name === "tanggalLahir") {
      const age = calculateAgeFromDDMMYYYY(formattedValue);
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
        umur: age,
      }));
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "";

    try {
      const birthDateObj = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDateObj.getFullYear();
      const monthDifference = today.getMonth() - birthDateObj.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
      ) {
        age--;
      }

      setError("");
      return age.toString();
    } catch (err) {
      setError("Format tanggal tidak valid");
      return "";
    }
  };

  const calculateAgeFromDDMMYYYY = (dateString) => {
    if (!dateString || dateString.length !== 10) return "";

    try {
      const [day, month, year] = dateString.split("/");
      if (!day || !month || !year) return "";

      const birthDateObj = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );
      const today = new Date();
      let age = today.getFullYear() - birthDateObj.getFullYear();
      const monthDifference = today.getMonth() - birthDateObj.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
      ) {
        age--;
      }

      setError("");
      return age.toString();
    } catch (err) {
      setError("Format tanggal tidak valid");
      return "";
    }
  };

  const isValidDate = (dateString) => {
    if (!dateString || dateString.length !== 10) return false;

    const [day, month, year] = dateString.split("/");
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (dayNum < 1 || dayNum > 31) return false;
    if (monthNum < 1 || monthNum > 12) return false;
    if (yearNum < 1900 || yearNum > new Date().getFullYear()) return false;

    const date = new Date(yearNum, monthNum - 1, dayNum);
    return (
      date.getDate() === dayNum &&
      date.getMonth() === monthNum - 1 &&
      date.getFullYear() === yearNum
    );
  };

  const generateWordDocument = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.tanggalLahir && !isValidDate(formData.tanggalLahir)) {
      setError("Format tanggal lahir tidak valid. Gunakan format dd/mm/yyyy");
      return;
    }

    if (
      formData.tanggalKeberangkatan &&
      !isValidDate(formData.tanggalKeberangkatan)
    ) {
      setError(
        "Format tanggal keberangkatan tidak valid. Gunakan format dd/mm/yyyy"
      );
      return;
    }

    try {
      setIsLoading(true);

      // Fungsi untuk capitalize teks
      const capitalizeText = (text) => {
        if (!text || typeof text !== "string") return text;
        return text
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      };

      // Capitalize data teks sebelum dikirim ke API
      const capitalizedFormData = {
        ...formData,
        nama: capitalizeText(formData.nama),
        alamat: capitalizeText(formData.alamat),
        kotaKelahiran: capitalizeText(formData.kotaKelahiran),
        jenisKelamin: capitalizeText(formData.jenisKelamin),
        namaTravel: capitalizeText(formData.namaTravel),
        asalTravel: capitalizeText(formData.asalTravel),
        // Field yang tidak perlu di-capitalize (angka dan tanggal tetap sama)
        no_telp: formData.no_telp,
        tanggalLahir: formData.tanggalLahir,
        umur: formData.umur,
        tanggalKeberangkatan: formData.tanggalKeberangkatan,
      };

      const response = await fetch("/api/generate-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(capitalizedFormData), // Kirim data yang sudah di-capitalize
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
      });
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
            Form Persetujuan dan Permohonan Vaksin Meningitis
          </h1>

          <ErrorMessage message={error} />

          <form onSubmit={generateWordDocument} className="space-y-5">
            <PersonalInfoSection
              formData={formData}
              handleChange={handleChange}
              handleDateChange={handleDateChange}
            />

            <TravelInfoSection
              formData={formData}
              handleChange={handleChange}
              handleDateChange={handleDateChange}
            />

            <SubmitButton isLoading={isLoading} />
          </form>
        </div>
      </div>
    </div>
  );
}
