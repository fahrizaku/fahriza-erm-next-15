// /app/api/medical-records/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Create a new medical record
export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (
      !data.patientId ||
      !data.screeningId ||
      !data.diagnosis ||
      !data.doctorName
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Start a transaction
    const result = await db.$transaction(async (prisma) => {
      // Create the medical record
      const medicalRecord = await db.medicalRecord.create({
        data: {
          patientId: data.patientId,
          screeningId: data.screeningId,
          diagnosis: data.diagnosis,
          icdCode: data.icdCode,
          clinicalNotes: data.clinicalNotes,
          doctorName: data.doctorName,
        },
      });

      // Create prescription if provided
      let prescription = null;
      if (data.prescription) {
        prescription = await db.prescription.create({
          data: {
            medicalRecordId: medicalRecord.id,
            notes: data.prescription.notes,
            items: {
              create: data.prescription.items.map((item) => ({
                manualDrugName: item.manualDrugName,
                dosage: item.dosage,
                quantity: item.quantity,
              })),
            },
          },
        });
      }

      // Update screening and queue status
      await db.screening.update({
        where: {
          id: data.screeningId,
        },
        data: {
          status: "completed",
        },
      });

      await db.outpatientQueue.update({
        where: {
          screeningId: data.screeningId,
        },
        data: {
          status: "completed",
        },
      });

      return { medicalRecord, prescription };
    });

    return NextResponse.json({
      success: true,
      medicalRecordId: result.medicalRecord.id,
      message: "Medical record created successfully",
    });
  } catch (error) {
    console.error("Error creating medical record:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create medical record" },
      { status: 500 }
    );
  }
}
