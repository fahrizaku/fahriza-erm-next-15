// File: /app/api/drug-prescriptions/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "10");

    // Search by name OR ingredient
    const products = await db.drugStoreProduct.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            ingredients: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        name: "asc",
      },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        displayName: `${product.name} - ${product.unit}`,
        unit: product.unit,
        price: product.price,
        stock: product.stock,
        ingredient: product.ingredients || null,
      })),
    });
  } catch (error) {
    console.error("Error fetching drug store products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch drug store products" },
      { status: 500 }
    );
  }
}
