// helper-functions.js
import { toast } from "react-toastify";

// Fetch patient data from API
export const fetchPatientData = async (
  id,
  setLoading,
  setPatient,
  setError,
  setScreening
) => {
  try {
    setLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const isBPJS = urlParams.get("isBPJS") === "true";

    const response = await fetch(`/api/patients/${id}?isBPJS=${isBPJS}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      setPatient(data.patient);

      // If patient already has BPJS, set the form default
      if (data.patient.isBPJS) {
        setScreening((prev) => ({
          ...prev,
          no_bpjs: data.patient.no_bpjs || "",
        }));
      }
    } else {
      setError(data.message || "Failed to fetch patient data");
      toast.error(data.message || "Failed to fetch patient data", {
        autoClose: 200,
      });
    }
  } catch (error) {
    console.error("Error fetching patient:", error);
    setError("An error occurred while fetching patient data");
    toast.error("An error occurred while fetching patient data", {
      autoClose: 200,
    });
  } finally {
    setLoading(false);
  }
};

// Validate form data before submission
export const validateFormData = (screening, patient) => {
  if (!screening.complaints) {
    throw new Error("Keluhan pasien harus diisi");
  }

  if (!screening.nurseName) {
    throw new Error("Nama perawat/petugas harus diisi");
  }

  if (!screening.paymentMethod) {
    throw new Error("Metode pembayaran harus dipilih");
  }

  // Validate BPJS verification if patient already has BPJS and is using BPJS payment
  if (
    screening.paymentMethod === "bpjs" &&
    patient?.isBPJS &&
    !screening.bpjsStatusVerified
  ) {
    throw new Error("Status BPJS harus diverifikasi terlebih dahulu");
  }

  // Validate BPJS number if using BPJS payment method with new BPJS number
  if (
    screening.paymentMethod === "bpjs" &&
    !patient.isBPJS &&
    screening.updatePatientBPJS &&
    !screening.no_bpjs
  ) {
    throw new Error(
      "Nomor BPJS harus diisi jika menggunakan metode pembayaran BPJS"
    );
  }

  // Validasi data alergi jika ada
  if (screening.allergies && screening.allergies.length > 0) {
    for (const allergy of screening.allergies) {
      if (!allergy.allergyName) {
        throw new Error("Nama alergi harus diisi");
      }
    }
  }
};

// Prepare screening data for submission
export const prepareScreeningData = (screening, id, patient) => {
  return {
    patientId: parseInt(id),
    complaints: screening.complaints,
    temperature: screening.temperature ? screening.temperature : null,
    systolicBP: screening.systolicBP ? parseInt(screening.systolicBP) : null,
    diastolicBP: screening.diastolicBP ? parseInt(screening.diastolicBP) : null,
    pulse: screening.pulse ? parseInt(screening.pulse) : null,
    respiratoryRate: screening.respiratoryRate
      ? parseInt(screening.respiratoryRate)
      : null,
    weight: screening.weight ? parseFloat(screening.weight) : null,
    height: screening.height ? parseInt(screening.height) : null,
    waistCircumference: screening.waistCircumference
      ? parseFloat(screening.waistCircumference)
      : null,
    oxygenSaturation: screening.oxygenSaturation
      ? parseFloat(screening.oxygenSaturation)
      : null,
    nurseName: screening.nurseName,
    isBPJSActive:
      screening.paymentMethod === "bpjs" &&
      (screening.bpjsStatusVerified || !patient?.isBPJS),
    // Only include BPJS number if updating patient record
    ...(screening.paymentMethod === "bpjs" &&
    !patient.isBPJS &&
    screening.updatePatientBPJS
      ? { no_bpjs: screening.no_bpjs, updatePatientBPJS: true }
      : {}),
    // Include allergies data with their existing IDs if present
    allergies: screening.allergies
      ? screening.allergies.map((allergy) => ({
          ...allergy,
          // Ensure existingAllergyId is preserved if it exists
          existingAllergyId: allergy.existingAllergyId || null,
        }))
      : [],
  };
};

// Submit screening data to API
export const submitScreeningData = async (screeningData, setError, router) => {
  try {
    const response = await fetch("/api/screenings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(screeningData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Extract error message from the response
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    if (data.success) {
      // Show success message
      toast.success("Skrining pasien berhasil disimpan", { autoClose: 2000 });

      // Redirect to the queue page
      router.push("/rawat-jalan/antrian");
    } else {
      setError(data.message || "Failed to save screening data");
      throw new Error(data.message || "Failed to save screening data");
    }
  } catch (error) {
    // Just set the error and re-throw it, don't show toast here
    setError(error.message);
    throw error;
  }
};

// Handle submission errors
export const handleSubmissionError = (error, setError) => {
  console.error("Error saving screening:", error);
  setError(error.message || "An error occurred while saving screening data");
  toast.error(
    error.message || "An error occurred while saving screening data",
    { autoClose: 200 }
  );
};

// Function to capitalize each word
export const capitalizeEachWord = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
