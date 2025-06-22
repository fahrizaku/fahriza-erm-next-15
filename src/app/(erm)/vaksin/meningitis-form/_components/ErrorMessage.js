// components/ErrorMessage.js
import { AlertCircle } from "lucide-react";

export const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
      <p className="text-red-700">{message}</p>
    </div>
  );
};
