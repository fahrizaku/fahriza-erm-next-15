// app/api/patients/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { no_rm, name, address } = body;

    // Validate input
    if (!no_rm || !name) {
      return NextResponse.json(
        { message: "No RM and Name are required fields" },
        { status: 400 }
      );
    }

    // Ensure no_rm is an integer
    const rmNumber = parseInt(no_rm, 10);
    if (isNaN(rmNumber)) {
      return NextResponse.json(
        { message: "No RM must be a valid number" },
        { status: 400 }
      );
    }

    // Try to create a new Patient record
    try {
      const newPatient = await db.patient.create({
        data: {
          no_rm: rmNumber,
          name,
          address,
          isBPJS: false, // Default value since it's not provided in the form
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Patient added successfully",
          data: newPatient,
        },
        { status: 201 }
      );
    } catch (error) {
      // Check if the error is due to a duplicate no_rm
      if (error.code === "P2002" && error.meta?.target?.includes("no_rm")) {
        // If no_rm already exists, add to PatientDouble
        const patientDouble = await db.patientDouble.create({
          data: {
            no_rm: rmNumber,
            name,
            address,
          },
        });

        return NextResponse.json(
          {
            success: true,
            message: "Duplicate RM number detected. Added to PatientDouble.",
            data: patientDouble,
          },
          { status: 201 }
        );
      }

      // If it's another type of error, throw it to be caught by the outer catch
      throw error;
    }
  } catch (error) {
    console.error("Error adding patient:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}
