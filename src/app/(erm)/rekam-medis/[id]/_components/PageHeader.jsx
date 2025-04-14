// app/rekam-medis/[id]/_components/PageHeader.jsx
import { Calendar, Clock } from "lucide-react";
import { formatDate, formatTime } from "../utils/formatters";

export default function PageHeader({ visitDate }) {
  return (
    <div className="p-5 md:p-6 border-b border-gray-200 bg-gray-50 print:bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
          Rekam Medis
        </h1>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="mr-2">{visitDate && formatDate(visitDate)}</span>
          <Clock className="h-4 w-4 mr-1" />
          <span>{visitDate && formatTime(visitDate)}</span>
        </div>
      </div>
    </div>
  );
}
