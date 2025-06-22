// components/TravelInfoSection.js
import { FormInput } from "./FormInput";
import { DateInput } from "./DateInput";

export const TravelInfoSection = ({
  formData,
  handleChange,
  handleDateChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <FormInput
        label="Nama Travel"
        name="namaTravel"
        value={formData.namaTravel}
        onChange={handleChange}
        placeholder="Masukkan nama travel"
      />

      <FormInput
        label="Asal Travel"
        name="asalTravel"
        value={formData.asalTravel}
        onChange={handleChange}
        placeholder="Masukkan asal travel"
      />

      <DateInput
        label="Tanggal Keberangkatan"
        name="tanggalKeberangkatan"
        value={formData.tanggalKeberangkatan}
        onChange={handleDateChange}
        helpText="Format: dd/mm/yyyy"
      />
    </div>
  );
};
