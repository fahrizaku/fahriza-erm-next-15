import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();

    // Validasi data
    const requiredFields = ["name", "price", "unit"];
    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        return NextResponse.json(
          { error: `Field '${field}' harus diisi` },
          { status: 400 }
        );
      }
    }

    // Konversi dan validasi tipe data numerik
    const purchasePrice = parseFloat(body.purchasePrice || 0);
    const price = parseFloat(body.price);
    const stock = parseInt(body.stock || 100);
    const supplierId = body.supplierId ? parseInt(body.supplierId) : null;

    if (isNaN(purchasePrice) || purchasePrice < 0) {
      return NextResponse.json(
        { error: "Harga beli harus berupa angka positif" },
        { status: 400 }
      );
    }

    if (isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: "Harga jual harus berupa angka positif" },
        { status: 400 }
      );
    }

    if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
      return NextResponse.json(
        { error: "Stok harus berupa bilangan bulat positif" },
        { status: 400 }
      );
    }

    // Menyiapkan data untuk prisma dengan tipe data yang benar
    const drugData = {
      name: body.name,
      category: body.category || null,
      manufacturer: body.manufacturer || null,
      purchasePrice: purchasePrice,
      price: price,
      stock: stock,
      unit: body.unit,
      ingredients: body.ingredients || null,
      batchNumber: body.batchNumber || null,
    };

    // Tambahkan supplierId jika ada
    if (supplierId) {
      drugData.supplierId = supplierId;
    }

    // Hanya tambahkan expiryDate jika ada nilainya
    if (body.expiryDate) {
      drugData.expiryDate = body.expiryDate;
    }

    // Debug log
    console.log("Attempting to create drug with data:", drugData);

    // Simpan data obat
    const newDrug = await db.drugStoreProduct.create({
      data: drugData,
    });

    return NextResponse.json(newDrug, { status: 201 });
  } catch (error) {
    console.error("Error adding drug:", error);

    // Memberikan error detail yang lebih spesifik
    if (error.code) {
      // Prisma error codes
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Data dengan nilai unik yang sama sudah ada" },
          { status: 409 }
        );
      }

      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Referensi ke supplier yang tidak ada" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: `Gagal menambahkan obat: ${error.message}` },
      { status: 500 }
    );
  }
}
