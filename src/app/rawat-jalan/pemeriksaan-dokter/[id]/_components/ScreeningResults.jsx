import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ScreeningResults = ({ screening }) => {
  const [showMore, setShowMore] = useState(false);

  if (!screening) return null;

  // Format blood pressure from separate systolic and diastolic values
  const bloodPressure =
    screening.systolicBP && screening.diastolicBP
      ? `${screening.systolicBP}/${screening.diastolicBP}`
      : null;

  return (
    <div className="p-5 border-b border-gray-200 bg-gray-50">
      <h3 className="text-md font-semibold text-gray-800 mb-3">
        Hasil Skrining
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-600">Keluhan Pasien:</h4>
          <p className="mt-1 text-gray-800">{screening.complaints}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Always visible vital signs */}
          {bloodPressure && (
            <div>
              <h4 className="text-xs font-medium text-gray-500">
                Tekanan Darah
              </h4>
              <p className="text-sm font-medium">{bloodPressure} mmHg</p>
            </div>
          )}

          {screening.temperature && (
            <div>
              <h4 className="text-xs font-medium text-gray-500">Suhu</h4>
              <p className="text-sm font-medium">{screening.temperature}°C</p>
            </div>
          )}

          {screening.weight && (
            <div>
              <h4 className="text-xs font-medium text-gray-500">Berat Badan</h4>
              <p className="text-sm font-medium">{screening.weight} kg</p>
            </div>
          )}

          {screening.height && (
            <div>
              <h4 className="text-xs font-medium text-gray-500">
                Tinggi Badan
              </h4>
              <p className="text-sm font-medium">{screening.height} cm</p>
            </div>
          )}
        </div>
      </div>

      {/* Show More/Less button */}
      {(screening.pulse ||
        screening.respiratoryRate ||
        screening.waistCircumference ||
        screening.oxygenSaturation) && (
        <button
          type="button"
          onClick={() => setShowMore(!showMore)}
          className="mt-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
        >
          <span>{showMore ? "Sembunyikan" : "Tampilkan Lengkap"}</span>
          {showMore ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-1 h-4 w-4" />
          )}
        </button>
      )}

      {/* Additional vital signs (hidden by default) */}
      {showMore && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
          {screening.pulse && (
            <div>
              <h4 className="text-xs font-medium text-gray-500">Denyut Nadi</h4>
              <p className="text-sm font-medium">{screening.pulse} bpm</p>
            </div>
          )}

          {screening.respiratoryRate && (
            <div>
              <h4 className="text-xs font-medium text-gray-500">Pernapasan</h4>
              <p className="text-sm font-medium">
                {screening.respiratoryRate} rpm
              </p>
            </div>
          )}

          {screening.waistCircumference && (
            <div>
              <h4 className="text-xs font-medium text-gray-500">
                Lingkar Pinggang
              </h4>
              <p className="text-sm font-medium">
                {screening.waistCircumference} cm
              </p>
            </div>
          )}

          {screening.oxygenSaturation && (
            <div>
              <h4 className="text-xs font-medium text-gray-500">
                Saturasi Oksigen
              </h4>
              <p className="text-sm font-medium">
                {screening.oxygenSaturation}%
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScreeningResults;
