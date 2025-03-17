import React from "react";
import {
  CreditCard,
  Shield,
  InfoIcon,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";

export default function PaymentMethodSection({
  screening,
  patient,
  handlePaymentMethodChange,
  handleInputChange,
}) {
  return (
    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
      <h3 className="text-md font-semibold text-gray-800 mb-4">
        <div className="flex items-center">
          <CreditCard className="h-4 w-4 mr-2 text-purple-500" />
          <span>
            Metode Pembayaran <span className="text-red-500">*</span>
          </span>
        </div>
      </h3>

      <div className="flex flex-col gap-3">
        {/* Select dropdown for payment method */}
        <div>
          <select
            name="paymentMethod"
            value={screening.paymentMethod}
            onChange={handlePaymentMethodChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              -- Pilih Metode Pembayaran --
            </option>
            <option value="umum">Umum</option>
            <option value="bpjs">BPJS</option>
          </select>
        </div>

        {/* BPJS Information - only show if BPJS payment method selected */}
        {screening.paymentMethod === "bpjs" && (
          <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-100">
            {patient?.isBPJS ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-blue-700">
                    <Shield className="h-4 w-4 inline mr-1" />
                    Pasien terdaftar sebagai peserta BPJS
                  </p>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600">
                      No. BPJS:
                    </span>
                    <span className="ml-2 font-mono text-sm">
                      {patient.no_bpjs}
                    </span>
                  </div>
                </div>

                {/* BPJS Status Verification Section */}
                <div className="mt-2 pt-3 border-t border-blue-200">
                  <div className="flex items-start mb-2">
                    <InfoIcon className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium">Catatan:</p>
                      <p>
                        Periksa status BPJS aktif atau tidak di website BPJS
                      </p>
                      <a
                        href="https://pcarejkn.bpjs-kesehatan.go.id/eclaim"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-1"
                      >
                        <span>Cek di website BPJS</span>
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>

                  <div className="mt-2 flex items-start bg-white p-2 rounded border border-amber-200">
                    <input
                      type="checkbox"
                      id="bpjsStatusVerified"
                      name="bpjsStatusVerified"
                      checked={screening.bpjsStatusVerified}
                      onChange={handleInputChange}
                      className="h-5 w-5 mt-0.5 text-green-600 focus:ring-green-500"
                      required={
                        screening.paymentMethod === "bpjs" && patient?.isBPJS
                      }
                    />
                    <label
                      htmlFor="bpjsStatusVerified"
                      className="ml-2 block text-sm font-medium text-gray-700"
                    >
                      Saya sudah melakukan verifikasi dan status BPJS pasien{" "}
                      <span className="font-bold">aktif</span>
                      <span className="text-red-500">*</span>
                    </label>
                  </div>

                  {/* Note Section */}
                  <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-sm text-gray-700">
                      Jika status BPJS{" "}
                      <span className="font-bold">tidak aktif</span> ubah metode
                      pembayaran ke <span className="font-bold">umum</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-blue-700">
                  <AlertTriangle className="h-4 w-4 inline mr-1" />
                  Pasien belum terdaftar sebagai peserta BPJS
                </p>

                {/* Removed the checkbox, but kept the BPJS input field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor BPJS
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="no_bpjs"
                    value={screening.no_bpjs}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nomor BPJS"
                    required={screening.paymentMethod === "bpjs"}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Nomor BPJS akan ditambahkan ke data pasien
                  </p>
                </div>

                {/* BPJS Status Verification Section for New BPJS Patients */}
                <div className="mt-2 pt-3 border-t border-blue-200">
                  <div className="flex items-start mb-2">
                    <InfoIcon className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium">Catatan:</p>
                      <p>
                        Periksa status BPJS aktif atau tidak di website BPJS
                      </p>
                      <a
                        href="https://pcarejkn.bpjs-kesehatan.go.id/eclaim"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-1"
                      >
                        <span>Cek di website BPJS</span>
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>

                  <div className="mt-2 flex items-start bg-white p-2 rounded border border-amber-200">
                    <input
                      type="checkbox"
                      id="bpjsStatusVerified"
                      name="bpjsStatusVerified"
                      checked={screening.bpjsStatusVerified}
                      onChange={handleInputChange}
                      className="h-5 w-5 mt-0.5 text-green-600 focus:ring-green-500"
                      required={screening.paymentMethod === "bpjs"}
                    />
                    <label
                      htmlFor="bpjsStatusVerified"
                      className="ml-2 block text-sm font-medium text-gray-700"
                    >
                      Saya sudah melakukan verifikasi dan status BPJS pasien{" "}
                      <span className="font-bold">aktif</span>
                      <span className="text-red-500">*</span>
                    </label>
                  </div>

                  {/* Note Section */}
                  <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-sm text-gray-700">
                      Jika status BPJS{" "}
                      <span className="font-bold">tidak aktif</span> ubah metode
                      pembayaran ke <span className="font-bold">umum</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
