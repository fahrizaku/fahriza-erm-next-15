import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");
    const sortField = searchParams.get("sortField") || "updatedAt";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const patientType = searchParams.get("type") || "all"; // 'regular', 'bpjs', or 'all'
    const skip = (page - 1) * limit;

    // Validate sort field - only allow specific fields
    const validSortFields = ["no_rm", "updatedAt"];
    const finalSortField = validSortFields.includes(sortField)
      ? sortField
      : "no_rm";

    // Create a filter for updatedAt when needed
    let whereClause = {};
    if (finalSortField === "updatedAt") {
      whereClause = {
        updatedAt: {
          not: null,
        },
      };
    }

    // Add filter based on patient type
    if (patientType === "regular") {
      whereClause = {
        ...whereClause,
        isBPJS: false,
      };
    } else if (patientType === "bpjs") {
      whereClause = {
        ...whereClause,
        isBPJS: true,
      };
    }

    // Fetch patients based on the filters
    const patients = await db.patient.findMany({
      where: whereClause,
      take: limit,
      skip: skip,
      orderBy: {
        [finalSortField]: sortOrder === "desc" ? "desc" : "asc",
      },
    });

    // Get total count for pagination
    const totalPatients = await db.patient.count({ where: whereClause });

    // Add patientType field to each patient object
    const patientsWithType = patients.map((p) => ({
      ...p,
      patientType: p.isBPJS ? "bpjs" : "regular",
    }));

    return NextResponse.json({
      success: true,
      patients: patientsWithType,
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
