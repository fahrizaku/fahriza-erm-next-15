import React from "react";
import { User, Calendar, MapPin, FileText, Phone, Copy, ExternalLink } from "lucide-react";
import { toast } from "react-toastify";

// Helper functions
const calculateAge = (birthDate) => {
  if (!birthDate) return "N/A";
  const birth = new Date(birthDate);
  const ageDifMs = Date.now() - birth.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const capitalizeEachWord = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const formatPhoneForLink = (phone) => {
  if (!phone) return "";
  let cleanNumber = phone.replace(/\D/g, "");
  if (cleanNumber.startsWith("0")) {
    cleanNumber = "62" + cleanNumber.substring(1);
  }
  return cleanNumber;
};

const PatientInfoSection = ({ patient }) => {
  const handleCopyBPJS = () => {
    if (!patient.no_bpjs) return;

    const copyToClipboard = (text) => {
      return new Promise((resolve, reject) => {
        if (navigator.clipboard) {
          navigator.clipboard
            .writeText(text)
            .then(resolve)
            .catch(() => {
              legacyCopy(text, resolve, reject);
            });
        } else {
          legacyCopy(text, resolve, reject);
        }
      });
    };

    const legacyCopy = (text, resolve, reject) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        successful ? resolve() : reject(new Error("Gagal menyalin"));
      } catch (err) {
        document.body.removeChild(textArea);
        reject(err);
      }
    };

    copyToClipboard(patient.no_bpjs)
      .then(() => {
        toast.success("Nomor BPJS disalin ke clipboard");
      })
      .catch((err) => {
        console.error("Gagal menyalin:", err);
        toast.error("Gagal menyalin nomor BPJS");
      });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left column - Personal Information */}
      <div>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-500" />
            Informasi Pribadi
          </h3>

          {/* Gender field */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Kelamin
            </label>
            <p className="text-gray-800 font-medium">
              {patient.gender || "Tidak tersedia"}
            </p>
          </div>

          {/* Birth Date */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span>Tanggal Lahir</span>
              </div>
            </label>
            <div className="flex items-center">
              <span className="text-gray-800 font-medium">
                {patient.birthDate
                  ? new Date(patient.birthDate).toLocaleDateString("id-ID")
                  : "Tidak tersedia"}
              </span>
              {patient.birthDate && (
                <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {calculateAge(patient.birthDate)} tahun
                </span>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span>Alamat</span>
              </div>
            </label>
            <p className="text-gray-800">
              {capitalizeEachWord(patient.address) || "Tidak tersedia"}
            </p>
          </div>
        </div>
      </div>

      {/* Right column - Identity Information */}
      <div>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-500" />
            Informasi Identitas
          </h3>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <span>Nomor Telepon</span>
              </div>
            </label>
            <div className="flex items-center flex-wrap gap-2">
              <p className="text-gray-800">
                {patient.phoneNumber || "Tidak tersedia"}
              </p>
              {patient.phoneNumber && (
                <div className="flex gap-2">
                  <a
                    href={`tel:${formatPhoneForLink(patient.phoneNumber)}`}
                    className="inline-flex items-center text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition-colors"
                    title="Panggil"
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    <span>Panggil</span>
                  </a>
                  <a
                    href={`https://wa.me/${formatPhoneForLink(patient.phoneNumber)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded transition-colors"
                    title="WhatsApp"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* NIK */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NIK
            </label>
            <p className="text-gray-800 font-mono bg-gray-100 inline-block px-3 py-1 rounded">
              {patient.nik || "Tidak tersedia"}
            </p>
          </div>

          {/* BPJS Status */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {patient.isBPJS ? "Nomor BPJS" : "Status BPJS"}
            </label>
            <div>
              {patient.isBPJS ? (
                <div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono bg-green-100 px-3 py-1 rounded-md text-green-800 font-medium">
                      {patient.no_bpjs || "Belum diinput"}
                    </span>
                    {patient.no_bpjs && (
                      <button
                        type="button"
                        onClick={handleCopyBPJS}
                        className="inline-flex items-center justify-center p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        title="Salin ke clipboard"
                      >
                        <Copy className="h-4 w-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">Tidak memiliki BPJS</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoSection;