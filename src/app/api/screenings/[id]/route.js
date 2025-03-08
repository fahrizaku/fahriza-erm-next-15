// /app/api/screenings/[id]/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Get screening by ID
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    const screening = await db.screening.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!screening) {
      return NextResponse.json(
        { success: false, message: "Screening not found" },
        { status: 404 }
      );
    }

    // Get patient data
    const patient = await db.patient.findUnique({
      where: {
        id: screening.patientId,
      },
    });

    return NextResponse.json({
      success: true,
      screening,
      patient,
    });
  } catch (error) {
    console.error("Error fetching screening:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch screening" },
      { status: 500 }
    );
  }
}
