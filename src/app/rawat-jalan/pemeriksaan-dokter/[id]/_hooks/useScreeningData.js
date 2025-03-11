import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useScreeningData = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patient, setPatient] = useState(null);
  const [screening, setScreening] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/screenings/${id}`);

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

    if (id) {
      fetchData();
    }
  }, [id]);

  return { loading, error, patient, screening };
};
