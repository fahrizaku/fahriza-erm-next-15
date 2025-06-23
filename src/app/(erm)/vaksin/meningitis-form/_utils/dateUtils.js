/**
 * Utility functions for date operations
 */

/**
 * Calculate age from birth date (YYYY-MM-DD format)
 * @param {string} birthDate - Birth date in YYYY-MM-DD format
 * @returns {string} Age as string or empty string if invalid
 */
export const calculateAge = (birthDate) => {
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

    return age.toString();
  } catch (err) {
    throw new Error("Format tanggal tidak valid");
  }
};

/**
 * Calculate age from DD/MM/YYYY format
 * @param {string} dateString - Date in DD/MM/YYYY format
 * @returns {string} Age as string or empty string if invalid
 */
export const calculateAgeFromDDMMYYYY = (dateString) => {
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

    return age.toString();
  } catch (err) {
    throw new Error("Format tanggal tidak valid");
  }
};

/**
 * Format date input to DD/MM/YYYY format
 * @param {string} value - Raw input value
 * @returns {string} Formatted date string
 */
export const formatDateInput = (value) => {
  if (value === "") return "";

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

  return formattedValue;
};
