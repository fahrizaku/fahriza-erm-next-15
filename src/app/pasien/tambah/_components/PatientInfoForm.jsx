import React from "react";
import { Shield, MapPin, FileText, CreditCard } from "lucide-react";
import SeparatedDateInput from "./SeparatedDateInput";

const PatientInfoForm = ({
  formData,
  handleInputChange,
  isBPJS,
  handleBPJSChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-4">
        <PersonalInformationFields
          formData={formData}
          handleInputChange={handleInputChange}
        />

        {/* BPJS checkbox */}
        <div className="mt-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isBPJS"
              checked={isBPJS}
              onChange={handleBPJSChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isBPJS"
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              Pasien BPJS
            </label>
          </div>
        </div>

        {/* BPJS Number (only shown if BPJS is checked) */}
        {isBPJS && (
          <BPJSField
            value={formData.no_bpjs}
            onChange={handleInputChange}
            required={isBPJS}
          />
        )}
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        <AdditionalInformationFields
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  );
};

// Sub-component for Personal Information fields
const PersonalInformationFields = ({ formData, handleInputChange }) => {
  return (
    <>
      {/* Name input */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nama Lengkap <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Masukkan nama lengkap"
          required
        />
      </div>

      {/* Gender selection */}
      <div>
        <label
          htmlFor="gender"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Jenis Kelamin
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Pilih jenis kelamin</option>
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </select>
      </div>

      {/* Birth date with enhanced picker */}
      <div>
        <label
          htmlFor="birthDate"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tanggal Lahir
        </label>
        <SeparatedDateInput
          id="birthDate"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleInputChange}
        />
      </div>

      {/* Phone Number */}
      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nomor Telepon
        </label>
        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Masukkan nomor telepon"
        />
      </div>
    </>
  );
};

// Sub-component for BPJS field
const BPJSField = ({ value, onChange, required }) => {
  return (
    <div>
      <label
        htmlFor="no_bpjs"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Nomor BPJS <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          id="no_bpjs"
          name="no_bpjs"
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Masukkan nomor BPJS"
          required={required}
        />
      </div>
    </div>
  );
};

// Sub-component for Additional Information fields
const AdditionalInformationFields = ({ formData, handleInputChange }) => {
  return (
    <>
      {/* Address */}
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Alamat
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Masukkan alamat lengkap"
          ></textarea>
        </div>
      </div>

      {/* RM Number (readonly) */}
      <div>
        <label
          htmlFor="no_rm"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nomor RM
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            id="no_rm"
            name="no_rm"
            value={formData.no_rm}
            readOnly
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 cursor-not-allowed"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Nomor RM diberikan secara otomatis
        </p>
      </div>

      {/* NIK */}
      <div>
        <label
          htmlFor="nik"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          NIK (Nomor Induk Kependudukan)
        </label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            id="nik"
            name="nik"
            value={formData.nik}
            onChange={handleInputChange}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Masukkan NIK"
          />
        </div>
      </div>
    </>
  );
};

export default PatientInfoForm;
