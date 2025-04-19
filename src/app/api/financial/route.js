// app/api/financial/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET financial records with pagination
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const skip = (page - 1) * limit;

  const where = {};
  if (type) where.type = type;
  if (category) where.category = category;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  try {
    const records = await db.financialRecord.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        date: "desc",
      },
    });

    const total = await db.financialRecord.count({ where });

    // Calculate summary
    const income = await db.financialRecord.aggregate({
      where: { ...where, type: "INCOME" },
      _sum: { amount: true },
    });

    const expense = await db.financialRecord.aggregate({
      where: { ...where, type: "EXPENSE" },
      _sum: { amount: true },
    });

    const balance = (income._sum.amount || 0) - (expense._sum.amount || 0);

    return NextResponse.json({
      data: records,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        summary: {
          income: income._sum.amount || 0,
          expense: expense._sum.amount || 0,
          balance,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching financial records:", error);
    return NextResponse.json(
      { error: "Error fetching financial records" },
      { status: 500 }
    );
  }
}

// POST new financial record
export async function POST(request) {
  try {
    const body = await request.json();
    const { type, category, amount, description } = body;

    // Validate required fields
    if (!type || !category || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const record = await db.financialRecord.create({
      data: {
        type,
        category,
        amount,
        description,
      },
    });

    return NextResponse.json({ data: record }, { status: 201 });
  } catch (error) {
    console.error("Error creating financial record:", error);
    return NextResponse.json(
      { error: "Error creating financial record" },
      { status: 500 }
    );
  }
}
