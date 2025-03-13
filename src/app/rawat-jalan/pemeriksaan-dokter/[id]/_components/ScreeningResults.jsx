import React from "react";

const ScreeningResults = ({ screening }) => {
  if (!screening) return null;

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
          {screening.temperature && (
            <div>
              <h4 className="text-xs font-medium text-gray-500">Suhu</h4>
              <p className="text-sm font-medium">{screening.temperature}°C</p>
            </div>
          )}

          {screening.bloodPressure && (
            <div>
              <h4 className="text-xs font-medium text-gray-500">
                Tekanan Darah
              </h4>
              <p className="text-sm font-medium">
                {screening.bloodPressure} mmHg
              </p>
            </div>
          )}

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
    </div>
  );
};

export default ScreeningResults;
