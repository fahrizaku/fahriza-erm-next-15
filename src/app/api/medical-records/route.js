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

    // Handle prescriptions (now supporting multiple and racikan type)
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

        // Check if this is a racikan prescription
        const isRacikan = prescriptionData.type === "Racikan";

        // Create prescription
        await db.prescription.create({
          data: {
            medicalRecordId: medicalRecord.id,
            notes: prescriptionData.notes || null,
            prescriptionType: prescriptionData.type || null,
            // Add the dosage field for racikan prescriptions
            dosage: isRacikan ? prescriptionData.dosage : null,
            items: {
              create: prescriptionData.items.map((item) => ({
                manualDrugName: item.manualDrugName,
                drugId: item.drugId || null,
                // For racikan items, don't store individual dosages
                // For regular prescriptions, store dosage at item level
                dosage: isRacikan ? null : item.dosage,
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
          prescriptionType: data.prescription.type || "Main",
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

// GET endpoint for retrieving all medical records - updated to include dosage field
export async function GET(request) {
  try {
    // Membaca query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Menghitung offset untuk pagination
    const skip = (page - 1) * limit;

    // Membuat kondisi filter
    const where = {};

    if (search) {
      where.OR = [
        {
          patient: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          patient: {
            no_rm: {
              equals: isNaN(parseInt(search)) ? undefined : parseInt(search),
            },
          },
        },
        {
          patient: {
            nik: {
              contains: search,
            },
          },
        },
      ];
    }

    // Filter tanggal kunjungan
    if (startDate || endDate) {
      where.visitDate = {};

      if (startDate) {
        where.visitDate.gte = new Date(startDate);
      }

      if (endDate) {
        // Atur waktu ke akhir hari
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        where.visitDate.lte = endDateTime;
      }
    }

    // Mengambil total count untuk pagination
    const totalCount = await db.medicalRecord.count({ where });

    // Mengambil data berdasarkan filter
    const medicalRecords = await db.medicalRecord.findMany({
      where,
      include: {
        patient: true,
        screening: true,
        prescriptions: {
          include: {
            items: {
              include: {
                drug: true,
              },
            },
          },
        },
      },
      orderBy: {
        visitDate: "desc",
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      data: medicalRecords,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return NextResponse.json(
      { error: "Failed to fetch medical records" },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}
