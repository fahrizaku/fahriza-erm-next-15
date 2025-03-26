// app/api/patients/[id]/allergies/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET handler untuk mengambil daftar alergi pasien
export async function GET(request, { params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json(
      { success: false, message: "Invalid patient ID" },
      { status: 400 }
    );
  }

  try {
    // Periksa apakah pasien ada
    const patient = await db.patient.findUnique({
      where: { id: parseInt(id) },
    });

    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    // Ambil semua alergi untuk pasien ini
    const allergies = await db.patientAllergy.findMany({
      where: { patientId: parseInt(id) },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, allergies });
  } catch (error) {
    console.error("Error fetching patient allergies:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch allergies data" },
      { status: 500 }
    );
  }
}

// POST handler untuk menambahkan alergi baru
export async function POST(request, { params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json(
      { success: false, message: "Invalid patient ID" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    // Validasi input
    if (!body.allergyName) {
      return NextResponse.json(
        { success: false, message: "Nama alergi harus diisi" },
        { status: 400 }
      );
    }

    // Periksa apakah pasien ada
    const patient = await db.patient.findUnique({
      where: { id: parseInt(id) },
    });

    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    // Buat rekaman alergi baru
    const newAllergy = await db.patientAllergy.create({
      data: {
        patientId: parseInt(id),
        allergyName: body.allergyName,
        allergyType: body.allergyType || null,
        severity: body.severity || null,
        reaction: body.reaction || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Alergi berhasil ditambahkan",
      allergy: newAllergy,
    });
  } catch (error) {
    console.error("Error adding patient allergy:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add allergy data" },
      { status: 500 }
    );
  }
}
