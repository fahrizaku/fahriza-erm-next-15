import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "20");

    // First, find products where the name matches
    const nameMatches = await db.drugStoreProduct.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // If we haven't reached the limit, find additional products that match by ingredient
    let ingredientMatches = [];
    if (nameMatches.length < limit) {
      ingredientMatches = await db.drugStoreProduct.findMany({
        where: {
          AND: [
            {
              id: {
                notIn: nameMatches.map((product) => product.id),
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
        take: limit - nameMatches.length,
      });
    }

    // Combine the results, with name matches first
    const products = [...nameMatches, ...ingredientMatches];

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
