// /app/api/patients/next-rm/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const isBPJS = searchParams.get("isBPJS") === "true";

    let nextRmNumber;

    if (isBPJS) {
      // Untuk pasien BPJS, cari nomor RM tertinggi di tabel PatientBPJS
      const highestBPJS = await db.patientBPJS.findFirst({
        orderBy: {
          no_rm: "desc",
        },
        select: {
          no_rm: true,
        },
      });

      nextRmNumber = (highestBPJS?.no_rm || 10000) + 1;
    } else {
      // Untuk pasien umum, cari nomor RM tertinggi di tabel Patient
      const highestRegular = await db.patient.findFirst({
        orderBy: {
          no_rm: "desc",
        },
        select: {
          no_rm: true,
        },
      });

      nextRmNumber = (highestRegular?.no_rm || 0) + 1;
    }

    return NextResponse.json({
      success: true,
      nextRmNumber,
      type: isBPJS ? "BPJS" : "Umum",
    });
  } catch (error) {
    console.error("Error fetching next RM number:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch next RM number",
      },
      { status: 500 }
    );
  }
}
