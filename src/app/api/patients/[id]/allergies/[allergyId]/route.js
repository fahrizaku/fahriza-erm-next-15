// app/api/patients/[id]/allergies/[allergyId]/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET handler untuk mengambil detail alergi tertentu
export async function GET(request, { params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const allergyId = resolvedParams.allergyId;

  if (!id || isNaN(parseInt(id)) || !allergyId || isNaN(parseInt(allergyId))) {
    return NextResponse.json(
      { success: false, message: "Invalid ID parameters" },
      { status: 400 }
    );
  }

  try {
    // Ambil data alergi
    const allergy = await db.patientAllergy.findUnique({
      where: {
        id: parseInt(allergyId),
        patientId: parseInt(id),
      },
    });

    if (!allergy) {
      return NextResponse.json(
        { success: false, message: "Allergy record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, allergy });
  } catch (error) {
    console.error("Error fetching allergy details:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch allergy data" },
      { status: 500 }
    );
  }
}

// PUT handler untuk memperbarui data alergi
export async function PUT(request, { params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const allergyId = resolvedParams.allergyId;

  if (!id || isNaN(parseInt(id)) || !allergyId || isNaN(parseInt(allergyId))) {
    return NextResponse.json(
      { success: false, message: "Invalid ID parameters" },
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

    // Periksa apakah rekaman alergi ada
    const existingAllergy = await db.patientAllergy.findUnique({
      where: {
        id: parseInt(allergyId),
      },
    });

    if (!existingAllergy || existingAllergy.patientId !== parseInt(id)) {
      return NextResponse.json(
        { success: false, message: "Allergy record not found" },
        { status: 404 }
      );
    }

    // Update rekaman alergi
    const updatedAllergy = await db.patientAllergy.update({
      where: { id: parseInt(allergyId) },
      data: {
        allergyName: body.allergyName,
        allergyType: body.allergyType || null,
        severity: body.severity || null,
        reaction: body.reaction || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Alergi berhasil diperbarui",
      allergy: updatedAllergy,
    });
  } catch (error) {
    console.error("Error updating allergy:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update allergy data" },
      { status: 500 }
    );
  }
}

// DELETE handler untuk menghapus data alergi
export async function DELETE(request, { params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const allergyId = resolvedParams.allergyId;

  if (!id || isNaN(parseInt(id)) || !allergyId || isNaN(parseInt(allergyId))) {
    return NextResponse.json(
      { success: false, message: "Invalid ID parameters" },
      { status: 400 }
    );
  }

  try {
    // Periksa apakah rekaman alergi ada
    const existingAllergy = await db.patientAllergy.findUnique({
      where: { id: parseInt(allergyId) },
    });

    if (!existingAllergy || existingAllergy.patientId !== parseInt(id)) {
      return NextResponse.json(
        { success: false, message: "Allergy record not found" },
        { status: 404 }
      );
    }

    // Hapus rekaman alergi
    await db.patientAllergy.delete({
      where: { id: parseInt(allergyId) },
    });

    return NextResponse.json({
      success: true,
      message: "Alergi berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting allergy:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete allergy data" },
      { status: 500 }
    );
  }
}
