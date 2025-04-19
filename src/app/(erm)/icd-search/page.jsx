// /app/icd-search/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce"; // You may need to create this hook

export default function ICDCodeSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);
  const [error, setError] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchData = async () => {
      if (debouncedSearchTerm.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/icd-codes/search?term=${encodeURIComponent(
            debouncedSearchTerm
          )}`
        );
        const data = await response.json();

        if (data.success) {
          setResults(data.results);
        } else {
          setError(data.message || "Failed to fetch results");
        }
      } catch (err) {
        setError("An error occurred while searching");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearchTerm]);

  const handleSelectCode = (code) => {
    setSelectedCode(code);
    // You can add additional logic here, like storing the selection
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ICD-10 Code Search</h1>

      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium mb-2">
          Search by code or description
        </label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter at least 2 characters to search..."
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          Enter at least 2 characters to search for ICD-10 codes
        </p>
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-2">Searching...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {!isLoading &&
        !error &&
        results.length === 0 &&
        searchTerm.length >= 2 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p>No results found for "{searchTerm}"</p>
          </div>
        )}

      {results.length > 0 && (
        <div className="bg-white shadow-md rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Code
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((icdCode) => (
                <tr
                  key={icdCode.id}
                  className={
                    selectedCode?.id === icdCode.id ? "bg-blue-50" : ""
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {icdCode.code}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {icdCode.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleSelectCode(icdCode)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedCode && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h2 className="text-lg font-medium mb-2">Selected ICD-10 Code</h2>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Code</p>
              <p className="font-medium">{selectedCode.code}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p>{selectedCode.description}</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setSelectedCode(null)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear Selection
            </button>
            {/* You can add more actions here, like "Use this code" */}
          </div>
        </div>
      )}
    </div>
  );
}
