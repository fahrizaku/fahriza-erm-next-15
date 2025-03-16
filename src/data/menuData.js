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
        title: "Registrasi Pasien",
        icon: <UserPlus size={20} />, // Tetap menggunakan UserPlus untuk registrasi
        href: "/pasien/tambah",
      },
      {
        title: "Riwayat Kunjungan",
        icon: <History size={20} />, // Tetap menggunakan UserPlus untuk registrasi
        href: "/pasien/riwayat-kunjungan",
      },
    ],
  },
  // {
  //   category: "Rawat Jalan",
  //   items: [
  //     // {
  //     //   title: "Skrining",
  //     //   icon: <ClipboardCheck size={20} />,
  //     //   href: "/rawat-jalan/screening",
  //     // },
  //     {
  //       title: "Antrian",
  //       icon: <Users size={20} />,
  //       href: "/rawat-jalan/antrian",
  //     },
  //     {
  //       title: "Pemeriksaan",
  //       icon: <Stethoscope size={20} />,
  //       href: "/rawat-jalan/pemeriksaan",
  //     },
  //   ],
  // },
  {
    category: "Apotek",
    items: [
      // {
      //   title: "Resep",
      //   icon: <FileText size={20} />,
      //   href: "/apotek/resep",
      // },
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
