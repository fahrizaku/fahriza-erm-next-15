// app/api/medical-records/patient/[id]/history/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    // Get the patientId from route params
    const resolvedParams = await params;
    const patientId = parseInt(resolvedParams.id);

    if (isNaN(patientId)) {
      return NextResponse.json(
        { success: false, message: "Invalid patient ID" },
        { status: 400 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const search = searchParams.get("search") || "";

    // Get current date at start of day for date comparisons
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Build where clause for search and patientId
    const whereClause = {
      patientId: patientId, // Filter by patient ID
      ...(search
        ? {
            OR: [
              { icdCode: { contains: search, mode: "insensitive" } },
              { diagnosis: { contains: search, mode: "insensitive" } },
              {
                screening: {
                  complaints: { contains: search, mode: "insensitive" },
                  isBPJSActive: { contains: search, mode: "insensitive" },
                },
              },
            ],
          }
        : {}),
    };

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
            temperature: true,
            systolicBP: true,
            diastolicBP: true,
            pulse: true,
            respiratoryRate: true,
            weight: true,
            height: true,
            oxygenSaturation: true,
          },
        },
        prescriptions: {
          include: {
            items: true,
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

    // Get patient details
    const patient = await db.patient.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        no_rm: true,
        name: true,
        gender: true,
        birthDate: true,
        isBPJS: true,
        no_bpjs: true,
        nik: true,
        phoneNumber: true,
        address: true,
      },
    });

    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

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
      patient: patient,
      pagination: {
        total: totalCount,
        offset,
        limit,
        hasMore: offset + medicalRecords.length < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching patient medical records history:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch patient medical records history",
      },
      { status: 500 }
    );
  }
}
