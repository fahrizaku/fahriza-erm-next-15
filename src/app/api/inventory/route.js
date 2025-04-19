// app/api/inventory/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET inventory movements with pagination
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const productId = searchParams.get("productId");
  const type = searchParams.get("type");
  const skip = (page - 1) * limit;

  const where = {};
  if (productId) where.productId = parseInt(productId);
  if (type) where.type = type;

  try {
    const movements = await db.inventoryMovement.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        date: "desc",
      },
      include: {
        product: true,
      },
    });

    const total = await db.inventoryMovement.count({ where });

    return NextResponse.json({
      data: movements,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching inventory movements:", error);
    return NextResponse.json(
      { error: "Error fetching inventory movements" },
      { status: 500 }
    );
  }
}

// POST new inventory movement
export async function POST(request) {
  try {
    const body = await request.json();
    const { productId, type, quantity, reason, notes } = body;

    // Validate required fields
    if (!productId || !type || !quantity || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create inventory movement in a transaction
    const result = await db.$transaction(async (tx) => {
      // Get current product
      const product = await tx.drugStoreProduct.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      // Update stock
      let updatedProduct;
      if (type === "IN") {
        updatedProduct = await tx.drugStoreProduct.update({
          where: { id: productId },
          data: { stock: { increment: quantity } },
        });
      } else if (type === "OUT") {
        // Ensure we have enough stock
        if (product.stock < quantity) {
          throw new Error("Insufficient stock");
        }

        updatedProduct = await tx.drugStoreProduct.update({
          where: { id: productId },
          data: { stock: { decrement: quantity } },
        });
      }

      // Create movement record
      const movement = await tx.inventoryMovement.create({
        data: {
          productId,
          type,
          quantity,
          reason,
          notes,
        },
        include: {
          product: true,
        },
      });

      // Create financial record if needed
      if (reason === "PURCHASE") {
        const totalCost = quantity * (product.purchasePrice || 0);
        await tx.financialRecord.create({
          data: {
            type: "EXPENSE",
            category: "INVENTORY_PURCHASE",
            amount: totalCost,
            description: `Purchase of ${quantity} ${product.unit} of ${product.name}`,
            referenceId: movement.id.toString(),
          },
        });
      } else if (reason === "ADJUSTMENT" && type === "OUT") {
        const totalCost = quantity * (product.purchasePrice || 0);
        await tx.financialRecord.create({
          data: {
            type: "EXPENSE",
            category: "INVENTORY_LOSS",
            amount: totalCost,
            description: `Inventory adjustment - ${notes || "No details"}`,
            referenceId: movement.id.toString(),
          },
        });
      }

      return { movement, updatedProduct };
    });

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    console.error("Error creating inventory movement:", error);
    if (
      error.message === "Insufficient stock" ||
      error.message === "Product not found"
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Error creating inventory movement" },
      { status: 500 }
    );
  }
}
