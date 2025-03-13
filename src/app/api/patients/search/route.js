//api/patients/search/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
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

    // Create where clause for name or RM search
    let whereClause = {};

    if (query) {
      // Try parsing the query as an integer for RM number search
      const rmNumber = parseInt(query);

      if (!isNaN(rmNumber)) {
        // If it's a valid number, search by exact RM match
        whereClause = { no_rm: rmNumber };
      } else {
        // Otherwise, search by name
        whereClause = { name: { contains: query, mode: "insensitive" } };
      }
    }

    // Add updatedAt not null condition when sorting by updatedAt
    if (finalSortField === "updatedAt") {
      whereClause = {
        ...whereClause,
        updatedAt: { not: null },
      };
    }

    // Add patient type filter if specified
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

    // Fetch patients based on filters
    const patients = await db.patient.findMany({
      where: whereClause,
      take: limit,
      skip: skip,
      orderBy: {
        [finalSortField]: sortOrder === "desc" ? "desc" : "asc",
      },
    });

    // Count total patients for pagination
    const totalPatients = await db.patient.count({ where: whereClause });

    // Add patientType property to each patient object for frontend compatibility
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
    console.error("Error searching patients:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to search patients",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
