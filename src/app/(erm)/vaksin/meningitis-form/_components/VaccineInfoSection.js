// _components/VaccineInfoSection.js
import { formatCurrency } from "../_utils/pricingUtils";

export function VaccineInfoSection({ formData, handleCheckboxChange }) {
  const vaccineOptions = [
    { value: "meningitis", label: "Meningitis", price: 350000 },
    { value: "polio", label: "Polio", price: 250000 },
    { value: "influenza", label: "Influenza", price: 220000 },
  ];

  // Calculate total price based on selected vaccines
  const calculateTotalPrice = () => {
    let total = 0;
    const selectedVaccines = formData.selectedVaccines || [];

    // Calculate vaccine prices
    selectedVaccines.forEach((vaccine) => {
      const vaccineOption = vaccineOptions.find(
        (option) => option.value === vaccine
      );
      if (vaccineOption) {
        // Apply discount for influenza if meningitis is also selected
        if (
          vaccine === "influenza" &&
          selectedVaccines.includes("meningitis")
        ) {
          total += 200000; // Discounted price
        } else {
          total += vaccineOption.price;
        }
      }
    });

    // Add PP test price
    if (formData.ppTest) {
      total += 20000;
    }

    return total;
  };

  const totalPrice = calculateTotalPrice();
  const selectedVaccines = formData.selectedVaccines || [];

  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Informasi Vaksin
      </h2>

      {/* Jenis Vaksin - Multiple Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jenis Vaksin (dapat pilih lebih dari satu)
        </label>
        <div className="space-y-3">
          {vaccineOptions.map((option) => {
            const isInfluenza = option.value === "influenza";
            const hasMenungitis = selectedVaccines.includes("meningitis");
            const displayPrice =
              isInfluenza && hasMenungitis ? 200000 : option.price;
            const hasDiscount = isInfluenza && hasMenungitis;

            return (
              <div key={option.value} className="flex items-start">
                <input
                  type="checkbox"
                  id={option.value}
                  name="selectedVaccines"
                  value={option.value}
                  checked={selectedVaccines.includes(option.value)}
                  onChange={handleCheckboxChange}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={option.value} className="ml-3 block text-sm">
                  <div className="font-medium text-gray-900">
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {hasDiscount && (
                      <span className="line-through text-gray-400 mr-2">
                        {formatCurrency(option.price)}
                      </span>
                    )}
                    <span
                      className={
                        hasDiscount ? "text-green-600 font-medium" : ""
                      }
                    >
                      {formatCurrency(displayPrice)}
                    </span>
                    {hasDiscount && (
                      <span className="ml-2 text-xs text-green-600 font-medium">
                        (Diskon kombinasi dengan Meningitis)
                      </span>
                    )}
                  </div>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* PP Test */}
      <div className="mb-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="ppTest"
            name="ppTest"
            checked={formData.ppTest || false}
            onChange={handleCheckboxChange}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="ppTest" className="ml-3 block text-sm">
            <div className="font-medium text-gray-900">PP Test</div>
            <div className="text-sm text-gray-600">
              Tambahan {formatCurrency(20000)}
            </div>
          </label>
        </div>
      </div>

      {/* Total Harga */}
      {(selectedVaccines.length > 0 || formData.ppTest) && (
        <div className="bg-white p-3 rounded border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total Harga:</span>
            <span className="text-lg font-semibold text-blue-600">
              {formatCurrency(totalPrice)}
            </span>
          </div>
          {selectedVaccines.length > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              Vaksin:{" "}
              {selectedVaccines
                .map((vaccine) => {
                  const option = vaccineOptions.find(
                    (opt) => opt.value === vaccine
                  );
                  return option ? option.label : vaccine;
                })
                .join(", ")}
              {formData.ppTest && " + PP Test"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
