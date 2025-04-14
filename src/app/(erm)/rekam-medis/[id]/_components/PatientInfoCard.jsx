// app/rekam-medis/[id]/_components/PatientInfoCard.jsx
import { User, FileText, Calendar, ArrowRight, MapPin } from "lucide-react";
import { capitalizeEachWord } from "../utils/formatters";
import Link from "next/link";

export default function PatientInfoCard({ patient }) {
  if (!patient) return null;

  // Calculate age from birthDate
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const age = calculateAge(patient.birthDate);

  return (
    <div className="p-5 bg-blue-50 border-b border-blue-100 print:bg-white print:border-b print:border-gray-300">
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex items-center mb-2 sm:mb-0">
          <User className="h-5 w-5 text-blue-600 mr-2 print:text-gray-700" />
          <Link href={`/pasien/${patient.id}`} className="group">
            <h2 className="text-lg font-semibold text-blue-800 mr-3 print:text-gray-900 group-hover:text-blue-600 group-hover:underline transition-colors">
              {capitalizeEachWord(patient.name)}
              <ArrowRight className="h-3 w-3 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h2>
          </Link>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FileText className="h-4 w-4 mr-1" />
          <span>No. RM: </span>
          <span className="font-mono ml-1 font-medium">{patient.no_rm}</span>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
        {patient.gender && (
          <div className="flex items-center">
            <span>{patient.gender}</span>
          </div>
        )}

        {age !== null && (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{age} tahun</span>
          </div>
        )}

        {patient.address && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{patient.address}</span>
          </div>
        )}
      </div>
    </div>
  );
}
