// File: /app/api/drug-store-products/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "10");

    const products = await db.drugStoreProduct.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: {
        name: "asc",
      },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      products: products.map(product => ({
        id: product.id,
        name: product.name,
        displayName: `${product.name} - ${product.unit}`,
        unit: product.unit,
        price: product.price,
        stock: product.stock
      }))
    });
  } catch (error) {
    console.error("Error fetching drug store products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch drug store products" },
      { status: 500 }
    );
  }
}