// _utils/pricingUtils.js

export const VACCINE_PRICES = {
  meningitis: 350000,
  polio: 250000,
  influenza: 220000,
  "meningitis+influenza": 550000, // 350000 + 200000 (discounted influenza)
};

export const PP_TEST_PRICE = 20000;

/**
 * Calculate total price based on vaccine type and PP test
 * @param {string} jenisVaksin - Type of vaccine
 * @param {boolean} ppTest - Whether PP test is included
 * @returns {number} Total price
 */
export function calculateTotalPrice(jenisVaksin, ppTest = false) {
  const basePrice = VACCINE_PRICES[jenisVaksin] || 0;
  const ppTestPrice = ppTest ? PP_TEST_PRICE : 0;
  return basePrice + ppTestPrice;
}

/**
 * Get vaccine price info for display
 * @param {string} jenisVaksin - Type of vaccine
 * @returns {object} Price information
 */
export function getVaccinePriceInfo(jenisVaksin) {
  const basePrice = VACCINE_PRICES[jenisVaksin] || 0;

  return {
    basePrice,
    formattedPrice: formatCurrency(basePrice),
    ppTestPrice: PP_TEST_PRICE,
    formattedPpTestPrice: formatCurrency(PP_TEST_PRICE),
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
    {
      value: "meningitis+influenza",
      label: "Meningitis + Influenza",
      price: VACCINE_PRICES["meningitis+influenza"],
      note: "Diskon khusus untuk kombinasi",
    },
  ];
}
