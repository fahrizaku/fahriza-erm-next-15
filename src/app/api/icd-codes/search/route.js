// /app/api/icd-codes/search/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
// Search ICD-10 codes
export async function GET(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const term = searchParams.get("term") || "";

    if (term.length < 2) {
      return NextResponse.json({
        success: true,
        results: [],
      });
    }

    // Search ICD codes
    const results = await db.icdCode.findMany({
      where: {
        OR: [
          {
            code: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: term,
              mode: "insensitive",
            },
          },
        ],
      },
      take: 20, // Limit results
    });

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Error searching ICD codes:", error);
    return NextResponse.json(
      { success: false, message: "Failed to search ICD codes" },
      { status: 500 }
    );
  }
}
