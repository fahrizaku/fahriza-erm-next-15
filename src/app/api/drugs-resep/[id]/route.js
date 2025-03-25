// File: app/api/drugs/[id]/route.js

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    // Await params sebelum mengakses propertinya
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    const drug = await db.drugPrescription.findUnique({
      where: { id },
    });

    if (!drug) {
      return NextResponse.json({ error: "Drug not found" }, { status: 404 });
    }

    return NextResponse.json(drug);
  } catch (error) {
    console.error("Error fetching drug:", error);
    return NextResponse.json(
      { error: "Failed to fetch drug" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    // Await params sebelum mengakses propertinya
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.price || !data.stock || !data.unit) {
      return NextResponse.json(
        { error: "Name, price, stock, and unit are required fields" },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (
      isNaN(data.price) ||
      isNaN(data.stock) ||
      (data.purchasePrice && isNaN(data.purchasePrice))
    ) {
      return NextResponse.json(
        { error: "Price, stock, and purchase price must be numbers" },
        { status: 400 }
      );
    }

    const updatedDrug = await db.drugPrescription.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category,
        manufacturer: data.manufacturer,
        purchasePrice: data.purchasePrice ? data.purchasePrice : null,
        price: data.price,
        stock: data.stock,
        expiryDate: data.expiryDate || null,
        unit: data.unit,
      },
    });

    return NextResponse.json(updatedDrug);
  } catch (error) {
    console.error("Error updating drug:", error);
    return NextResponse.json(
      { error: "Failed to update drug" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Await params sebelum mengakses propertinya
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Convert ID to integer since our schema uses Int for ID
    const drugId = parseInt(id, 10);

    if (isNaN(drugId)) {
      return NextResponse.json(
        { error: "Invalid drug ID format" },
        { status: 400 }
      );
    }

    // Check if drug exists
    const drug = await db.drugPrescription.findUnique({
      where: { id: drugId },
    });

    if (!drug) {
      return NextResponse.json({ error: "Drug not found" }, { status: 404 });
    }

    // Delete the drug
    await db.drugPrescription.delete({
      where: { id: drugId },
    });

    return NextResponse.json(
      { message: "Drug deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting drug:", error);
    return NextResponse.json(
      { error: "Failed to delete drug" },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}
