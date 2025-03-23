// /app/api/medical-records/[id]/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Get medical record by ID
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    // Check if the ID is for a medical record or a screening
    let medicalRecord;

    // Try to find as medical record ID first
    medicalRecord = await db.medicalRecord.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    // If not found, try to find by screening ID
    if (!medicalRecord) {
      medicalRecord = await db.medicalRecord.findUnique({
        where: {
          screeningId: parseInt(id),
        },
      });
    }

    if (!medicalRecord) {
      return NextResponse.json(
        { success: false, message: "Medical record not found" },
        { status: 404 }
      );
    }

    // Get related data
    const patient = await db.patient.findUnique({
      where: {
        id: medicalRecord.patientId,
      },
    });

    const screening = await db.screening.findUnique({
      where: {
        id: medicalRecord.screeningId,
      },
    });

    // Get all prescriptions for this medical record
    const prescriptions = await db.prescription.findMany({
      where: {
        medicalRecordId: medicalRecord.id,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Get pharmacy queue information
    const pharmacyQueue = await db.pharmacyQueue.findUnique({
      where: {
        medicalRecordId: medicalRecord.id,
      },
    });

    return NextResponse.json({
      success: true,
      medicalRecord,
      patient,
      screening,
      prescriptions,
      pharmacyQueue, // Include pharmacy queue information in the response
    });
  } catch (error) {
    console.error("Error fetching medical record:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch medical record" },
      { status: 500 }
    );
  }
}
