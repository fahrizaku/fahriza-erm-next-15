// app/api/medical-records/history/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "15");
    const offset = parseInt(searchParams.get("offset") || "0");
    const search = searchParams.get("search") || "";

    // Get current date at start of day for date comparisons
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Build where clause
    const whereClause = search
      ? {
          OR: [
            { patient: { name: { contains: search, mode: "insensitive" } } },
            {
              patient: {
                no_rm: {
                  equals: isNaN(parseInt(search))
                    ? undefined
                    : parseInt(search),
                },
              },
            },
            { icdCode: { contains: search, mode: "insensitive" } },
            { diagnosis: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    // Get medical records with pagination
    const medicalRecords = await db.medicalRecord.findMany({
      where: whereClause,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            no_rm: true,
            gender: true,
            birthDate: true,
            isBPJS: true,
          },
        },
        screening: {
          select: {
            complaints: true,
            isBPJSActive: true,
          },
        },
      },
      orderBy: {
        visitDate: "desc",
      },
      skip: offset,
      take: limit,
    });

    // Get total count for pagination info
    const totalCount = await db.medicalRecord.count({
      where: whereClause,
    });

    // Organize medical records by date category
    const organizedRecords = {
      today: [],
      yesterday: [],
      older: [],
    };

    medicalRecords.forEach((record) => {
      const recordDate = new Date(record.visitDate);
      recordDate.setHours(0, 0, 0, 0);

      if (recordDate.getTime() === today.getTime()) {
        organizedRecords.today.push(record);
      } else if (recordDate.getTime() === yesterday.getTime()) {
        organizedRecords.yesterday.push(record);
      } else {
        organizedRecords.older.push(record);
      }
    });

    return NextResponse.json({
      success: true,
      data: medicalRecords,
      organized: organizedRecords,
      pagination: {
        total: totalCount,
        offset,
        limit,
        hasMore: offset + medicalRecords.length < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching medical records history:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch medical records history" },
      { status: 500 }
    );
  }
}
