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
  UserCheck,
  Pill,
} from "lucide-react";

const menuCategories = [
  {
    category: "Pasien",
    items: [
      {
        title: "Data Pasien",
        icon: <User size={20} />, // Mengubah ke icon Users untuk representasi semua pasien
        href: "/pasien",
      },
      // {
      //   title: "Registrasi Pasien",
      //   icon: <UserPlus size={20} />, // Tetap menggunakan UserPlus untuk registrasi
      //   href: "/pasien/registrasi-pasien",
      // },
    ],
  },
  // {
  //   category: "Rawat Jalan",
  //   items: [
  //     {
  //       title: "Skrining",
  //       icon: <ClipboardCheck size={20} />,
  //       href: "/rawat-jalan/skrining",
  //     },
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
      {
        title: "Obat Resep",
        icon: <Pill size={20} />,
        href: "/apotek/obat-resep",
      },
    ],
  },
  // {
  //   category: "Vaksin",
  //   items: [
  //     {
  //       title: "Form Meningitis",
  //       icon: <FileText size={20} />,
  //       href: "/vaksin/meningitis-form",
  //     },
  //   ],
  // },
];

export default menuCategories;
