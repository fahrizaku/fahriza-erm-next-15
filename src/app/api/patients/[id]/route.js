// app/api/patients/[id]/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET handler to fetch a single patient by ID
export async function GET(request, { params }) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json(
      { success: false, message: "Invalid patient ID" },
      { status: 400 }
    );
  }

  try {
    // Find patient by ID
    const patient = await db.patient.findUnique({
      where: { id: parseInt(id) },
    });

    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    // Add patientType property for compatibility with frontend
    const patientWithType = {
      ...patient,
      patientType: patient.isBPJS ? "bpjs" : "regular",
    };

    return NextResponse.json({ success: true, patient: patientWithType });
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch patient data" },
      { status: 500 }
    );
  }
}

// PUT handler to update patient data
export async function PUT(request, { params }) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json(
      { success: false, message: "Invalid patient ID" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    // Handle empty NIK by replacing empty string with null
    const nik = body.nik === "" || body.nik === undefined ? null : body.nik;

    // Find patient by ID
    const existingPatient = await db.patient.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPatient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    // Update patient
    const updatedPatient = await db.patient.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        gender: body.gender,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        address: body.address,
        // Keep the existing isBPJS status
        isBPJS: existingPatient.isBPJS,
        // Only update no_bpjs if patient is BPJS
        no_bpjs: existingPatient.isBPJS
          ? body.no_bpjs
          : existingPatient.no_bpjs,
        nik: nik,
        phoneNumber: body.phoneNumber || null,
      },
    });

    // Add patientType property for compatibility with frontend
    const patientWithType = {
      ...updatedPatient,
      patientType: updatedPatient.isBPJS ? "bpjs" : "regular",
    };

    return NextResponse.json({ success: true, patient: patientWithType });
  } catch (error) {
    console.error("Error updating patient:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update patient data: " + error.message,
      },
      { status: 500 }
    );
  }
}

// Handle DELETE request
export async function DELETE(request, { params }) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    // Check if patient has related records before attempting to delete
    const patientId = parseInt(id);

    // Check for related screenings
    const relatedScreenings = await db.screening.findMany({
      where: {
        patientId: patientId,
      },
      select: {
        id: true,
      },
    });

    // Check for related medical records
    const relatedMedicalRecords = await db.medicalRecord.findMany({
      where: {
        patientId: patientId,
      },
      select: {
        id: true,
      },
    });

    // If there are related records, perform a cascade delete
    if (relatedScreenings.length > 0 || relatedMedicalRecords.length > 0) {
      // Delete related prescriptions and prescription items first
      for (const record of relatedMedicalRecords) {
        // Find all prescriptions for this medical record
        const prescriptions = await db.prescription.findMany({
          where: { medicalRecordId: record.id },
        });

        // Delete all prescription items and prescriptions
        for (const prescription of prescriptions) {
          // Delete prescription items first
          await db.prescriptionItem.deleteMany({
            where: { prescriptionId: prescription.id },
          });

          // Delete the prescription
          await db.prescription.delete({
            where: { id: prescription.id },
          });
        }

        // Delete medical record
        await db.medicalRecord.delete({
          where: { id: record.id },
        });
      }

      // Delete screenings that don't have medical records
      await db.screening.deleteMany({
        where: {
          patientId: patientId,
          medicalRecord: null,
        },
      });
    }

    // Once all related records are deleted or if there are no related records,
    // proceed with patient deletion
    await db.patient.delete({
      where: {
        id: patientId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Pasien berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting patient:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus data pasien",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}
