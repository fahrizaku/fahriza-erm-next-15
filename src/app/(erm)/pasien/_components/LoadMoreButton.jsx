// app/pasien/components/LoadMoreButton.jsx
import { Loader2 } from "lucide-react";

export default function LoadMoreButton({ onLoadMore, isLoading }) {
  return (
    <div className="text-center py-4">
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className="px-6 py-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors font-medium flex items-center gap-2 mx-auto disabled:opacity-70"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Memuat...</span>
          </>
        ) : (
          <span>Tampilkan Lebih Banyak</span>
        )}
      </button>
    </div>
  );
}
