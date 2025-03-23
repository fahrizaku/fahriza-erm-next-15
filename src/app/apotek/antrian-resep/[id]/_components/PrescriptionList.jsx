import PrescriptionItem from "./PrescriptionItem";

export default function PrescriptionList({ prescriptions }) {
  return (
    <div className="px-4 sm:px-6 py-4">
      <h2 className="text-lg font-medium text-gray-900 mb-3">Daftar Resep</h2>

      {prescriptions.map((rx, index) => (
        <PrescriptionItem key={rx.id} prescription={rx} index={index} />
      ))}
    </div>
  );
}
