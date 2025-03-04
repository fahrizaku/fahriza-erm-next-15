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
    const where = {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ],
      ...(sortBy === "expiryDate" && { expiryDate: { not: "" } }),
    };

    const drugStoreProducts = await db.drugStoreProduct.findMany({
      where,
      skip: offset,
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return NextResponse.json(drugStoreProducts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch drug store products" },
      { status: 500 }
    );
  }
}
