// /app/api/patients/register/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    // Parse request body
    const patientData = await request.json();
    const { isBPJS, ...data } = patientData;

    console.log("Registering patient with data:", { isBPJS, ...data });

    // Format birth date (if provided) or set to null if empty
    // Handle birthDate even if it's an empty string
    if (
      data.birthDate === "" ||
      data.birthDate === null ||
      (typeof data.birthDate === "string" && data.birthDate.trim() === "")
    ) {
      data.birthDate = null;
    } else if (data.birthDate) {
      data.birthDate = new Date(data.birthDate);
    }

    // Check if dateOfBirth field is being used instead of birthDate
    if (data.dateOfBirth !== undefined) {
      if (
        data.dateOfBirth === "" ||
        data.dateOfBirth === null ||
        (typeof data.dateOfBirth === "string" && data.dateOfBirth.trim() === "")
      ) {
        data.dateOfBirth = null;
      } else if (data.dateOfBirth) {
        data.dateOfBirth = new Date(data.dateOfBirth);
      }
    }

    // Ensure no_rm is an integer
    if (data.no_rm) {
      if (typeof data.no_rm === "string") {
        data.no_rm = parseInt(data.no_rm, 10);
      }
      console.log("Using RM number:", data.no_rm, "Type:", typeof data.no_rm);
    }

    // Check for required fields
    if (!data.name) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama pasien wajib diisi",
        },
        { status: 400 }
      );
    }

    if (!data.no_rm) {
      return NextResponse.json(
        {
          success: false,
          message: "Nomor RM wajib diisi",
        },
        { status: 400 }
      );
    }

    // Additional validation for BPJS patients
    if (isBPJS && !data.no_bpjs) {
      return NextResponse.json(
        {
          success: false,
          message: "Nomor BPJS wajib diisi untuk pasien BPJS",
        },
        { status: 400 }
      );
    }

    // Handle empty NIK values
    if (!data.nik || (typeof data.nik === "string" && data.nik.trim() === "")) {
      // Set NIK to null if empty string is provided
      data.nik = null;
    }

    // Handle empty gender values
    if (
      !data.gender ||
      (typeof data.gender === "string" && data.gender.trim() === "")
    ) {
      data.gender = null;
    }
    // Since NIK is no longer unique, we don't need to check for existing NIK

    // Verify BPJS number isn't already used (if applicable)
    if (isBPJS && data.no_bpjs) {
      try {
        const existingBPJS = await db.patientBPJS.findUnique({
          where: { no_bpjs: data.no_bpjs },
        });

        if (existingBPJS) {
          return NextResponse.json(
            {
              success: false,
              message: `Nomor BPJS ${data.no_bpjs} sudah terdaftar`,
            },
            { status: 400 }
          );
        }
      } catch (bpjsError) {
        console.error("Error checking BPJS number:", bpjsError);
        // Continue - this might be a unique constraint violation
      }
    }

    // Save patient data to appropriate table
    let savedPatient;

    try {
      if (isBPJS) {
        // Special handling for BPJS patients
        console.log("Registering BPJS patient with data:", {
          ...data,
          isBPJS: true,
        });

        // Direct creation without duplicate check (let the database handle it)
        savedPatient = await db.patientBPJS.create({
          data: {
            ...data,
            isBPJS: true,
          },
        });
      } else {
        // Special handling for regular patients
        console.log("Registering regular patient with data:", {
          ...data,
          isBPJS: false,
        });

        // Direct creation without duplicate check (let the database handle it)
        savedPatient = await db.patient.create({
          data: {
            ...data,
            isBPJS: false,
          },
        });
      }

      console.log("Patient registered successfully:", savedPatient);

      return NextResponse.json({
        success: true,
        message: "Data pasien berhasil disimpan",
        patientId: savedPatient.id,
      });
    } catch (createError) {
      console.error("Error creating patient record:", createError);

      // Provide detailed error message
      if (createError.code === "P2002") {
        const target = createError.meta?.target[0] || "field";
        return NextResponse.json(
          {
            success: false,
            message: `Data pasien dengan ${target} tersebut sudah ada (${createError.message})`,
            error: createError.code,
            target: createError.meta?.target,
          },
          { status: 400 }
        );
      }

      throw createError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error("Error registering patient:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Gagal menyimpan data pasien: " + (error.message || "Unknown error"),
        error: error.code || "UNKNOWN",
        details: error.stack,
      },
      { status: 500 }
    );
  }
}
