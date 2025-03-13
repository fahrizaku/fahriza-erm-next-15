// /app/api/patients/next-rm/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    // Find the highest RM number in the Patient table
    const highestRM = await db.patient.findFirst({
      orderBy: {
        no_rm: "desc",
      },
      select: {
        no_rm: true,
      },
    });

    const nextRmNumber = (highestRM?.no_rm || 0) + 1;

    return NextResponse.json({
      success: true,
      nextRmNumber,
    });
  } catch (error) {
    console.error("Error fetching next RM number:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch next RM number",
      },
      { status: 500 }
    );
  }
}
