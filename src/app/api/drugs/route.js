import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const offset = parseInt(searchParams.get("offset")) || 0;
  const pageSize = 15;
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "updatedAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  try {
    let drugStoreProducts;

    if (search) {
      // Jika ada pencarian, gunakan raw query untuk prioritas
      const orderByClause = `ORDER BY 
        CASE 
          WHEN LOWER("name") LIKE LOWER($1) THEN 1
          WHEN LOWER("name") LIKE LOWER($2) THEN 2
          WHEN LOWER("category") LIKE LOWER($3) THEN 3
          WHEN LOWER("ingredients") LIKE LOWER($4) THEN 4
          ELSE 5
        END,
        "${sortBy}" ${sortOrder.toUpperCase()}`;

      const whereClause = `WHERE (
        LOWER("name") LIKE LOWER($5) OR 
        LOWER("category") LIKE LOWER($6) OR 
        LOWER("ingredients") LIKE LOWER($7)
      )${
        sortBy === "expiryDate"
          ? ' AND "expiryDate" IS NOT NULL AND "expiryDate" != \'\''
          : ""
      }`;

      const searchExact = `%${search}%`;
      const searchStart = `${search}%`;

      const query = `
        SELECT * FROM "DrugStoreProduct" 
        ${whereClause}
        ${orderByClause}
        OFFSET $8 LIMIT $9
      `;

      drugStoreProducts = await db.$queryRawUnsafe(
        query,
        searchExact, // $1 - untuk exact match name
        searchStart, // $2 - untuk name starts with
        searchExact, // $3 - untuk category
        searchExact, // $4 - untuk ingredients
        searchExact, // $5 - untuk name dalam WHERE
        searchExact, // $6 - untuk category dalam WHERE
        searchExact, // $7 - untuk ingredients dalam WHERE
        offset, // $8 - offset
        pageSize // $9 - limit
      );

      // Convert Decimal fields back to numbers for consistency
      drugStoreProducts = drugStoreProducts.map((product) => ({
        ...product,
        purchasePrice: product.purchasePrice
          ? Number(product.purchasePrice)
          : null,
        price: Number(product.price),
      }));
    } else {
      // Jika tidak ada pencarian, gunakan Prisma biasa
      const where = {
        ...(sortBy === "expiryDate" && {
          expiryDate: {
            not: null,
            not: "",
          },
        }),
      };

      drugStoreProducts = await db.drugStoreProduct.findMany({
        where,
        skip: offset,
        take: pageSize,
        orderBy: {
          [sortBy]: sortOrder,
        },
      });
    }

    return NextResponse.json(drugStoreProducts);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch drug store products" },
      { status: 500 }
    );
  }
}
