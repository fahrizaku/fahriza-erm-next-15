// components/EditForm.js
import { Save, X } from "lucide-react";

export default function EditForm({
  editForm,
  setEditForm,
  handleUpdate,
  cancelEdit,
}) {
  return (
    <td colSpan="10" className="py-4 px-4">
      <form onSubmit={handleUpdate} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Nama Lengkap *"
            value={editForm.nama || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                nama: e.target.value,
              })
            }
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
            required
          />
          <input
            type="tel"
            placeholder="Nomor Telepon"
            value={editForm.noTelp || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                noTelp: e.target.value,
              })
            }
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
          />
          <textarea
            placeholder="Alamat"
            value={editForm.alamat || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                alamat: e.target.value,
              })
            }
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
            rows="2"
          />
          <input
            type="text"
            placeholder="Kota Kelahiran"
            value={editForm.kotaKelahiran || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                kotaKelahiran: e.target.value,
              })
            }
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
          />
          <input
            type="text"
            placeholder="Tanggal Lahir (dd/mm/yyyy)"
            value={editForm.tanggalLahir || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                tanggalLahir: e.target.value,
              })
            }
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
          />
          <select
            value={editForm.jenisKelamin || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                jenisKelamin: e.target.value,
              })
            }
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
          <input
            type="text"
            placeholder="Nama Travel"
            value={editForm.namaTravel || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                namaTravel: e.target.value,
              })
            }
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
          />
          <input
            type="text"
            placeholder="Asal Travel"
            value={editForm.asalTravel || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                asalTravel: e.target.value,
              })
            }
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
          />
          <input
            type="text"
            placeholder="Tanggal Keberangkatan (dd/mm/yyyy)"
            value={editForm.tanggalKeberangkatan || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                tanggalKeberangkatan: e.target.value,
              })
            }
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
          />
          <input
            type="text"
            placeholder="No. ICV (opsional)"
            value={editForm.noIcv || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                noIcv: e.target.value,
              })
            }
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
          />
          <input
            type="text"
            placeholder="No. Passport (opsional)"
            value={editForm.noPassport || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                noPassport: e.target.value,
              })
            }
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            <Save className="w-4 h-4" />
            Simpan
          </button>
          <button
            type="button"
            onClick={cancelEdit}
            className="flex items-center gap-2 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
          >
            <X className="w-4 h-4" />
            Batal
          </button>
        </div>
      </form>
    </td>
  );
}
