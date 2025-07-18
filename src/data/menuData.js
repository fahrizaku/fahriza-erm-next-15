import {
  Package,
  Users,
  Stethoscope,
  FileText,
  User,
  Folder,
  History,
  Microscope,
  Car,
  Database,
  Store,
  Syringe,
} from "lucide-react";

const menuCategories = [
  {
    category: "Pasien",
    items: [
      {
        title: "Data Pasien",
        icon: <User size={20} />,
        href: "/pasien",
      },
      {
        title: "Riwayat Kunjungan",
        icon: <History size={20} />,
        href: "/pasien/riwayat-kunjungan",
      },
    ],
  },
  {
    category: "Rawat Jalan",
    items: [
      {
        title: "Antrian",
        icon: <Users size={20} />,
        href: "/rawat-jalan/antrian",
      },
      {
        title: "Pemeriksaan Dokter",
        icon: <Stethoscope size={20} />,
        href: "/rawat-jalan/pemeriksaan-dokter",
      },
    ],
  },
  // {
  //   category: "Laboratorium", // Kategori baru untuk Laboratorium
  //   items: [
  //     {
  //       title: "Pemeriksaan Lab",
  //       icon: <Microscope size={20} />,
  //       href: "/laboratorium",
  //     },
  //     // {
  //     //   title: "Hasil Lab",
  //     //   icon: <FileSpreadsheet size={20} />,
  //     //   href: "/laboratorium/",
  //     // },
  //   ],
  // },
  {
    category: "Apotek",
    items: [
      {
        title: "Antrian Resep",
        icon: <FileText size={20} />,
        href: "/apotek/antrian-resep",
      },
      {
        title: "Data Obat & Produk",
        icon: <Package size={20} />,
        href: "/apotek/produk",
      },
      {
        title: "Data Supplier",
        icon: <Car size={20} />,
        href: "/apotek/supplier",
      },
      {
        title: "Manajemen Apotek",
        icon: <Store size={20} />,
        href: "/apotek/dashboard",
      },
    ],
  },
  {
    category: "Vaksin",
    items: [
      {
        title: "Form Meningitis",
        icon: <FileText size={20} />,
        href: "/vaksin/meningitis-form",
      },
      {
        title: "Files",
        icon: <Folder size={20} />,
        href: "/file-sharing",
      },
      // {
      //   title: "Data Vaksin",
      //   icon: <Syringe size={20} />,
      //   href: "/vaksin/kelola-data",
      // },
    ],
  },
  {
    category: "Lain-lain",
    items: [
      {
        title: "ICD-10 Search",
        icon: <Database size={20} />,
        href: "/icd-search",
      },
    ],
  },
];

export default menuCategories;
