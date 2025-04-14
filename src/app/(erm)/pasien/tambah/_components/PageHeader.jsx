import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const PageHeader = () => {
  return (
    <div className="mb-6">
      <Link
        href="/pasien"
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        <span>Kembali ke daftar pasien</span>
      </Link>
      <h1 className="text-2xl font-bold text-gray-800">
        Registrasi Pasien Baru
      </h1>
      <p className="text-gray-600 mt-1">
        Silakan lengkapi data pasien dengan benar
      </p>
    </div>
  );
};

export default PageHeader;
