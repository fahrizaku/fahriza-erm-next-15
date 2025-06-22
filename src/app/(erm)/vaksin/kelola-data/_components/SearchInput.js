// components/SearchInput.js
import { Search } from "lucide-react";

export default function SearchInput({ searchTerm, setSearchTerm }) {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan nama, telepon, alamat, atau travel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400"
        />
      </div>
    </div>
  );
}
