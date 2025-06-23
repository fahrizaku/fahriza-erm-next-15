/**
 * Utility functions for text manipulation
 */

/**
 * Capitalize each word in a text string (Title Case)
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text or original if invalid
 */
export const capitalizeText = (text) => {
  if (!text || typeof text !== "string") return text;

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Convert name to uppercase
 * @param {string} name - Name to convert to uppercase
 * @returns {string} Uppercase name or original if invalid
 */
export const uppercaseName = (name) => {
  if (!name || typeof name !== "string") return name;

  return name.toUpperCase().trim();
};

/**
 * Capitalize specific fields in form data
 * @param {object} formData - Form data object
 * @returns {object} Form data with capitalized text fields
 */
export const capitalizeFormData = (formData) => {
  return {
    ...formData,
    nama: uppercaseName(formData.nama), // Nama menggunakan UPPERCASE
    alamat: capitalizeText(formData.alamat), // Alamat menggunakan Title Case
    kotaKelahiran: capitalizeText(formData.kotaKelahiran), // Kota menggunakan Title Case
    jenisKelamin: capitalizeText(formData.jenisKelamin), // Jenis kelamin menggunakan Title Case
    namaTravel: capitalizeText(formData.namaTravel), // Nama travel menggunakan Title Case
    asalTravel: capitalizeText(formData.asalTravel), // Asal travel menggunakan Title Case
    // Field yang tidak perlu di-capitalize (angka dan tanggal tetap sama)
    no_telp: formData.no_telp,
    tanggalLahir: formData.tanggalLahir,
    umur: formData.umur,
    tanggalKeberangkatan: formData.tanggalKeberangkatan,
  };
};

/**
 * Clean and format phone number
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} Cleaned phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "";

  // Remove all non-digit characters
  return phoneNumber.replace(/\D/g, "");
};

/**
 * Validate and format name input
 * @param {string} name - Name input
 * @returns {string} Formatted name
 */
export const formatNameInput = (name) => {
  if (!name) return "";

  // Remove extra spaces and limit to letters and spaces
  return name
    .replace(/[^a-zA-Z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};
