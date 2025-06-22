// components/PersonalInfoSection.js
import { FormInput, FormSelect, FormTextarea } from "./FormInput";
import { DateInput } from "./DateInput";

export const PersonalInfoSection = ({
  formData,
  handleChange,
  handleDateChange,
}) => {
  const genderOptions = [
    { value: "Laki-laki", label: "Laki-laki" },
    { value: "Perempuan", label: "Perempuan" },
  ];

  return (
    <div className="space-y-5">
      {/* Nama */}
      <FormInput
        label="Nama Lengkap"
        name="nama"
        value={formData.nama}
        onChange={handleChange}
        placeholder="Masukkan nama lengkap"
        required
      />

      {/* Nomor Telepon */}
      <FormInput
        label="Nomor Telepon"
        name="no_telp"
        value={formData.no_telp}
        onChange={handleChange}
        placeholder="Masukkan nomor telepon (contoh: 081234567890)"
        type="tel"
      />

      {/* Tanggal Lahir dan Umur */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DateInput
          label="Tanggal Lahir"
          name="tanggalLahir"
          value={formData.tanggalLahir}
          onChange={handleDateChange}
          helpText="Format: dd/mm/yyyy (contoh: 25/12/1990)"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Umur
          </label>
          <div className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            {formData.umur || "-"}
          </div>
        </div>
      </div>

      {/* Kota Kelahiran dan Jenis Kelamin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Kota Kelahiran"
          name="kotaKelahiran"
          value={formData.kotaKelahiran}
          onChange={handleChange}
          placeholder="Masukkan kota kelahiran"
        />
        <FormSelect
          label="Jenis Kelamin"
          name="jenisKelamin"
          value={formData.jenisKelamin}
          onChange={handleChange}
          options={genderOptions}
          placeholder="Pilih Jenis Kelamin"
        />
      </div>

      {/* Alamat */}
      <FormTextarea
        label="Alamat"
        name="alamat"
        value={formData.alamat}
        onChange={handleChange}
        placeholder="contoh: bendorejo 1/1, pogalan, trenggalek"
      />
    </div>
  );
};
