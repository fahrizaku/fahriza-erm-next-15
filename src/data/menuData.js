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
} from "lucide-react";

const menuCategories = [
  {
    category: "Dashboard", // Kategori baru untuk Dashboard
    items: [
      {
        title: "Dashboard",
        icon: <LayoutDashboard size={20} />, // Menggunakan ikon LayoutDashboard
        href: "/", // Tautan ke halaman dashboard
      },
    ],
  },
  {
    category: "Pasien",
    items: [
      {
        title: "Data Pasien",
        icon: <User size={20} />, // Mengubah ke icon Users untuk representasi semua pasien
        href: "/pasien",
      },
      {
        title: "Riwayat Kunjungan",
        icon: <History size={20} />, // Menggunakan ikon History untuk riwayat kunjungan
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
        title: "Laboratorium",
        icon: <Microscope size={20} />,
        href: "/laboratorium",
      },
      {
        title: "Doctor's Examination",
        icon: <Stethoscope size={20} />,
        href: "/rawat-jalan/pemeriksaan-dokter",
      },
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
