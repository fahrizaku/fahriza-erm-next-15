export function LoadingState() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Memuat data resep...</p>
        </div>
      </div>
    </div>
  );
}

export function ErrorState({ error, router }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-xl">⚠️</div>
          <p className="mt-3 text-red-600">{error}</p>
          <button
            onClick={() => router.push("/apotek/antrian-resep")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Kembali ke Antrian
          </button>
        </div>
      </div>
    </div>
  );
}

export function NotFoundState({ router }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-yellow-500 text-xl">⚠️</div>
          <p className="mt-3 text-gray-600">Data resep tidak ditemukan</p>
          <button
            onClick={() => router.push("/apotek/antrian-resep")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Kembali ke Antrian
          </button>
        </div>
      </div>
    </div>
  );
}
