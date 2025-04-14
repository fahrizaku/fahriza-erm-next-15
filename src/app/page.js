"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ArrowRight,
  Shield,
  Heart,
  Users,
  Star,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("patients");

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              <span className="text-blue-700">Medi</span>
              <span className="text-gray-700">Care</span>
              <span className="block mt-2 text-2xl md:text-3xl font-medium text-gray-600">
                Perawatan Kesehatan Modern
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Solusi kesehatan terpadu yang menghubungkan pasien dengan dokter
              terbaik. Jadwalkan konsultasi, pantau kesehatan, dan dapatkan
              perawatan terbaik dengan mudah.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/appointment"
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Buat Janji Temu <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/services"
                className="flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
              >
                Layanan Kami
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-100 rounded-3xl transform rotate-3"></div>
              <div className="absolute -inset-4 bg-blue-200 rounded-3xl transform -rotate-3 opacity-70"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-lg">
                <img
                  src="/api/placeholder/600/400"
                  alt="MediCare Dashboard"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Fitur Unggulan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-blue-50 rounded-xl">
              <div className="p-3 bg-blue-100 rounded-full w-fit mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Jadwal Fleksibel
              </h3>
              <p className="text-gray-600">
                Atur jadwal konsultasi sesuai dengan waktu yang paling nyaman
                untuk Anda.
              </p>
            </div>
            <div className="p-6 bg-blue-50 rounded-xl">
              <div className="p-3 bg-blue-100 rounded-full w-fit mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Konsultasi 24/7
              </h3>
              <p className="text-gray-600">
                Akses layanan konsultasi darurat kapan saja, di mana saja,
                setiap hari.
              </p>
            </div>
            <div className="p-6 bg-blue-50 rounded-xl">
              <div className="p-3 bg-blue-100 rounded-full w-fit mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Data Terlindungi
              </h3>
              <p className="text-gray-600">
                Keamanan data medis Anda adalah prioritas kami dengan enkripsi
                tingkat tinggi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Who Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Solusi Untuk Semua
          </h2>

          <div className="mb-8 flex justify-center">
            <div className="inline-flex p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setActiveTab("patients")}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === "patients"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-600 hover:text-blue-500"
                }`}
              >
                Pasien
              </button>
              <button
                onClick={() => setActiveTab("doctors")}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === "doctors"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-600 hover:text-blue-500"
                }`}
              >
                Dokter
              </button>
              <button
                onClick={() => setActiveTab("clinics")}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === "clinics"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-600 hover:text-blue-500"
                }`}
              >
                Klinik
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            {activeTab === "patients" && (
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Untuk Pasien
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Heart className="w-5 h-5 text-blue-500 mt-1 mr-3" />
                      <span>
                        Temukan dokter sesuai kebutuhan kesehatan Anda
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Heart className="w-5 h-5 text-blue-500 mt-1 mr-3" />
                      <span>
                        Atur janji temu dan konsultasi online dengan mudah
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Heart className="w-5 h-5 text-blue-500 mt-1 mr-3" />
                      <span>
                        Akses rekam medis dan riwayat pemeriksaan Anda
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Heart className="w-5 h-5 text-blue-500 mt-1 mr-3" />
                      <span>Dapatkan pengingat jadwal dan pengobatan</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/2 mt-6 md:mt-0">
                  <img
                    src="/api/placeholder/500/300"
                    alt="Untuk Pasien"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            )}

            {activeTab === "doctors" && (
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Untuk Dokter
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Users className="w-5 h-5 text-blue-500 mt-1 mr-3" />
                      <span>Kelola jadwal praktek dengan efisien</span>
                    </li>
                    <li className="flex items-start">
                      <Users className="w-5 h-5 text-blue-500 mt-1 mr-3" />
                      <span>
                        Akses data pasien dengan aman sesuai kebutuhan
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Users className="w-5 h-5 text-blue-500 mt-1 mr-3" />
                      <span>
                        Lakukan konsultasi online dengan perangkat yang nyaman
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Users className="w-5 h-5 text-blue-500 mt-1 mr-3" />
                      <span>
                        Kelola resep dan rujukan dengan sistem terintegrasi
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/2 mt-6 md:mt-0">
                  <img
                    src="/api/placeholder/500/300"
                    alt="Untuk Dokter"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            )}

            {activeTab === "clinics" && (
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Untuk Klinik
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Star className="w-5 h-5 text-blue-500 mt-1 mr-3" />
                      <span>Sistem manajemen klinik yang komprehensif</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="w-5 h-5 text-blue-500 mt-1 mr-3" />
                      <span>
                        Pantau jadwal konsultasi dan ketersediaan dokter
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Star className="w-5 h-5 text-blue-500 mt-1 mr-3" />
                      <span>
                        Kelola inventaris dan obat-obatan dengan efisien
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Star className="w-5 h-5 text-blue-500 mt-1 mr-3" />
                      <span>
                        Dapatkan analitik performa dan pelaporan lengkap
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/2 mt-6 md:mt-0">
                  <img
                    src="/api/placeholder/500/300"
                    alt="Untuk Klinik"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-blue-600 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            Mulai Perjalanan Kesehatan Anda Sekarang
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pengguna yang telah merasakan kemudahan
            dalam mengatur kesehatan mereka dengan MediCare.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Daftar Sekarang
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border border-white text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-gray-800 text-gray-300">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h2 className="text-2xl font-semibold text-white mb-4">
                <span className="text-blue-400">Medi</span>
                <span className="text-gray-200">Care</span>
              </h2>
              <p className="max-w-sm text-gray-400">
                Solusi kesehatan digital yang menghubungkan pasien, dokter, dan
                fasilitas kesehatan dalam satu platform terintegrasi.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Layanan</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Konsultasi Online
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Janji Temu
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Rekam Medis
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Laboratorium
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-4">
                  Perusahaan
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Tentang Kami
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Karir
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Kontak
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Syarat & Ketentuan
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Kebijakan Privasi
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Lisensi
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>
              © {new Date().getFullYear()} MediCare. Seluruh hak cipta
              dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
