// app/rekam-medis/[id]/utils/formatters.js

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

// Format time
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Function to capitalize each word
export const capitalizeEachWord = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Function to format blood pressure from systolic and diastolic values
export const formatBloodPressure = (systolic, diastolic) => {
  if (!systolic || !diastolic) return null;
  return `${systolic}/${diastolic}`;
};
