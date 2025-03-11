import { useState } from "react";

export const usePrescriptions = () => {
  // Multiple prescriptions state
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      type: "Main",
      notes: "",
      items: [{ id: 1, manualDrugName: "", dosage: "", quantity: 1 }],
    },
  ]);

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
