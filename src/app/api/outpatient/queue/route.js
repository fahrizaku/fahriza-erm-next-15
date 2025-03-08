// /app/api/outpatient/queue/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Get queue list
export async function GET(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const status = searchParams.get("status") || "waiting";

    // Filter by status unless "all" is specified
    const statusFilter = status === "all" ? {} : { status };

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get queue data
    const queueData = await db.outpatientQueue.findMany({
      where: {
        ...statusFilter,
        createdAt: {
          gte: today,
        },
      },
      orderBy: {
        queueNumber: "asc",
      },
    });

    // Enrich queue data with patient information
    const enrichedQueue = await Promise.all(
      queueData.map(async (queue) => {
        const screening = await db.screening.findUnique({
          where: {
            id: queue.screeningId,
          },
          include: {
            patient: true,
          },
        });

        return {
          ...queue,
          patientName: screening?.patient?.name || "Unknown",
          noRM: screening?.patient?.no_rm || "N/A",
          isBPJS: screening?.patient?.isBPJS || false,
        };
      })
    );

    return NextResponse.json({
      success: true,
      queue: enrichedQueue,
    });
  } catch (error) {
    console.error("Error fetching queue:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch queue data" },
      { status: 500 }
    );
  }
}
