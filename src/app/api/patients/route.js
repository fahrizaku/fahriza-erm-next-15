import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");
    const sortField = searchParams.get("sortField") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const patientType = searchParams.get("type") || "all"; // 'regular', 'bpjs', or 'all'
    const skip = (page - 1) * limit;

    // Validate sort field - only allow specific fields
    const validSortFields = ["no_rm", "updatedAt"];
    const finalSortField = validSortFields.includes(sortField)
      ? sortField
      : "no_rm";

    let patients = [];
    let totalPatients = 0;

    // Create a filter for updatedAt when needed
    let whereClause = {};
    if (finalSortField === "updatedAt") {
      whereClause = {
        updatedAt: {
          not: null,
        },
      };
    }

    // Fetch patients based on the requested type
    if (patientType === "regular" || patientType === "all") {
      const regularPatients = await db.patient.findMany({
        where: whereClause,
        take: patientType === "all" ? Math.ceil(limit / 2) : limit,
        skip: patientType === "all" ? Math.ceil(skip / 2) : skip,
        orderBy: {
          [finalSortField]: sortOrder === "desc" ? "desc" : "asc",
        },
      });

      patients = [
        ...regularPatients.map((p) => ({ ...p, patientType: "regular" })),
      ];

      if (patientType === "regular") {
        totalPatients = await db.patient.count({ where: whereClause });
      }
    }

    if (patientType === "bpjs" || patientType === "all") {
      const bpjsPatients = await db.patientBPJS.findMany({
        where: whereClause,
        take: patientType === "all" ? Math.ceil(limit / 2) : limit,
        skip: patientType === "all" ? Math.ceil(skip / 2) : skip,
        orderBy: {
          [finalSortField]: sortOrder === "desc" ? "desc" : "asc",
        },
      });

      patients = [
        ...patients,
        ...bpjsPatients.map((p) => ({ ...p, patientType: "bpjs" })),
      ];

      if (patientType === "bpjs") {
        totalPatients = await db.patientBPJS.count({ where: whereClause });
      }
    }

    // If fetching all patients, get combined total
    if (patientType === "all") {
      const regularCount = await db.patient.count({ where: whereClause });
      const bpjsCount = await db.patientBPJS.count({ where: whereClause });
      totalPatients = regularCount + bpjsCount;

      // Sort the combined results
      patients.sort((a, b) => {
        // Skip comparison if either value is null when sorting by updatedAt
        if (
          finalSortField === "updatedAt" &&
          (!a[finalSortField] || !b[finalSortField])
        ) {
          return 0;
        }

        if (sortOrder === "asc") {
          return a[finalSortField] > b[finalSortField] ? 1 : -1;
        } else {
          return a[finalSortField] < b[finalSortField] ? 1 : -1;
        }
      });

      // Apply limit after sorting
      patients = patients.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      patients,
      pagination: {
        total: totalPatients,
        pages: Math.ceil(totalPatients / limit),
        page,
        limit,
        hasMore: skip + patients.length < totalPatients,
      },
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch patients",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
