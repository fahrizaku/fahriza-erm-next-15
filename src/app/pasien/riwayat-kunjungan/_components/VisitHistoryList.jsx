// components/VisitHistoryList.js
import VisitCard from "./VisitCard";

export default function VisitHistoryList({ medicalRecords }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {medicalRecords.map((record) => (
        <VisitCard key={record.id} record={record} />
      ))}
    </div>
  );
}
