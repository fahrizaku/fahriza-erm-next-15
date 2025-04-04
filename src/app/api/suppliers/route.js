import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all suppliers
export async function GET() {
  try {
    const suppliers = await db.supplier.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return NextResponse.json(
      { error: "Failed to fetch suppliers" },
      { status: 500 }
    );
  }
}

// POST new supplier
export async function POST(req) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.name || body.name.trim() === "") {
      return NextResponse.json(
        { error: "Nama supplier wajib diisi" },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (
      body.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(body.email)
    ) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    // Prepare data for database
    const supplierData = {
      name: body.name,
      contactName: body.contactName || null,
      phone: body.phone || null,
      email: body.email || null,
      address: body.address || null,
      notes: body.notes || null,
    };

    // Create new supplier in database
    const newSupplier = await db.supplier.create({
      data: supplierData,
    });

    return NextResponse.json(newSupplier, { status: 201 });
  } catch (error) {
    console.error("Error creating supplier:", error);
    return NextResponse.json(
      { error: `Gagal menambahkan supplier: ${error.message}` },
      { status: 500 }
    );
  }
}
