import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">Memuat data pasien...</p>
        </div>
      </div>
    </div>
  );
}
