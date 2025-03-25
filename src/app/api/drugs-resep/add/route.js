// api/drugs/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();

    // Validasi data
    const requiredFields = [
      "name",
      "category",
      "manufacturer",
      "purchasePrice",
      "price",
      "stock",
      "unit",
    ];
    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        return NextResponse.json(
          { error: `Field '${field}' harus diisi` },
          { status: 400 }
        );
      }
    }

    // Konversi dan validasi tipe data numerik
    const purchasePrice = parseFloat(body.purchasePrice);
    const price = parseFloat(body.price);
    const stock = parseInt(body.stock);

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
      category: body.category,
      manufacturer: body.manufacturer,
      purchasePrice: purchasePrice,
      price: price,
      stock: stock,
      unit: body.unit,
    };

    // Hanya tambahkan expiryDate jika ada nilainya
    if (body.expiryDate) {
      drugData.expiryDate = body.expiryDate;
    }

    // Debug log
    console.log("Attempting to create drug with data:", drugData);

    // Simpan data obat
    const newDrug = await db.drugPrescription.create({
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
          { error: "Referensi ke data yang tidak ada" },
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
