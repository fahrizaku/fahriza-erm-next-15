// app/api/medical-records/[id]/route.js
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
      // app/api/medical-records/[id]/route.js (lanjutan)
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

// Update medical record by ID - Simplified approach
export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const data = await request.json();

    console.log("Data yang diterima:", JSON.stringify(data, null, 2));

    // Update medical record basic info
    const updatedMedicalRecord = await db.medicalRecord.update({
      where: { id: id },
      data: {
        diagnosis: data.diagnosis || "",
        icdCode: data.icdCode || "",
        clinicalNotes: data.clinicalNotes || "",
        doctorName: data.doctorName || "",
      },
    });

    // Update screening data
    if (data.screening && data.screening.id) {
      await db.screening.update({
        where: { id: data.screening.id },
        data: {
          temperature: data.screening.temperature,
          systolicBP: data.screening.systolicBP,
          diastolicBP: data.screening.diastolicBP,
          pulse: data.screening.pulse,
          respiratoryRate: data.screening.respiratoryRate,
          weight: data.screening.weight,
          height: data.screening.height,
          oxygenSaturation: data.screening.oxygenSaturation,
          ...(data.screening.waistCircumference !== undefined
            ? {
                waistCircumference: data.screening.waistCircumference,
              }
            : {}),
        },
      });
    }

    // Handle prescriptions - Simplified approach: delete all and recreate
    if (data.prescriptions && Array.isArray(data.prescriptions)) {
      console.log(`Processing ${data.prescriptions.length} prescriptions`);

      try {
        // First, delete all existing prescription items
        const existingPrescriptions = await db.prescription.findMany({
          where: { medicalRecordId: id },
        });

        for (const prescription of existingPrescriptions) {
          await db.prescriptionItem.deleteMany({
            where: { prescriptionId: prescription.id },
          });
        }

        // Then delete all existing prescriptions
        await db.prescription.deleteMany({
          where: { medicalRecordId: id },
        });

        // Now create all prescriptions fresh from the data
        for (const prescriptionData of data.prescriptions) {
          // Create new prescription
          const newPrescription = await db.prescription.create({
            data: {
              medicalRecordId: id,
              notes: prescriptionData.notes || "",
              prescriptionType: prescriptionData.prescriptionType || "Main",
              dosage: prescriptionData.dosage || "",
            },
          });

          console.log(`Created prescription ${newPrescription.id}`);

          // Create all items for this prescription
          if (prescriptionData.items && Array.isArray(prescriptionData.items)) {
            for (const itemData of prescriptionData.items) {
              await db.prescriptionItem.create({
                data: {
                  prescriptionId: newPrescription.id,
                  manualDrugName: itemData.manualDrugName || "",
                  dosage: itemData.dosage || "",
                  quantity: parseInt(itemData.quantity) || 1,
                },
              });
            }

            console.log(
              `Created ${prescriptionData.items.length} items for prescription ${newPrescription.id}`
            );
          }
        }
      } catch (error) {
        console.error("Error processing prescriptions:", error);
        throw new Error(`Error processing prescriptions: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Medical record updated successfully",
      medicalRecord: updatedMedicalRecord,
    });
  } catch (error) {
    console.error("Error updating medical record:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Failed to update medical record: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
