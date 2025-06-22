// components/SummaryStats.js
export default function SummaryStats({ totalData, displayedData, searchTerm }) {
  if (totalData === 0) return null;

  return (
    <div className="mt-6 text-sm text-gray-500">
      <span>Total: {totalData} data</span>
      {searchTerm && (
        <span className="ml-4">Ditampilkan: {displayedData} data</span>
      )}
    </div>
  );
}
