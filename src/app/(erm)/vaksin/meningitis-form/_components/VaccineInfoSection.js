// _components/VaccineInfoSection.js
import {
  getVaccineOptions,
  calculateTotalPrice,
  formatCurrency,
} from "../_utils/pricingUtils";

export function VaccineInfoSection({
  formData,
  handleChange,
  handleCheckboxChange,
}) {
  const vaccineOptions = getVaccineOptions();
  const totalPrice = calculateTotalPrice(formData.jenisVaksin, formData.ppTest);

  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Informasi Vaksin
      </h2>

      {/* Jenis Vaksin */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jenis Vaksin <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          {vaccineOptions.map((option) => (
            <div key={option.value} className="flex items-start">
              <input
                type="radio"
                id={option.value}
                name="jenisVaksin"
                value={option.value}
                checked={formData.jenisVaksin === option.value}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor={option.value} className="ml-3 block text-sm">
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(option.price)}
                  {option.note && (
                    <span className="ml-2 text-xs text-green-600 font-medium">
                      ({option.note})
                    </span>
                  )}
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* PP Test */}
      <div className="mb-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="ppTest"
            name="ppTest"
            checked={formData.ppTest}
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
      {formData.jenisVaksin && (
        <div className="bg-white p-3 rounded border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total Harga:</span>
            <span className="text-lg font-semibold text-blue-600">
              {formatCurrency(totalPrice)}
            </span>
          </div>
          {formData.ppTest && (
            <div className="text-xs text-gray-500 mt-1">*Termasuk PP Test</div>
          )}
        </div>
      )}
    </div>
  );
}
