import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useDoctorExamination = (screeningId) => {
  // Screening data state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patient, setPatient] = useState(null);
  const [screening, setScreening] = useState(null);

  // Medical record state
  const [medicalRecord, setMedicalRecord] = useState({
    diagnosis: "",
    icdCode: "",
    clinicalNotes: "",
    doctorName: "",
  });

  // Multiple prescriptions state
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      type: "Main",
      notes: "",
      items: [{ id: 1, manualDrugName: "", dosage: "", quantity: 1 }],
    },
  ]);

  // Fetch screening data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/screenings/${screeningId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setScreening(data.screening);
          setPatient(data.patient);
        } else {
          setError(data.message || "Failed to fetch screening data");
          toast.error(data.message || "Failed to fetch screening data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
        toast.error("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    if (screeningId) {
      fetchData();
    }
  }, [screeningId]);

  // Handle medical record input changes
  const handleMedicalRecordChange = (e) => {
    const { name, value } = e.target;
    setMedicalRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle prescription type change
  const handlePrescriptionTypeChange = (index, value) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index].type = value;
    setPrescriptions(updatedPrescriptions);
  };

  // Handle prescription notes change
  const handlePrescriptionNotesChange = (index, value) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index].notes = value;
    setPrescriptions(updatedPrescriptions);
  };

  // Handle prescription item changes
  const handlePrescriptionItemChange = (
    prescIndex,
    itemIndex,
    field,
    value
  ) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[prescIndex].items[itemIndex][field] = value;
    setPrescriptions(updatedPrescriptions);
  };

  // Add prescription item
  const addPrescriptionItem = (prescIndex) => {
    const updatedPrescriptions = [...prescriptions];
    const items = updatedPrescriptions[prescIndex].items;
    updatedPrescriptions[prescIndex].items = [
      ...items,
      {
        id: items.length + 1,
        manualDrugName: "",
        dosage: "",
        quantity: 1,
      },
    ];
    setPrescriptions(updatedPrescriptions);
  };

  // Remove prescription item
  const removePrescriptionItem = (prescIndex, itemIndex) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[prescIndex].items.splice(itemIndex, 1);
    setPrescriptions(updatedPrescriptions);
  };

  // Add a new prescription
  const addPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      {
        id: prescriptions.length + 1,
        type: "Racikan",
        notes: "",
        items: [{ id: 1, manualDrugName: "", dosage: "", quantity: 1 }],
      },
    ]);
  };

  // Remove a prescription
  const removePrescription = (index) => {
    if (prescriptions.length === 1) {
      return; // Don't remove if it's the only prescription
    }
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions.splice(index, 1);
    setPrescriptions(updatedPrescriptions);
  };

  return {
    // Screening data
    loading,
    error,
    patient,
    screening,

    // Medical record
    medicalRecord,
    setMedicalRecord,
    handleMedicalRecordChange,

    // Prescriptions
    prescriptions,
    setPrescriptions,
    handlePrescriptionTypeChange,
    handlePrescriptionNotesChange,
    handlePrescriptionItemChange,
    addPrescriptionItem,
    removePrescriptionItem,
    addPrescription,
    removePrescription,
  };
};
