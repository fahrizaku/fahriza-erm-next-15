import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET specific supplier by ID
export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    const parsedId = parseInt(id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID supplier tidak valid" },
        { status: 400 }
      );
    }

    const supplier = await db.supplier.findUnique({
      where: {
        id: id,
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            category: true,
            manufacturer: true,
            price: true,
            stock: true,
            unit: true,
          },
        },
      },
    });

    if (!supplier) {
      return NextResponse.json(
        { error: "Supplier tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("Error fetching supplier:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data supplier" },
      { status: 500 }
    );
  }
}

// DELETE supplier by ID
export async function DELETE(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID supplier tidak valid" },
        { status: 400 }
      );
    }

    // Check if supplier exists
    const existingSupplier = await db.supplier.findUnique({
      where: {
        id: id,
      },
      include: {
        products: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!existingSupplier) {
      return NextResponse.json(
        { error: "Supplier tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if supplier has associated products
    if (existingSupplier.products.length > 0) {
      return NextResponse.json(
        {
          error:
            "Supplier tidak dapat dihapus karena masih memiliki produk terkait",
          productCount: existingSupplier.products.length,
        },
        { status: 400 }
      );
    }

    // Delete supplier
    await db.supplier.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Supplier berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return NextResponse.json(
      { error: "Gagal menghapus supplier" },
      { status: 500 }
    );
  }
}

// UPDATE supplier by ID
export async function PATCH(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID supplier tidak valid" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Validate required fields
    if (!body.name || body.name.trim() === "") {
      return NextResponse.json(
        { error: "Nama supplier wajib diisi" },
        { status: 400 }
      );
    }

    // Check if supplier exists
    const existingSupplier = await db.supplier.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingSupplier) {
      return NextResponse.json(
        { error: "Supplier tidak ditemukan" },
        { status: 404 }
      );
    }

    // Prepare data for update
    const supplierData = {
      name: body.name,
      contactName: body.contactName || null,
      phone: body.phone || null,
      email: body.email || null,
      address: body.address || null,
      notes: body.notes || null,
    };

    // Update supplier
    const updatedSupplier = await db.supplier.update({
      where: {
        id: id,
      },
      data: supplierData,
    });

    return NextResponse.json(updatedSupplier);
  } catch (error) {
    console.error("Error updating supplier:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui supplier" },
      { status: 500 }
    );
  }
}
