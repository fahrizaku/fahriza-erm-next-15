import {
  Package,
  Users,
  ClipboardCheck,
  Search,
  Stethoscope,
  FileText,
  UserPlus,
  ListOrdered,
  ShoppingCart,
  User,
  Pill,
  LayoutDashboard,
  Folder,
  History,
  Microscope,
  Flask,
  FileSpreadsheet,
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
        title: "Produk Apotek",
        icon: <Package size={20} />,
        href: "/apotek/produk",
      },
      {
        title: "Obat Resep",
        icon: <Pill size={20} />,
        href: "/apotek/obat-resep",
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
