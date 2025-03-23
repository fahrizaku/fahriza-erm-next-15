import { Loader2 } from "lucide-react";

export default function ActionButtons({
  router,
  prescription,
  isProcessing,
  handleMarkAsReady,
  handleDispense,
}) {
  return (
    <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end gap-3">
      <button
        onClick={() => router.push("/apotek/antrian-resep")}
        className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Kembali ke Antrian
      </button>

      {prescription.status === "preparing" && (
        <button
          onClick={handleMarkAsReady}
          disabled={isProcessing}
          className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Memproses...
            </>
          ) : (
            "Tandai Siap Diambil"
          )}
        </button>
      )}

      {prescription.status === "ready" && (
        <button
          onClick={handleDispense}
          disabled={isProcessing}
          className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Memproses...
            </>
          ) : (
            "Serahkan Resep"
          )}
        </button>
      )}
    </div>
  );
}
