import { useState } from "react";

export const useMedicalRecord = () => {
  // Medical record state
  const [medicalRecord, setMedicalRecord] = useState({
    diagnosis: "",
    icdCode: "",
    clinicalNotes: "",
    doctorName: "",
  });

  // Handle medical record input changes
  const handleMedicalRecordChange = (e) => {
    const { name, value } = e.target;
    setMedicalRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return { medicalRecord, setMedicalRecord, handleMedicalRecordChange };
};
