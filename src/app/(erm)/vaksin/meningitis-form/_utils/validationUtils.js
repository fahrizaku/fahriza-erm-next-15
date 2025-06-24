/**
 * Utility functions for validation
 */

/**
 * Validate date in DD/MM/YYYY format
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidDate = (dateString) => {
  if (!dateString || dateString.length !== 10) return false;

  const [day, month, year] = dateString.split("/");
  const dayNum = parseInt(day);
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);

  // Basic range validation
  if (dayNum < 1 || dayNum > 31) return false;
  if (monthNum < 1 || monthNum > 12) return false;
  if (yearNum < 1900 || yearNum > new Date().getFullYear()) return false;

  // Create date object and verify it's actually valid
  const date = new Date(yearNum, monthNum - 1, dayNum);
  return (
    date.getDate() === dayNum &&
    date.getMonth() === monthNum - 1 &&
    date.getFullYear() === yearNum
  );
};

/**
 * Validate birth date format and value
 * @param {string} birthDate - Birth date to validate
 * @returns {object} Validation result with isValid and error message
 */
export const validateBirthDate = (birthDate) => {
  if (!birthDate) {
    return { isValid: true, error: "" }; // Empty is valid (optional field)
  }

  if (!isValidDate(birthDate)) {
    return {
      isValid: false,
      error: "Format tanggal lahir tidak valid. Gunakan format dd/mm/yyyy",
    };
  }

  return { isValid: true, error: "" };
};

/**
 * Validate departure date format and value
 * @param {string} departureDate - Departure date to validate
 * @returns {object} Validation result with isValid and error message
 */
export const validateDepartureDate = (departureDate) => {
  if (!departureDate) {
    return { isValid: true, error: "" }; // Empty is valid (optional field)
  }

  if (!isValidDate(departureDate)) {
    return {
      isValid: false,
      error:
        "Format tanggal keberangkatan tidak valid. Gunakan format dd/mm/yyyy",
    };
  }

  // Check if departure date is in the future (only if date is provided)
  const [day, month, year] = departureDate.split("/");
  const depDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to compare only dates

  if (depDate <= today) {
    return {
      isValid: false,
      error: "Tanggal keberangkatan harus di masa depan",
    };
  }

  return { isValid: true, error: "" };
};

/**
 * Validate required text fields
 * @param {string} value - Field value
 * @param {string} fieldName - Field name for error message
 * @returns {object} Validation result with isValid and error message
 */
export const validateRequiredField = (value, fieldName) => {
  if (!value || value.trim() === "") {
    return {
      isValid: false,
      error: `${fieldName} harus diisi`,
    };
  }
  return { isValid: true, error: "" };
};

/**
 * Validate phone number format
 * @param {string} phoneNumber - Phone number to validate
 * @returns {object} Validation result with isValid and error message
 */
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) {
    return { isValid: true, error: "" }; // Empty is valid (optional field)
  }

  // Basic phone number pattern (numbers, +, -, spaces, parentheses)
  const phonePattern = /^[0-9+\-\s()]+$/;
  if (!phonePattern.test(phoneNumber)) {
    return {
      isValid: false,
      error: "Format nomor telepon tidak valid",
    };
  }

  // Check minimum length
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
  if (cleanNumber.length < 10) {
    return {
      isValid: false,
      error: "Nomor telepon terlalu pendek",
    };
  }

  return { isValid: true, error: "" };
};

/**
 * Validate vaccine type selection (now supports multiple selections)
 * @param {Array|string} jenisVaksin - Selected vaccine type(s)
 * @returns {object} Validation result with isValid and error message
 */
export const validateVaccineType = (jenisVaksin) => {
  if (!jenisVaksin) {
    return { isValid: true, error: "" }; // Empty is valid (optional field)
  }

  const validTypes = ["meningitis", "polio", "influenza"];

  // If it's an array (multiple selections)
  if (Array.isArray(jenisVaksin)) {
    if (jenisVaksin.length === 0) {
      return { isValid: true, error: "" }; // Empty array is valid
    }

    // Check if all selected vaccines are valid
    for (const vaccine of jenisVaksin) {
      if (!validTypes.includes(vaccine)) {
        return {
          isValid: false,
          error: `Jenis vaksin "${vaccine}" tidak valid`,
        };
      }
    }
    return { isValid: true, error: "" };
  }

  // If it's a string (single selection or combination)
  if (typeof jenisVaksin === "string") {
    if (jenisVaksin.trim() === "") {
      return { isValid: true, error: "" };
    }

    // Handle combination vaccines (e.g., "meningitis+influenza")
    if (jenisVaksin.includes("+")) {
      const vaccines = jenisVaksin.split("+").map((v) => v.trim());
      for (const vaccine of vaccines) {
        if (!validTypes.includes(vaccine)) {
          return {
            isValid: false,
            error: `Jenis vaksin "${vaccine}" tidak valid`,
          };
        }
      }
      return { isValid: true, error: "" };
    }

    // Single vaccine
    if (!validTypes.includes(jenisVaksin)) {
      return {
        isValid: false,
        error: "Jenis vaksin tidak valid",
      };
    }
  }

  return { isValid: true, error: "" };
};

/**
 * Validate age
 * @param {string} age - Age to validate
 * @returns {object} Validation result with isValid and error message
 */
export const validateAge = (age) => {
  if (!age) {
    return { isValid: true, error: "" }; // Empty is valid (optional field)
  }

  const ageNum = parseInt(age);
  if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
    return {
      isValid: false,
      error: "Umur tidak valid",
    };
  }

  return { isValid: true, error: "" };
};

/**
 * Validate all form data
 * @param {object} formData - Form data object
 * @returns {object} Validation result with isValid and error message
 */
export const validateFormDates = (formData) => {
  // Only validate required field: nama
  const nameValidation = validateRequiredField(formData.nama, "Nama");
  if (!nameValidation.isValid) {
    return nameValidation;
  }

  // Validate optional fields only if they are filled
  if (formData.no_telp && formData.no_telp.trim() !== "") {
    const phoneValidation = validatePhoneNumber(formData.no_telp);
    if (!phoneValidation.isValid) {
      return phoneValidation;
    }
  }

  // Validate birth date only if filled
  if (formData.tanggalLahir && formData.tanggalLahir.trim() !== "") {
    const birthDateValidation = validateBirthDate(formData.tanggalLahir);
    if (!birthDateValidation.isValid) {
      return birthDateValidation;
    }
  }

  // Validate age only if filled
  if (formData.umur && formData.umur.trim() !== "") {
    const ageValidation = validateAge(formData.umur);
    if (!ageValidation.isValid) {
      return ageValidation;
    }
  }

  // Validate departure date only if filled
  if (
    formData.tanggalKeberangkatan &&
    formData.tanggalKeberangkatan.trim() !== ""
  ) {
    const departureDateValidation = validateDepartureDate(
      formData.tanggalKeberangkatan
    );
    if (!departureDateValidation.isValid) {
      return departureDateValidation;
    }
  }

  // Validate vaccine type only if selected
  if (formData.jenisVaksin) {
    const vaccineValidation = validateVaccineType(formData.jenisVaksin);
    if (!vaccineValidation.isValid) {
      return vaccineValidation;
    }
  }

  return { isValid: true, error: "" };
};
