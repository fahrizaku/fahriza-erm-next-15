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
      sharedDosage: "", // New field for racikan prescriptions
      items: [
        {
          id: 1,
          manualDrugName: "",
          drugStoreProductId: null,
          drugStoreProductName: "",
          dosage: "", // Will be ignored for racikan type
          quantity: 1,
        },
      ],
    },
  ]);

  // Add state for allergies
  const [allergies, setAllergies] = useState([]);
  const [loadingAllergies, setLoadingAllergies] = useState(true);

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

          // After getting patient data, fetch allergies
          if (data.patient?.id) {
            fetchPatientAllergies(data.patient.id);
          }
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

  // Function to fetch patient allergies
  const fetchPatientAllergies = async (patientId) => {
    try {
      setLoadingAllergies(true);
      const response = await fetch(`/api/patients/${patientId}/allergies`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Format allergies with existingAllergyId field
        const formattedAllergies = data.allergies.map((allergy) => ({
          allergyName: allergy.allergyName,
          allergyType: allergy.allergyType || "lainnya",
          severity: allergy.severity || "sedang",
          reaction: allergy.reaction || "",
          notes: allergy.notes || "",
          status: allergy.status || "aktif",
          existingAllergyId: allergy.id, // Keep reference to original ID
          reportedAt: allergy.reportedAt || new Date().toISOString(),
        }));

        setAllergies(formattedAllergies);
      } else {
        console.error("Failed to fetch allergies:", data.message);
        // Don't set error to avoid blocking the entire page for allergies
      }
    } catch (error) {
      console.error("Error fetching allergies:", error);
    } finally {
      setLoadingAllergies(false);
    }
  };

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
        `/api/drug-prescriptions?search=${query}&limit=10`
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

  const handlePrescriptionTypeChange = (index, value) => {
    const updatedPrescriptions = [...prescriptions];
    const previousType = updatedPrescriptions[index].type;
    updatedPrescriptions[index].type = value;

    // If changing to or from Racikan type, adjust dosage handling
    if (value === "Racikan" && previousType !== "Racikan") {
      // Moving from regular prescription to racikan
      // Take the dosage from the first item and make it the shared dosage
      if (updatedPrescriptions[index].items.length > 0) {
        updatedPrescriptions[index].sharedDosage =
          updatedPrescriptions[index].items[0].dosage || "";
      }
    } else if (value !== "Racikan" && previousType === "Racikan") {
      // Moving from racikan to regular prescription
      // Distribute the shared dosage to all items
      const sharedDosage = updatedPrescriptions[index].sharedDosage || "";
      updatedPrescriptions[index].items.forEach((item) => {
        item.dosage = sharedDosage;
      });
      updatedPrescriptions[index].sharedDosage = "";
    }

    setPrescriptions(updatedPrescriptions);
  };

  // Handle shared dosage change for racikan prescriptions
  const handleSharedDosageChange = (index, value) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index].sharedDosage = value;
    setPrescriptions(updatedPrescriptions);
  };

  const handleMedicalRecordChange = (e) => {
    const { name, value } = e.target;
    setMedicalRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    // If changing dosage and this is a racikan prescription,
    // update the shared dosage instead of individual item dosage
    if (
      field === "dosage" &&
      updatedPrescriptions[prescIndex].type === "Racikan"
    ) {
      updatedPrescriptions[prescIndex].sharedDosage = value;
    } else {
      updatedPrescriptions[prescIndex].items[itemIndex][field] = value;
    }

    // Existing drug name handling...
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
        dosage: updatedPrescriptions[prescIndex].type === "Racikan" ? "" : "",
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

  const addPrescription = (type = "Main") => {
    setPrescriptions([
      ...prescriptions,
      {
        id: prescriptions.length + 1,
        type: type, // Menggunakan parameter type
        notes: "",
        sharedDosage: "",
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

  // Format data for submission
  const formatPrescriptionsForSubmission = () => {
    return prescriptions
      .map((prescription) => {
        const isRacikan = prescription.type === "Racikan";
        return {
          type: prescription.type,
          notes: prescription.notes,
          dosage: isRacikan ? prescription.sharedDosage : null, // Only include dosage for racikan
          items: prescription.items
            .filter((item) => item.manualDrugName)
            .map((item) => ({
              manualDrugName: item.manualDrugName,
              drugStoreProductId: item.drugStoreProductId,
              dosage: isRacikan ? null : item.dosage, // Only include individual dosage for non-racikan
              quantity: parseInt(item.quantity),
            })),
        };
      })
      .filter((prescription) => prescription.items.length > 0);
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
    handleSharedDosageChange,
    formatPrescriptionsForSubmission,

    // Drug search
    drugSearchQuery,
    drugSearchResults,
    isSearchingDrugs,
    searchDrugs,
    selectDrug,

    // Allergies
    allergies,
    setAllergies,
    loadingAllergies,
  };
};
