// app/rekam-medis/[id]/components/VitalsSection.jsx
import React from "react";
import { formatBloodPressure } from "../utils/formatters";

export default function VitalsSection({ screening }) {
  if (!screening) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Keluhan dan Tanda Vital
      </h3>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 print:bg-white">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-1">
            Keluhan Pasien:
          </h4>
          <p className="text-gray-800">{screening.complaints}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {screening.temperature && (
            <div>
              <h4 className="text-xs font-medium text-gray-500">Suhu</h4>
              <p className="text-sm font-medium">{screening.temperature}°C</p>
            </div>
          )}

          {screening.systolicBP && screening.diastolicBP && (
            <div>
              <h4 className="text-xs font-medium text-gray-500">
                Tekanan Darah
              </h4>
              <p className="text-sm font-medium">
                {formatBloodPressure(
                  screening.systolicBP,
                  screening.diastolicBP
                )}{" "}
                mmHg
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
        </div>
      </div>
    </div>
  );
}
