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

    // Verify BPJS number isn't already used (if applicable)
    if (isBPJS && data.no_bpjs) {
      try {
        const existingBPJS = await db.patient.findFirst({
          where: {
            no_bpjs: data.no_bpjs,
            isBPJS: true,
          },
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

    // Save patient data
    try {
      // All patients now go to the Patient table with the isBPJS flag
      const savedPatient = await db.patient.create({
        data: {
          ...data,
          isBPJS: isBPJS || false,
        },
      });

      console.log("Patient registered successfully:", savedPatient);

      return NextResponse.json({
        success: true,
        message: "Data pasien berhasil disimpan",
        patientId: savedPatient.id,
      });
    } catch (createError) {
      console.error("Error creating patient record:", createError);

      // Provide detailed error message for unique constraint violations
      if (createError.code === "P2002") {
        const target = createError.meta?.target[0] || "field";

        // Create user-friendly error messages based on the field
        let errorMessage = "";
        switch (target) {
          case "no_rm":
            errorMessage = `Nomor RM ${data.no_rm} sudah terdaftar`;
            break;
          case "no_bpjs":
            errorMessage = `Nomor BPJS ${data.no_bpjs} sudah terdaftar`;
            break;
          case "nik":
            errorMessage = `NIK ${data.nik} sudah terdaftar`;
            break;
          default:
            errorMessage = `Data dengan ${target} tersebut sudah ada`;
        }

        return NextResponse.json(
          {
            success: false,
            message: errorMessage,
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
