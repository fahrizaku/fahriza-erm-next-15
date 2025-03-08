// app/api/patients/[id]/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET handler to fetch a single patient by ID
export async function GET(request, { params }) {
  // Await params sebelum mengakses propertinya
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const { searchParams } = new URL(request.url);
  const isBPJS = searchParams.get("isBPJS") === "true";

  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json(
      { success: false, message: "Invalid patient ID" },
      { status: 400 }
    );
  }

  try {
    let patient;

    // Pilih tabel berdasarkan parameter isBPJS
    if (isBPJS) {
      // Cari di tabel PatientBPJS
      patient = await db.patientBPJS.findUnique({
        where: { id: parseInt(id) },
      });
    } else {
      // Cari di tabel Patient
      patient = await db.patient.findUnique({
        where: { id: parseInt(id) },
      });
    }

    // Jika tidak ditemukan, coba cari di tabel lainnya
    if (!patient) {
      if (isBPJS) {
        // Jika tidak ditemukan di BPJS, coba cari di Patient dengan no_rm yang sama
        const regularPatient = await db.patient.findUnique({
          where: { id: parseInt(id) },
        });

        if (regularPatient && regularPatient.isBPJS) {
          // Jika ditemukan di Patient dan isBPJS=true, cari di BPJS berdasarkan no_rm
          patient = await db.patientBPJS.findUnique({
            where: { no_rm: regularPatient.no_rm },
          });
        }
      } else {
        // Jika tidak ditemukan di Patient, coba cari di BPJS
        patient = await db.patientBPJS.findUnique({
          where: { id: parseInt(id) },
        });
      }
    }

    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, patient });
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
  // Await params sebelum mengakses propertinya
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

    // Coba cari pasien di kedua tabel
    const regularPatient = await db.patient.findUnique({
      where: { id: parseInt(id) },
    });

    const bpjsPatient = await db.patientBPJS.findUnique({
      where: { id: parseInt(id) },
    });

    // Tentukan pasien yang sedang diedit dan tipe pasien yang sebenarnya
    let currentPatient;
    let isCurrentlyBPJS = false;

    if (bpjsPatient) {
      currentPatient = bpjsPatient;
      isCurrentlyBPJS = true;
    } else if (regularPatient) {
      currentPatient = regularPatient;
      isCurrentlyBPJS = regularPatient.isBPJS;
    } else {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    // Selalu gunakan status BPJS asli, abaikan perubahan status
    // Update di tabel yang sesuai berdasarkan status BPJS saat ini
    if (isCurrentlyBPJS) {
      // If this is a BPJS patient, update in the PatientBPJS table
      const updatedBPJS = await db.patientBPJS.update({
        where: { id: parseInt(id) },
        data: {
          name: body.name,
          gender: body.gender,
          birthDate: body.birthDate ? new Date(body.birthDate) : null,
          address: body.address,
          no_bpjs: body.no_bpjs,
          nik: nik,
          phoneNumber: body.phoneNumber || null, // Add phone number field
        },
      });

      return NextResponse.json({ success: true, patient: updatedBPJS });
    } else {
      // If this is a regular patient, update in the Patient table
      const updatedRegular = await db.patient.update({
        where: { id: parseInt(id) },
        data: {
          name: body.name,
          gender: body.gender,
          birthDate: body.birthDate ? new Date(body.birthDate) : null,
          address: body.address,
          nik: nik,
          isBPJS: currentPatient.isBPJS,
          phoneNumber: body.phoneNumber || null, // Add phone number field
        },
      });

      return NextResponse.json({ success: true, patient: updatedRegular });
    }
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
  // Await params sebelum mengakses propertinya
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Get the query parameters
  const { searchParams } = new URL(request.url);
  const isBPJS = searchParams.get("isBPJS") === "true";

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
      // Option 2: Perform a cascade delete
      // Delete related prescription items and prescriptions first
      for (const record of relatedMedicalRecords) {
        // Check if the medical record has prescriptions
        const prescription = await db.prescription.findUnique({
          where: { medicalRecordId: record.id },
        });

        if (prescription) {
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
    if (isBPJS) {
      // Delete from PatientBPJS table
      await db.patientBPJS.delete({
        where: {
          id: patientId,
        },
      });
    } else {
      // Delete from Patient table
      await db.patient.delete({
        where: {
          id: patientId,
        },
      });
    }

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
