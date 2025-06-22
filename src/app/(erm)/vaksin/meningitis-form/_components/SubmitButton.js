// components/SubmitButton.js
import { ChevronRight } from "lucide-react";

export const SubmitButton = ({ isLoading, onClick }) => {
  return (
    <div className="flex justify-end">
      <button
        type="submit"
        disabled={isLoading}
        onClick={onClick}
        className={`flex items-center gap-2 px-5 py-3 ${
          isLoading
            ? "bg-gray-400"
            : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg"
        } text-white rounded-xl transition-all font-medium`}
      >
        <span>{isLoading ? "Memproses..." : "Generate Dokumen"}</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
