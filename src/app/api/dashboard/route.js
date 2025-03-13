import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Menggunakan Promise.all untuk menjalankan semua query secara parallel
    let [patients, storeProducts] = await Promise.all([
      // Menghitung semua pasien
      db.patient.count().catch(() => 0),

      // Menghitung produk apotek
      db.drugStoreProduct.count().catch(() => 0),
    ]);

    // Memastikan nilai yang dikembalikan adalah angka valid
    patients = patients || 0;
    storeProducts = storeProducts || 0;

    // Menyusun data untuk response
    const dashboardData = {
      pasien: patients.toString(),
      produkApotek: storeProducts.toString(),
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Mengembalikan objek dengan nilai default string jika terjadi error
    return NextResponse.json(
      {
        pasien: "0",
        produkApotek: "0",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    // Memastikan koneksi Prisma ditutup dengan benar
    await db.$disconnect();
  }
}
