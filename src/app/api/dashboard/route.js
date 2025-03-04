import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Menggunakan Promise.all untuk menjalankan semua query secara parallel
    let [generalPatients, bpjsPatients, storeProducts, prescriptionDrugs] =
      await Promise.all([
        // Menghitung pasien umum (non-BPJS)
        db.patient
          .count({
            where: {
              isBPJS: false,
            },
          })
          .catch(() => 0),

        // Menghitung pasien BPJS
        db.patientBPJS.count().catch(() => 0),

        // Menghitung produk apotek
        db.drugStoreProduct.count().catch(() => 0),

        // Menghitung obat resep
        db.drugPrescription.count().catch(() => 0),
      ]);

    // Memastikan nilai yang dikembalikan adalah angka valid
    generalPatients = generalPatients || 0;
    bpjsPatients = bpjsPatients || 0;
    storeProducts = storeProducts || 0;
    prescriptionDrugs = prescriptionDrugs || 0;

    // Menyusun data untuk response
    const dashboardData = {
      pasienUmum: generalPatients.toString(),
      pasienBPJS: bpjsPatients.toString(),
      produkApotek: storeProducts.toString(),
      obatResep: prescriptionDrugs.toString(),
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Mengembalikan objek dengan nilai default string jika terjadi error
    return NextResponse.json(
      {
        pasienUmum: "0",
        pasienBPJS: "0",
        produkApotek: "0",
        obatResep: "0",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    // Memastikan koneksi Prisma ditutup dengan benar
    await db.$disconnect();
  }
}
