// /app/api/screenings/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Create a new screening entry
export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.patientId || !data.complaints) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate a queue number (get highest queue number for today + 1)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const latestQueue = await db.outpatientQueue.findFirst({
      where: {
        createdAt: {
          gte: today,
        },
      },
      orderBy: {
        queueNumber: "desc",
      },
    });

    const queueNumber = latestQueue ? latestQueue.queueNumber + 1 : 1;

    // Create the screening entry
    const screening = await db.screening.create({
      data: {
        patientId: data.patientId,
        complaints: data.complaints,
        temperature: data.temperature,
        bloodPressure: data.bloodPressure,
        pulse: data.pulse,
        respiratoryRate: data.respiratoryRate,
        weight: data.weight,
        height: data.height,
        status: "waiting",
        queueNumber: queueNumber,
      },
    });

    // Create a queue entry
    await db.outpatientQueue.create({
      data: {
        screeningId: screening.id,
        queueNumber: queueNumber,
        status: "waiting",
      },
    });

    return NextResponse.json({
      success: true,
      screening,
      queueNumber,
    });
  } catch (error) {
    console.error("Error creating screening:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create screening" },
      { status: 500 }
    );
  }
}
