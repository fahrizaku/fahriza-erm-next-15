// components/DataTable.js
import { Calendar } from "lucide-react";
import DataTableRow from "./DataTableRow";

export default function DataTable({
  sortedData,
  searchTerm,
  editingId,
  editForm,
  setEditForm,
  handleUpdate,
  cancelEdit,
  startEdit,
  handleDelete,
}) {
  if (sortedData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          {searchTerm
            ? "Tidak ada data yang sesuai dengan pencarian"
            : "Belum ada data"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Tanggal Input
              </div>
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Nama
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Telepon
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Tanggal Lahir
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Alamat
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Jenis Kelamin
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Travel
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
            <DataTableRow
              key={item.id}
              item={item}
              editingId={editingId}
              editForm={editForm}
              setEditForm={setEditForm}
              handleUpdate={handleUpdate}
              cancelEdit={cancelEdit}
              startEdit={startEdit}
              handleDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
