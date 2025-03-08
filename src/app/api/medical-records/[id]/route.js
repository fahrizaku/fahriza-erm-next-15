// /app/api/medical-records/[id]/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get medical record by ID
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    // Check if the ID is for a medical record or a screening
    let medicalRecord;

    // Try to find as medical record ID first
    medicalRecord = await prisma.medicalRecord.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    // If not found, try to find by screening ID
    if (!medicalRecord) {
      medicalRecord = await prisma.medicalRecord.findUnique({
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
    const patient = await prisma.patient.findUnique({
      where: {
        id: medicalRecord.patientId,
      },
    });

    const screening = await prisma.screening.findUnique({
      where: {
        id: medicalRecord.screeningId,
      },
    });

    const prescription = await prisma.prescription.findUnique({
      where: {
        medicalRecordId: medicalRecord.id,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      medicalRecord,
      patient,
      screening,
      prescription,
    });
  } catch (error) {
    console.error("Error fetching medical record:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch medical record" },
      { status: 500 }
    );
  }
}
