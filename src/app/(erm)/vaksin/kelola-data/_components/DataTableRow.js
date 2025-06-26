// components/DataTableRow.js
import { Edit, Trash2 } from "lucide-react";
import EditForm from "./EditForm";

// Utility function untuk format tanggal
const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return dateString;
  }
};

export default function DataTableRow({
  item,
  editingId,
  editForm,
  setEditForm,
  handleUpdate,
  cancelEdit,
  startEdit,
  handleDelete,
}) {
  if (editingId === item.id) {
    return (
      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
        <EditForm
          editForm={editForm}
          setEditForm={setEditForm}
          handleUpdate={handleUpdate}
          cancelEdit={cancelEdit}
        />
      </tr>
    );
  }

  return (
    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4">
        <div className="text-sm">
          <div className="text-gray-700 font-medium">
            {formatDateTime(item.createdAt)}
          </div>
          {item.updatedAt && item.updatedAt !== item.createdAt && (
            <div className="text-gray-500 text-xs mt-1">
              Diupdate: {formatDateTime(item.updatedAt)}
            </div>
          )}
        </div>
      </td>
      <td className="py-3 px-4 font-medium">{item.nama}</td>
      <td className="py-3 px-4">{item.noTelp || "-"}</td>
      <td className="py-3 px-4">
        {item.tanggalLahir ? (
          <div>
            <div>{item.tanggalLahir}</div>
            {item.umur && (
              <div className="text-sm text-gray-500">({item.umur} tahun)</div>
            )}
          </div>
        ) : (
          "-"
        )}
      </td>
      <td className="py-3 px-4">{item.alamat || "-"}</td>
      <td className="py-3 px-4">{item.jenisKelamin || "-"}</td>
      <td className="py-3 px-4">
        {item.namaTravel ? (
          <div>
            <div>{item.namaTravel}</div>
            {item.asalTravel && (
              <div className="text-sm text-gray-500">
                Asal: {item.asalTravel}
              </div>
            )}
            {item.tanggalKeberangkatan && (
              <div className="text-sm text-gray-500">
                Berangkat: {item.tanggalKeberangkatan}
              </div>
            )}
          </div>
        ) : (
          "-"
        )}
      </td>
      <td className="py-3 px-4">{item.noIcv || "-"}</td>
      <td className="py-3 px-4">{item.noPassport || "-"}</td>
      <td className="py-3 px-4">
        <div className="flex gap-2">
          <button
            onClick={() => startEdit(item)}
            className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            <Edit className="w-3 h-3" />
            Edit
          </button>
          <button
            onClick={() => handleDelete(item.id, item.nama)}
            className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            <Trash2 className="w-3 h-3" />
            Hapus
          </button>
        </div>
      </td>
    </tr>
  );
}
