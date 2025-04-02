import React from "react";
import { Stethoscope, Bed, ClipboardList, Loader2 } from "lucide-react";

const PatientActions = ({
  loadingStates,
  onOutpatientClick,
  onInpatientClick,
  onMedicalRecordClick,
}) => {
  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-5">
        Tindakan Pasien
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Rawat Jalan button */}
        <ActionButton
          icon={<Stethoscope className="h-5 w-5" />}
          loadingIcon={<Loader2 className="h-5 w-5 animate-spin" />}
          isLoading={loadingStates.outpatient}
          title="Rawat Jalan"
          description="Daftarkan pelayanan"
          loadingDescription="Memuat..."
          onClick={onOutpatientClick}
          iconBgColor="bg-green-100 text-green-600"
        />

        {/* Rawat Inap button */}
        {/* <ActionButton
          icon={<Bed className="h-5 w-5" />}
          loadingIcon={<Loader2 className="h-5 w-5 animate-spin" />}
          isLoading={loadingStates.inpatient}
          title="Rawat Inap"
          description="Daftarkan pelayanan"
          loadingDescription="Memuat..."
          onClick={onInpatientClick}
          iconBgColor="bg-purple-100 text-purple-600"
        /> */}

        {/* Rekam Medis button */}
        <ActionButton
          icon={<ClipboardList className="h-5 w-5" />}
          loadingIcon={<Loader2 className="h-5 w-5 animate-spin" />}
          isLoading={loadingStates.medicalRecord}
          title="Rekam Medis"
          description="Lihat riwayat"
          loadingDescription="Memuat..."
          onClick={onMedicalRecordClick}
          iconBgColor="bg-blue-100 text-blue-600"
        />
      </div>
    </div>
  );
};

// Reusable action button component
const ActionButton = ({
  icon,
  loadingIcon,
  isLoading,
  title,
  description,
  loadingDescription,
  onClick,
  iconBgColor,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="flex items-center p-4 bg-white hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow cursor-pointer disabled:opacity-70"
    >
      <div className={`${iconBgColor} p-3 rounded-lg mr-4`}>
        {isLoading ? loadingIcon : icon}
      </div>
      <div className="text-left">
        <div className="font-medium text-gray-900 mb-1">{title}</div>
        <div className="text-xs text-gray-500">
          {isLoading ? loadingDescription : description}
        </div>
      </div>
    </button>
  );
};

export default PatientActions;
