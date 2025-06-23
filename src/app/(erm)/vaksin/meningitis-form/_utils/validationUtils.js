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

  return { isValid: true, error: "" };
};

/**
 * Validate all form dates
 * @param {object} formData - Form data object
 * @returns {object} Validation result with isValid and error message
 */
export const validateFormDates = (formData) => {
  const birthDateValidation = validateBirthDate(formData.tanggalLahir);
  if (!birthDateValidation.isValid) {
    return birthDateValidation;
  }

  const departureDateValidation = validateDepartureDate(
    formData.tanggalKeberangkatan
  );
  if (!departureDateValidation.isValid) {
    return departureDateValidation;
  }

  return { isValid: true, error: "" };
};
