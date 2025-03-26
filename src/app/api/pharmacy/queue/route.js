import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";

    // Build query conditions
    const where = {};
    if (status !== "all") {
      where.status = status;
    }

    // Get today's date for filtering (optional)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // You could add date filtering if needed
    where.createdAt = { gte: today };

    // Fetch pharmacy queue with related data
    const queueData = await db.pharmacyQueue.findMany({
      where,
      include: {
        medicalRecord: {
          include: {
            patient: true,
            screening: true, // Include the screening to access isBPJSActive
            prescriptions: {
              include: {
                items: true,
              },
            },
          },
        },
      },
      orderBy: [{ status: "asc" }, { queueNumber: "asc" }],
    });

    // Transform data for frontend
    const formattedQueue = queueData.map((item) => {
      const patient = item.medicalRecord.patient;
      const screening = item.medicalRecord.screening;
      const prescriptions = item.medicalRecord.prescriptions;

      // Count total prescription items
      const itemCount = prescriptions.reduce(
        (total, rx) => total + rx.items.length,
        0
      );

      return {
        id: item.id,
        medicalRecordId: item.medicalRecordId,
        queueNumber: item.queueNumber,
        status: item.status,
        patientId: patient.id,
        patientName: patient.name,
        birthDate: patient.birthDate,
        gender: patient.gender,
        isBPJSActive: screening?.isBPJSActive || false, // Get from screening instead of patient
        diagnosis: item.medicalRecord.diagnosis,
        visitType: item.medicalRecord.visitType, // Added visitType from medicalRecord
        pharmacistName: item.pharmacistName,
        notes: item.notes,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        prescriptionCount: prescriptions.length,
        prescriptionItemCount: itemCount,
      };
    });

    return NextResponse.json({
      success: true,
      queue: formattedQueue,
    });
  } catch (error) {
    console.error("Error fetching pharmacy queue:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch pharmacy queue" },
      { status: 500 }
    );
  }
}
