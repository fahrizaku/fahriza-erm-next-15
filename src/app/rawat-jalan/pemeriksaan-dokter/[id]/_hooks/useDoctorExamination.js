// File: _hooks/useDoctorExamination.js
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useDoctorExamination = (screeningId) => {
  // Existing state...
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
      items: [
        {
          id: 1,
          manualDrugName: "",
          drugStoreProductId: null,
          drugStoreProductName: "",
          dosage: "",
          quantity: 1,
        },
      ],
    },
  ]);

  // Add state for drug search
  const [drugSearchQuery, setDrugSearchQuery] = useState("");
  const [drugSearchResults, setDrugSearchResults] = useState([]);
  const [isSearchingDrugs, setIsSearchingDrugs] = useState(false);

  // Existing useEffect for fetching screening data...
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

  // Add a function to search for drugs
  const searchDrugs = async (query) => {
    setDrugSearchQuery(query);

    if (query.length < 2) {
      setDrugSearchResults([]);
      return;
    }

    try {
      setIsSearchingDrugs(true);
      const response = await fetch(
        `/api/drug-store-products?search=${query}&limit=10`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setDrugSearchResults(data.products);
      } else {
        console.error("Failed to fetch drugs");
      }
    } catch (error) {
      console.error("Error searching drugs:", error);
    } finally {
      setIsSearchingDrugs(false);
    }
  };

  // Function to select a drug from search results
  const selectDrug = (prescIndex, itemIndex, drug) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[prescIndex].items[itemIndex].drugStoreProductId =
      drug.id;
    updatedPrescriptions[prescIndex].items[itemIndex].manualDrugName =
      drug.displayName;
    updatedPrescriptions[prescIndex].items[itemIndex].drugStoreProductName =
      drug.displayName;
    setPrescriptions(updatedPrescriptions);
    setDrugSearchResults([]);
    setDrugSearchQuery("");
  };

  // Existing functions...
  const handleMedicalRecordChange = (e) => {
    const { name, value } = e.target;
    setMedicalRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrescriptionTypeChange = (index, value) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index].type = value;
    setPrescriptions(updatedPrescriptions);
  };

  const handlePrescriptionNotesChange = (index, value) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index].notes = value;
    setPrescriptions(updatedPrescriptions);
  };

  const handlePrescriptionItemChange = (
    prescIndex,
    itemIndex,
    field,
    value
  ) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[prescIndex].items[itemIndex][field] = value;

    // If they're typing in the manualDrugName field, reset the drugStoreProductId
    if (field === "manualDrugName") {
      updatedPrescriptions[prescIndex].items[itemIndex].drugStoreProductId =
        null;
      updatedPrescriptions[prescIndex].items[itemIndex].drugStoreProductName =
        "";
    }

    setPrescriptions(updatedPrescriptions);
  };

  const addPrescriptionItem = (prescIndex) => {
    const updatedPrescriptions = [...prescriptions];
    const items = updatedPrescriptions[prescIndex].items;
    updatedPrescriptions[prescIndex].items = [
      ...items,
      {
        id: items.length + 1,
        manualDrugName: "",
        drugStoreProductId: null,
        drugStoreProductName: "",
        dosage: "",
        quantity: 1,
      },
    ];
    setPrescriptions(updatedPrescriptions);
  };

  const removePrescriptionItem = (prescIndex, itemIndex) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[prescIndex].items.splice(itemIndex, 1);
    setPrescriptions(updatedPrescriptions);
  };

  const addPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      {
        id: prescriptions.length + 1,
        type: "Racikan",
        notes: "",
        items: [
          {
            id: 1,
            manualDrugName: "",
            drugStoreProductId: null,
            drugStoreProductName: "",
            dosage: "",
            quantity: 1,
          },
        ],
      },
    ]);
  };

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

    // Drug search
    drugSearchQuery,
    drugSearchResults,
    isSearchingDrugs,
    searchDrugs,
    selectDrug,
  };
};
