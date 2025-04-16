import {
  Package,
  Users,
  Stethoscope,
  FileText,
  User,
  LayoutDashboard,
  Folder,
  History,
  Microscope,
  Car,
} from "lucide-react";

const menuCategories = [
  {
    category: "Dashboard",
    items: [
      {
        title: "Dashboard",
        icon: <LayoutDashboard size={20} />,
        href: "/",
      },
    ],
  },
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
  {
    category: "Laboratorium", // Kategori baru untuk Laboratorium
    items: [
      {
        title: "Pemeriksaan Lab",
        icon: <Microscope size={20} />,
        href: "/laboratorium",
      },
      // {
      //   title: "Hasil Lab",
      //   icon: <FileSpreadsheet size={20} />,
      //   href: "/laboratorium/",
      // },
    ],
  },
  {
    category: "Apotek",
    items: [
      {
        title: "Antrian Resep",
        icon: <FileText size={20} />,
        href: "/apotek/antrian-resep",
      },
      // {
      //   title: "Transaksi",
      //   icon: <ShoppingCart size={20} />,
      //   href: "/apotek/transaksi",
      // },
      {
        title: "Obat dan Produk",
        icon: <Package size={20} />,
        href: "/apotek/produk",
      },
      // {
      //   title: "Data Obat Asist",
      //   icon: <Pill size={20} />,
      //   href: "/apotek/obat-resep",
      // },
      {
        title: "Supplier",
        icon: <Car size={20} />,
        href: "/apotek/supplier",
      },
    ],
  },
  {
    category: "Lain-lain",
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
    ],
  },
];

export default menuCategories;
