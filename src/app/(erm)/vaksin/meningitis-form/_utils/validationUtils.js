// _utils/validationUtils.js - Updated with vaccine validation

/**
 * Validate all form dates and required fields
 * @param {Object} formData - Form data object
 * @returns {Object} Validation result with isValid and error message
 */
export function validateFormDates(formData) {
  // Validate required personal info
  const requiredPersonalFields = [
    { field: "nama", label: "Nama" },
    { field: "no_telp", label: "Nomor Telepon" },
    { field: "alamat", label: "Alamat" },
    { field: "kotaKelahiran", label: "Kota Kelahiran" },
    { field: "tanggalLahir", label: "Tanggal Lahir" },
    { field: "jenisKelamin", label: "Jenis Kelamin" },
  ];

  for (const { field, label } of requiredPersonalFields) {
    if (!formData[field] || formData[field].trim() === "") {
      return {
        isValid: false,
        error: `${label} harus diisi`,
      };
    }
  }

  // Validate required travel info
  const requiredTravelFields = [
    { field: "namaTravel", label: "Nama Travel" },
    { field: "tanggalKeberangkatan", label: "Tanggal Keberangkatan" },
    { field: "asalTravel", label: "Asal Travel" },
  ];

  for (const { field, label } of requiredTravelFields) {
    if (!formData[field] || formData[field].trim() === "") {
      return {
        isValid: false,
        error: `${label} harus diisi`,
      };
    }
  }

  // Validate vaccine selection
  if (!formData.jenisVaksin || formData.jenisVaksin.trim() === "") {
    return {
      isValid: false,
      error: "Jenis vaksin harus dipilih",
    };
  }

  // Validate birth date format (DD/MM/YYYY)
  const birthDatePattern = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!birthDatePattern.test(formData.tanggalLahir)) {
    return {
      isValid: false,
      error: "Format tanggal lahir tidak valid (gunakan DD/MM/YYYY)",
    };
  }

  // Validate departure date format (DD/MM/YYYY)
  if (!birthDatePattern.test(formData.tanggalKeberangkatan)) {
    return {
      isValid: false,
      error: "Format tanggal keberangkatan tidak valid (gunakan DD/MM/YYYY)",
    };
  }

  // Validate date values
  const birthDateValidation = validateDateString(formData.tanggalLahir);
  if (!birthDateValidation.isValid) {
    return {
      isValid: false,
      error: `Tanggal lahir tidak valid: ${birthDateValidation.error}`,
    };
  }

  const departureDateValidation = validateDateString(
    formData.tanggalKeberangkatan
  );
  if (!departureDateValidation.isValid) {
    return {
      isValid: false,
      error: `Tanggal keberangkatan tidak valid: ${departureDateValidation.error}`,
    };
  }

  // Validate that departure date is in the future
  const today = new Date();
  const departureDate = parseDateString(formData.tanggalKeberangkatan);

  if (departureDate <= today) {
    return {
      isValid: false,
      error: "Tanggal keberangkatan harus di masa depan",
    };
  }

  // Validate age (must be reasonable)
  const age = parseInt(formData.umur);
  if (isNaN(age) || age < 0 || age > 150) {
    return {
      isValid: false,
      error: "Umur tidak valid",
    };
  }

  // Validate phone number (basic validation)
  const phonePattern = /^[0-9+\-\s()]+$/;
  if (!phonePattern.test(formData.no_telp)) {
    return {
      isValid: false,
      error: "Format nomor telepon tidak valid",
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate a date string in DD/MM/YYYY format
 * @param {string} dateString - Date string to validate
 * @returns {Object} Validation result
 */
function validateDateString(dateString) {
  if (!dateString || dateString.length !== 10) {
    return {
      isValid: false,
      error: "Format tanggal harus DD/MM/YYYY",
    };
  }

  const [day, month, year] = dateString
    .split("/")
    .map((num) => parseInt(num, 10));

  // Validate year
  if (year < 1900 || year > new Date().getFullYear() + 10) {
    return {
      isValid: false,
      error: "Tahun tidak valid",
    };
  }

  // Validate month
  if (month < 1 || month > 12) {
    return {
      isValid: false,
      error: "Bulan tidak valid",
    };
  }

  // Validate day
  if (day < 1 || day > 31) {
    return {
      isValid: false,
      error: "Tanggal tidak valid",
    };
  }

  // Check if date is valid using JavaScript Date
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return {
      isValid: false,
      error: "Tanggal tidak valid untuk bulan dan tahun tersebut",
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Parse date string from DD/MM/YYYY to Date object
 * @param {string} dateString - Date string in DD/MM/YYYY format
 * @returns {Date} Date object
 */
function parseDateString(dateString) {
  const [day, month, year] = dateString
    .split("/")
    .map((num) => parseInt(num, 10));
  return new Date(year, month - 1, day);
}

/**
 * Validate vaccine type
 * @param {string} jenisVaksin - Vaccine type
 * @returns {boolean} Is valid vaccine type
 */
export function validateVaccineType(jenisVaksin) {
  const validTypes = [
    "meningitis",
    "polio",
    "influenza",
    "meningitis+influenza",
  ];
  return validTypes.includes(jenisVaksin);
}
