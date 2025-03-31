import { User, Calendar, FileText, Pill, CreditCard } from "lucide-react";

export default function PatientInfo({ prescription }) {
  // Calculate total medication items across all prescriptions
  const totalMedicationItems = prescription.prescriptions.reduce(
    (total, rx) => total + rx.items.length,
    0
  );

  // Function to capitalize each word in a string
  const capitalizeEachWord = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Function to get payment type background color
  const getPaymentTypeClass = (paymentType) => {
    const lowerCasePayment = paymentType.toLowerCase();
    if (lowerCasePayment === "bpjs") {
      return "bg-green-100 text-green-800 px-2 py-1 rounded";
    } else if (lowerCasePayment === "umum") {
      return "bg-blue-100 text-blue-800 px-2 py-1 rounded";
    }
    return "";
  };

  return (
    <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-3">
        Informasi Pasien
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Nama Pasien</p>
              <p className="font-medium">
                {capitalizeEachWord(prescription.patientName)}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Tanggal Kunjungan</p>
              <p className="font-medium">
                {new Date(prescription.visitDate).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Dokter Pemeriksa</p>
              <p className="font-medium">{prescription.doctorName}</p>
            </div>
          </div>
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Tipe Pembayaran</p>
              <p
                className={`font-medium ${getPaymentTypeClass(
                  prescription.paymentType
                )}`}
              >
                {prescription.paymentType}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-start">
            <FileText className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Diagnosis</p>
              <p className="font-medium">{prescription.diagnosis}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Pill className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Jumlah Resep</p>
              <p className="font-medium">
                {prescription.prescriptions.length} Resep (
                {totalMedicationItems} Item)
              </p>
            </div>
          </div>
          {prescription.pharmacistName && (
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Petugas Farmasi</p>
                <p className="font-medium">{prescription.pharmacistName}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
