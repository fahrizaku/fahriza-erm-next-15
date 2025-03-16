import React from "react";
import { AlertTriangle } from "lucide-react";

export default function ErrorState({ error, router }) {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <p className="mt-1 text-red-700">{error}</p>
            <button
              onClick={() => router.push("/pasien")}
              className="mt-3 px-4 py-2 bg-white text-red-700 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
            >
              Kembali ke Daftar Pasien
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
