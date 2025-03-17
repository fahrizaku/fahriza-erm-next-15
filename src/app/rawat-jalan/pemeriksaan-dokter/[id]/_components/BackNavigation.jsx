import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const BackNavigation = () => {
  return (
    <div className="mb-6">
      <Link
        href="/rawat-jalan/pemeriksaan-dokter"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Kembali</span>
      </Link>
    </div>
  );
};

export default BackNavigation;
