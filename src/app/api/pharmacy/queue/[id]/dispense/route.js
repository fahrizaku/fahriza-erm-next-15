// /app/api/pharmacy/queue/[id]/dispense/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(request, { params }) {
  try {
    // Await params before accessing the id property
    const resolvedParams = await params;
    const medicalRecordId = parseInt(resolvedParams.id);

    // Get patient info for response
    const queueItem = await db.pharmacyQueue.findUnique({
      where: { medicalRecordId },
      include: {
        medicalRecord: {
          include: {
            patient: true,
          },
        },
      },
    });

    if (!queueItem) {
      return NextResponse.json(
        { success: false, message: "Pharmacy queue item not found" },
        { status: 404 }
      );
    }

    // Update pharmacy queue status
    await db.pharmacyQueue.update({
      where: { medicalRecordId },
      data: {
        status: "dispensed",
        dispensedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      patientName: queueItem.medicalRecord.patient.name,
      message: "Prescription has been dispensed",
    });
  } catch (error) {
    console.error("Error updating pharmacy queue:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update pharmacy queue" },
      { status: 500 }
    );
  }
}
