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

    // Handle multiple diagnoses format
    let diagnosisText = data.diagnosis;
    let icdCode = data.icdCode || null;

    // Check if diagnosis is in JSON format (multiple diagnoses)
    try {
      if (data.diagnosis && data.diagnosis.startsWith("[")) {
        const diagnosesArray = JSON.parse(data.diagnosis);
        if (Array.isArray(diagnosesArray) && diagnosesArray.length > 0) {
          // For the database diagnosis field, we'll store the JSON array as a string
          // This maintains the multiple diagnoses while using the existing schema
          diagnosisText = data.diagnosis; // keep as JSON string

          // For backward compatibility, use the first diagnosis for the icdCode field
          icdCode = diagnosesArray[0]?.icdCode || null;
        }
      }
    } catch (error) {
      // If parsing fails, use the diagnosis field as-is
      console.error("Error parsing diagnoses JSON:", error);
    }

    // Create medical record first
    const medicalRecord = await db.medicalRecord.create({
      data: {
        patientId: data.patientId,
        screeningId: data.screeningId,
        diagnosis: diagnosisText,
        icdCode: icdCode,
        clinicalNotes: data.clinicalNotes || null,
        doctorName: data.doctorName,
        visitType: "outpatient",
      },
    });

    // Handle prescriptions (now supporting multiple and racikan type)
    let hasPrescriptions = false;
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
                // For racikan items, don't store individual dosages
                // For regular prescriptions, store dosage at item level
                dosage: isRacikan ? null : item.dosage,
                quantity: item.quantity,
              })),
            },
          },
        });
        hasPrescriptions = true;
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
      hasPrescriptions = true;
    }

    // Process allergies data if exists
    if (data.allergies && data.allergies.length > 0) {
      // Filter out empty allergy records
      const validAllergies = data.allergies.filter(
        (allergy) => allergy.allergyName && allergy.allergyName.trim() !== ""
      );

      for (const allergy of validAllergies) {
        if (allergy.existingAllergyId) {
          // For existing allergies, check if they were modified
          const existingAllergy = await db.patientAllergy.findUnique({
            where: { id: allergy.existingAllergyId },
          });

          if (existingAllergy) {
            // Compare if any fields were changed
            const isModified =
              existingAllergy.allergyName !== allergy.allergyName ||
              existingAllergy.allergyType !== allergy.allergyType ||
              existingAllergy.severity !== allergy.severity ||
              existingAllergy.reaction !== allergy.reaction ||
              existingAllergy.notes !== allergy.notes ||
              existingAllergy.status !== allergy.status;

            // Update only if modified or just update reportedAt if not modified
            await db.patientAllergy.update({
              where: { id: allergy.existingAllergyId },
              data: isModified
                ? {
                    allergyName: allergy.allergyName,
                    allergyType: allergy.allergyType || null,
                    severity: allergy.severity || null,
                    reaction: allergy.reaction || null,
                    notes: allergy.notes || null,
                    status: allergy.status || "aktif",
                    reportedAt: new Date(), // Update reportedAt on modification
                  }
                : {
                    reportedAt: new Date(), // Only update reportedAt if not modified
                  },
            });
          }
        } else {
          // For new allergies, create new records
          await db.patientAllergy.create({
            data: {
              patientId: data.patientId,
              allergyName: allergy.allergyName,
              allergyType: allergy.allergyType || null,
              severity: allergy.severity || null,
              reaction: allergy.reaction || null,
              notes: allergy.notes || null,
              status: allergy.status || "aktif",
              reportedAt: new Date(),
            },
          });
        }
      }
    }

    // Create pharmacy queue entry if there are prescriptions
    let pharmacyQueueNumber = null;
    if (hasPrescriptions) {
      // Generate pharmacy queue number (get highest queue number for today + 1)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const latestPharmacyQueue = await db.pharmacyQueue.findFirst({
        where: {
          createdAt: {
            gte: today,
          },
        },
        orderBy: {
          queueNumber: "desc",
        },
      });

      pharmacyQueueNumber = latestPharmacyQueue
        ? latestPharmacyQueue.queueNumber + 1
        : 1;

      // Create pharmacy queue entry
      await db.pharmacyQueue.create({
        data: {
          medicalRecordId: medicalRecord.id,
          queueNumber: pharmacyQueueNumber,
          status: "waiting",
          notes: data.pharmacyNotes || null,
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
      pharmacyQueueNumber: pharmacyQueueNumber,
      pharmacyQueueCreated: hasPrescriptions,
    });
  } catch (error) {
    console.error("Error creating medical record:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create medical record",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET endpoint for retrieving all medical records - updated to include multiple diagnoses
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
        patient: {
          include: {
            allergies: true, // Include patient allergies in the response
          },
        },
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

    // Process medical records to handle multiple diagnoses format
    const processedRecords = medicalRecords.map((record) => {
      // Try to parse diagnosis field as JSON for multiple diagnoses
      try {
        if (record.diagnosis && record.diagnosis.startsWith("[")) {
          const parsedDiagnoses = JSON.parse(record.diagnosis);
          if (Array.isArray(parsedDiagnoses)) {
            // Add a new field for the UI to use
            return {
              ...record,
              diagnosesArray: parsedDiagnoses,
              // Keep original fields for backward compatibility
            };
          }
        }
      } catch (e) {
        // If parsing fails, it's not in JSON format
      }

      // For records with traditional single diagnosis format
      return {
        ...record,
        diagnosesArray: [
          {
            icdCode: record.icdCode || "",
            description: record.diagnosis || "",
          },
        ],
      };
    });

    return NextResponse.json({
      data: processedRecords,
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
