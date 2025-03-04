// app/api/patients/[id]/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET handler to fetch a single patient by ID
export async function GET(request, { params }) {
  const { id } = params;
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
  const { id } = params;

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
  const { id } = params;

  // Get the query parameters
  const { searchParams } = new URL(request.url);
  const isBPJS = searchParams.get("isBPJS") === "true";

  try {
    // Determine which table to delete from based on isBPJS flag
    if (isBPJS) {
      // Delete from PatientBPJS table
      await db.patientBPJS.delete({
        where: {
          id: parseInt(id),
        },
      });
    } else {
      // Delete from Patient table
      await db.patient.delete({
        where: {
          id: parseInt(id),
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
    await db.$disconnect(); // Changed from prisma to db to match the import
  }
}
