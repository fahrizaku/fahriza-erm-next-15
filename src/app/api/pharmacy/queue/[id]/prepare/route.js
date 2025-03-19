// /app/api/pharmacy/queue/[id]/prepare/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(request, { params }) {
  try {
    // Await params before accessing the id property
    const resolvedParams = await params;
    const medicalRecordId = parseInt(resolvedParams.id);

    const data = await request.json();

    // Validate pharmacist name is provided
    if (!data.pharmacistName) {
      return NextResponse.json(
        { success: false, message: "Pharmacist name is required" },
        { status: 400 }
      );
    }

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
        status: "preparing",
        pharmacistName: data.pharmacistName,
        startedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      patientName: queueItem.medicalRecord.patient.name,
      message: "Preparation started",
    });
  } catch (error) {
    console.error("Error updating pharmacy queue:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update pharmacy queue" },
      { status: 500 }
    );
  }
}
