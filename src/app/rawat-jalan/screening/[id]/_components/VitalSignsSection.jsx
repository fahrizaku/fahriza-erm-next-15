import React, { useState } from "react";
import {
  Thermometer,
  Activity,
  Heart,
  HeartPulse,
  Weight,
  Ruler,
  Percent,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function VitalSignsSection({ screening, handleInputChange }) {
  const [showMore, setShowMore] = useState(false);

  // Prevent scroll wheel from changing input values
  const preventWheelChange = (e) => {
    // Prevent the default scroll behavior on number inputs
    e.target.blur();
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
      <h3 className="text-md font-semibold text-gray-800 mb-4">Tanda Vital</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Always visible vital signs */}

        {/* Blood Pressure - split into systolic and diastolic */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-2 text-blue-500" />
              <span>Tekanan Darah (mmHg)</span>
            </div>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="systolicBP"
              value={screening.systolicBP}
              onChange={handleInputChange}
              onWheel={preventWheelChange}
              min="70"
              max="250"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="120"
            />
            <span className="text-gray-500">/</span>
            <input
              type="number"
              name="diastolicBP"
              value={screening.diastolicBP}
              onChange={handleInputChange}
              onWheel={preventWheelChange}
              min="40"
              max="150"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="80"
            />
          </div>
        </div>

        {/* Temperature */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <Thermometer className="h-4 w-4 mr-2 text-red-500" />
              <span>Suhu Tubuh (°C)</span>
            </div>
          </label>
          <input
            type="number"
            name="temperature"
            value={screening.temperature}
            onChange={handleInputChange}
            onWheel={preventWheelChange}
            step="0.1"
            min="35"
            max="42"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="36.5"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <Weight className="h-4 w-4 mr-2 text-green-500" />
              <span>Berat Badan (kg)</span>
            </div>
          </label>
          <input
            type="number"
            name="weight"
            value={screening.weight}
            onChange={handleInputChange}
            onWheel={preventWheelChange}
            step="0.1"
            min="0"
            max="300"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="70"
          />
        </div>

        {/* Height */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <Ruler className="h-4 w-4 mr-2 text-green-500" />
              <span>Tinggi Badan (cm)</span>
            </div>
          </label>
          <input
            type="number"
            name="height"
            value={screening.height}
            onChange={handleInputChange}
            onWheel={preventWheelChange}
            min="0"
            max="300"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="170"
          />
        </div>
      </div>

      {/* Show More/Less button */}
      <button
        type="button"
        onClick={() => setShowMore(!showMore)}
        className="mt-4 flex items-center justify-center w-full text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
      >
        <span>{showMore ? "Sembunyikan" : "Tampilkan Lengkap"}</span>
        {showMore ? (
          <ChevronUp className="ml-1 h-4 w-4" />
        ) : (
          <ChevronDown className="ml-1 h-4 w-4" />
        )}
      </button>

      {/* Additional vital signs (hidden by default) */}
      {showMore && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Pulse */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-2 text-red-500" />
                <span>Denyut Nadi (bpm)</span>
              </div>
            </label>
            <input
              type="number"
              name="pulse"
              value={screening.pulse}
              onChange={handleInputChange}
              onWheel={preventWheelChange}
              min="40"
              max="200"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="80"
            />
          </div>

          {/* Respiratory Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <HeartPulse className="h-4 w-4 mr-2 text-blue-500" />
                <span>Pernapasan (rpm)</span>
              </div>
            </label>
            <input
              type="number"
              name="respiratoryRate"
              value={screening.respiratoryRate}
              onChange={handleInputChange}
              onWheel={preventWheelChange}
              min="8"
              max="40"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="16"
            />
          </div>

          {/* Waist Circumference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Activity className="h-4 w-4 mr-2 text-yellow-500" />
                <span>Lingkar Pinggang (cm)</span>
              </div>
            </label>
            <input
              type="number"
              name="waistCircumference"
              value={screening.waistCircumference}
              onChange={handleInputChange}
              onWheel={preventWheelChange}
              step="0.1"
              min="0"
              max="200"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="80"
            />
          </div>

          {/* Oxygen Saturation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Percent className="h-4 w-4 mr-2 text-blue-500" />
                <span>Saturasi Oksigen (%)</span>
              </div>
            </label>
            <input
              type="number"
              name="oxygenSaturation"
              value={screening.oxygenSaturation}
              onChange={handleInputChange}
              onWheel={preventWheelChange}
              step="0.1"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="98"
            />
          </div>
        </div>
      )}
    </div>
  );
}
