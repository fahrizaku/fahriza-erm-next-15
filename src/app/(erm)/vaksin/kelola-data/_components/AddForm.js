// components/AddForm.js
import { Save, X } from "lucide-react";

export default function AddForm({
  showAddForm,
  setShowAddForm,
  newForm,
  setNewForm,
  handleAdd,
}) {
  if (!showAddForm) return null;

  return (
    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-lg font-medium mb-4">Tambah Data Baru</h3>
      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nama Lengkap *"
            value={newForm.nama}
            onChange={(e) => setNewForm({ ...newForm, nama: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
            required
          />
          <input
            type="tel"
            placeholder="Nomor Telepon"
            value={newForm.noTelp}
            onChange={(e) => setNewForm({ ...newForm, noTelp: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
          />
          <textarea
            placeholder="Alamat"
            value={newForm.alamat}
            onChange={(e) => setNewForm({ ...newForm, alamat: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
            rows="2"
          />
          <input
            type="text"
            placeholder="Kota Kelahiran"
            value={newForm.kotaKelahiran}
            onChange={(e) =>
              setNewForm({ ...newForm, kotaKelahiran: e.target.value })
            }
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
          />
          <input
            type="text"
            placeholder="Tanggal Lahir (dd/mm/yyyy)"
            value={newForm.tanggalLahir}
            onChange={(e) =>
              setNewForm({ ...newForm, tanggalLahir: e.target.value })
            }
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
          />
          <select
            value={newForm.jenisKelamin}
            onChange={(e) =>
              setNewForm({ ...newForm, jenisKelamin: e.target.value })
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
            value={newForm.namaTravel}
            onChange={(e) =>
              setNewForm({ ...newForm, namaTravel: e.target.value })
            }
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
          />
          <input
            type="text"
            placeholder="Asal Travel"
            value={newForm.asalTravel}
            onChange={(e) =>
              setNewForm({ ...newForm, asalTravel: e.target.value })
            }
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
          />
          <input
            type="text"
            placeholder="Tanggal Keberangkatan (dd/mm/yyyy)"
            value={newForm.tanggalKeberangkatan}
            onChange={(e) =>
              setNewForm({
                ...newForm,
                tanggalKeberangkatan: e.target.value,
              })
            }
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
          />
          <input
            type="text"
            placeholder="No. ICV (opsional)"
            value={newForm.noIcv}
            onChange={(e) => setNewForm({ ...newForm, noIcv: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
          />
          <input
            type="text"
            placeholder="No. Passport (opsional)"
            value={newForm.noPassport}
            onChange={(e) =>
              setNewForm({ ...newForm, noPassport: e.target.value })
            }
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Save className="w-4 h-4" />
            Simpan
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(false)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            <X className="w-4 h-4" />
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
