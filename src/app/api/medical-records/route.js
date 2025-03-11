// /app/api/medical-records/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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

    // Create medical record first
    const medicalRecord = await db.medicalRecord.create({
      data: {
        patientId: data.patientId,
        screeningId: data.screeningId,
        diagnosis: data.diagnosis,
        icdCode: data.icdCode || null,
        clinicalNotes: data.clinicalNotes || null,
        doctorName: data.doctorName,
        visitType: "outpatient",
      },
    });

    // Handle prescriptions (now supporting multiple)
    if (
      data.prescriptions &&
      Array.isArray(data.prescriptions) &&
      data.prescriptions.length > 0
    ) {
      // Create each prescription
      for (const prescriptionData of data.prescriptions) {
        // Validate prescription data
        if (!prescriptionData.items || !Array.isArray(prescriptionData.items)) {
          continue; // Skip invalid prescription
        }

        // Create prescription
        await db.prescription.create({
          data: {
            medicalRecordId: medicalRecord.id,
            notes: prescriptionData.notes || null,
            prescriptionType: prescriptionData.type || null,
            items: {
              create: prescriptionData.items.map((item) => ({
                manualDrugName: item.manualDrugName,
                drugId: item.drugId || null,
                dosage: item.dosage,
                quantity: item.quantity,
              })),
            },
          },
        });
      }
    } else if (data.prescription) {
      // For backward compatibility - handle single prescription
      await db.prescription.create({
        data: {
          medicalRecordId: medicalRecord.id,
          notes: data.prescription.notes || null,
          items: {
            create: data.prescription.items.map((item) => ({
              manualDrugName: item.manualDrugName,
              drugId: item.drugId || null,
              dosage: item.dosage,
              quantity: item.quantity,
            })),
          },
        },
      });
    }

    // Update screening status to "completed"
    await db.screening.update({
      where: {
        id: data.screeningId,
      },
      data: {
        status: "completed",
      },
    });

    // Update queue status
    await db.outpatientQueue.updateMany({
      where: {
        screeningId: data.screeningId,
      },
      data: {
        status: "completed",
      },
    });

    return NextResponse.json({
      success: true,
      medicalRecordId: medicalRecord.id,
    });
  } catch (error) {
    console.error("Error creating medical record:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create medical record" },
      { status: 500 }
    );
  }
}

// GET endpoint for retrieving all medical records
export async function GET(request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // Build the query
    const whereClause = {};
    if (patientId) {
      whereClause.patientId = parseInt(patientId);
    }

    // Get medical records with pagination
    const medicalRecords = await db.medicalRecord.findMany({
      where: whereClause,
      orderBy: {
        visitDate: "desc",
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            no_rm: true,
            isBPJS: true,
          },
        },
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await db.medicalRecord.count({
      where: whereClause,
    });

    return NextResponse.json({
      success: true,
      medicalRecords,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch medical records" },
      { status: 500 }
    );
  }
}
