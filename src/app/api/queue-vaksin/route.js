// /api/queue-vaksin/route.js
import { NextResponse } from "next/server";
import { getTodayQueueStats } from "@/utils/queueManager";

// GET - Ambil statistik antrian hari ini
export async function GET(req) {
  try {
    const stats = await getTodayQueueStats();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error in queue-vaksin API:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data antrian: " + error.message },
      { status: 500 }
    );
  }
}
