import React from "react";
import { Save, Loader2 } from "lucide-react";

export default function SubmitButton({ submitting }) {
  return (
    <div className="flex justify-end">
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            <span>Menyimpan...</span>
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            <span>Simpan & Lanjutkan ke Antrian</span>
          </>
        )}
      </button>
    </div>
  );
}
