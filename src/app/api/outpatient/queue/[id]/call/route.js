// /app/api/outpatient/queue/[id]/call/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Call patient from queue
export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    // Update queue status
    const queue = await db.outpatientQueue.update({
      where: {
        screeningId: parseInt(id),
      },
      data: {
        status: "called",
      },
    });

    // Update screening status
    const screening = await db.screening.update({
      where: {
        id: parseInt(id),
      },
      data: {
        status: "in-progress",
      },
      include: {
        patient: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Patient called successfully",
      patientName: screening.patient.name,
    });
  } catch (error) {
    console.error("Error calling patient:", error);
    return NextResponse.json(
      { success: false, message: "Failed to call patient" },
      { status: 500 }
    );
  }
}
