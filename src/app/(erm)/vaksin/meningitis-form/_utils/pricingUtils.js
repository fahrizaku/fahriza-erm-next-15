// _utils/pricingUtils.js

export const VACCINE_PRICES = {
  meningitis: 350000,
  polio: 250000,
  influenza: 220000,
  influenza_with_meningitis: 200000, // Discounted price when combined with meningitis
};

export const PP_TEST_PRICE = 20000;

/**
 * Calculate total price based on selected vaccines and PP test
 * @param {Array} selectedVaccines - Array of selected vaccine types
 * @param {boolean} ppTest - Whether PP test is included
 * @returns {number} Total price
 */
export function calculateTotalPrice(selectedVaccines = [], ppTest = false) {
  let total = 0;

  // Calculate vaccine prices
  selectedVaccines.forEach((vaccine) => {
    switch (vaccine) {
      case "meningitis":
        total += VACCINE_PRICES.meningitis;
        break;
      case "polio":
        total += VACCINE_PRICES.polio;
        break;
      case "influenza":
        // Apply discount if meningitis is also selected
        if (selectedVaccines.includes("meningitis")) {
          total += VACCINE_PRICES.influenza_with_meningitis;
        } else {
          total += VACCINE_PRICES.influenza;
        }
        break;
    }
  });

  // Add PP test price
  const ppTestPrice = ppTest ? PP_TEST_PRICE : 0;
  return total + ppTestPrice;
}

/**
 * Get vaccine price info for display
 * @param {string} vaccine - Type of vaccine
 * @param {Array} selectedVaccines - Currently selected vaccines
 * @returns {object} Price information
 */
export function getVaccinePriceInfo(vaccine, selectedVaccines = []) {
  let basePrice = VACCINE_PRICES[vaccine] || 0;

  // Apply discount for influenza if meningitis is selected
  if (vaccine === "influenza" && selectedVaccines.includes("meningitis")) {
    basePrice = VACCINE_PRICES.influenza_with_meningitis;
  }

  return {
    basePrice,
    formattedPrice: formatCurrency(basePrice),
    ppTestPrice: PP_TEST_PRICE,
    formattedPpTestPrice: formatCurrency(PP_TEST_PRICE),
    hasDiscount:
      vaccine === "influenza" && selectedVaccines.includes("meningitis"),
  };
}

/**
 * Format currency to Indonesian Rupiah
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get all available vaccine options
 * @returns {Array} Array of vaccine options
 */
export function getVaccineOptions() {
  return [
    {
      value: "meningitis",
      label: "Meningitis",
      price: VACCINE_PRICES.meningitis,
    },
    { value: "polio", label: "Polio", price: VACCINE_PRICES.polio },
    { value: "influenza", label: "Influenza", price: VACCINE_PRICES.influenza },
  ];
}

/**
 * Format vaccine selection array to string for backend
 * @param {Array} selectedVaccines - Array of selected vaccines
 * @returns {string} Formatted vaccine string
 */
export function formatVaccineSelectionForBackend(selectedVaccines = []) {
  if (selectedVaccines.length === 0) return "";

  // Sort vaccines for consistent formatting
  const sortedVaccines = [...selectedVaccines].sort();
  return sortedVaccines.join("+");
}

/**
 * Parse vaccine string from backend to array
 * @param {string} vaccineString - Vaccine string from backend
 * @returns {Array} Array of vaccines
 */
export function parseVaccineStringToArray(vaccineString) {
  if (!vaccineString || vaccineString.trim() === "") return [];

  return vaccineString
    .split("+")
    .map((v) => v.trim())
    .filter((v) => v !== "");
}
