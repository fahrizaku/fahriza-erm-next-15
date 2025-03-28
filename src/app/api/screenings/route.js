// app/api/screenings/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Create a new screening entry
export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.patientId || !data.complaints) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // If trying to update patient with BPJS, check if the BPJS number already exists
    if (data.isBPJSActive && data.no_bpjs && data.updatePatientBPJS) {
      // Check if BPJS number already exists for another patient
      const existingPatient = await db.patient.findFirst({
        where: {
          no_bpjs: data.no_bpjs,
          id: {
            not: data.patientId, // Exclude current patient
          },
        },
      });

      if (existingPatient) {
        return NextResponse.json(
          {
            success: false,
            message: "Nomor BPJS telah terdaftar pada pasien lain",
          },
          { status: 400 }
        );
      }
    }

    // Generate a queue number (get highest queue number for today + 1)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const latestQueue = await db.outpatientQueue.findFirst({
      where: {
        createdAt: {
          gte: today,
        },
      },
      orderBy: {
        queueNumber: "desc",
      },
    });

    const queueNumber = latestQueue ? latestQueue.queueNumber + 1 : 1;

    // If isBPJSActive is true and the patient doesn't have BPJS information,
    // update patient record with BPJS number
    if (data.isBPJSActive && data.no_bpjs && data.updatePatientBPJS) {
      await db.patient.update({
        where: { id: data.patientId },
        data: {
          isBPJS: true,
          no_bpjs: data.no_bpjs,
        },
      });
    }

    // Create the screening entry with the updated schema fields
    const screening = await db.screening.create({
      data: {
        patientId: data.patientId,
        complaints: data.complaints,
        temperature: data.temperature ? parseFloat(data.temperature) : null,
        systolicBP: data.systolicBP ? parseInt(data.systolicBP) : null,
        diastolicBP: data.diastolicBP ? parseInt(data.diastolicBP) : null,
        pulse: data.pulse ? parseInt(data.pulse) : null,
        respiratoryRate: data.respiratoryRate
          ? parseInt(data.respiratoryRate)
          : null,
        weight: data.weight ? parseFloat(data.weight) : null,
        height: data.height ? parseInt(data.height) : null,
        waistCircumference: data.waistCircumference
          ? parseFloat(data.waistCircumference)
          : null,
        oxygenSaturation: data.oxygenSaturation
          ? parseFloat(data.oxygenSaturation)
          : null,
        isBPJSActive: data.isBPJSActive || false,
        status: "waiting",
        queueNumber: queueNumber,
      },
    });

    // Create a queue entry
    await db.outpatientQueue.create({
      data: {
        screeningId: screening.id,
        queueNumber: queueNumber,
        status: "waiting",
      },
    });

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

    return NextResponse.json({
      success: true,
      screening,
      queueNumber,
    });
  } catch (error) {
    console.error("Error creating screening:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create screening",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
