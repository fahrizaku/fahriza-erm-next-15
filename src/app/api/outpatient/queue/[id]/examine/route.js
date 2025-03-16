// /app/api/outpatient/queue/[id]/examine/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Examine patient from queue
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
        status: "in-progress",
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
      message: "Patient examination started successfully",
      patientName: screening.patient.name,
    });
  } catch (error) {
    console.error("Error starting patient examination:", error);
    return NextResponse.json(
      { success: false, message: "Failed to start patient examination" },
      { status: 500 }
    );
  }
}
