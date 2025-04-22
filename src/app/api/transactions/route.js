// app/api/transactions/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Generate unique transaction code
function generateTransactionCode() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `TRX-${year}${month}${day}-${random}`;
}

// GET all transactions with pagination
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  try {
    const transactions = await db.transaction.findMany({
      skip,
      take: limit,
      orderBy: {
        date: "desc",
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const total = await db.transaction.count();

    return NextResponse.json({
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Error fetching transactions" },
      { status: 500 }
    );
  }
}

// POST new transaction
export async function POST(request) {
  try {
    const body = await request.json();
    const { items, paid, notes } = body;

    // Calculate totals
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const change = paid - totalAmount;

    if (change < 0) {
      return NextResponse.json(
        { error: "Insufficient payment amount" },
        { status: 400 }
      );
    }

    // Create transaction with items in a single database transaction with increased timeout
    const transaction = await db.$transaction(
      async (tx) => {
        // 1. Create the transaction record
        const createdTransaction = await tx.transaction.create({
          data: {
            transactionCode: generateTransactionCode(),
            totalAmount,
            paid,
            change,
            notes,
            items: {
              create: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.price * item.quantity,
              })),
            },
          },
          include: {
            items: true,
          },
        });

        // 2. Update product stock and record inventory movements
        for (const item of items) {
          // Reduce product stock
          await tx.drugStoreProduct.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });

          // Record inventory movement
          await tx.inventoryMovement.create({
            data: {
              productId: item.productId,
              type: "OUT",
              quantity: item.quantity,
              reason: "SALE",
              referenceId: createdTransaction.id.toString(),
            },
          });
        }

        // 3. Create financial record for this sale
        await tx.financialRecord.create({
          data: {
            type: "INCOME",
            category: "SALES",
            amount: totalAmount,
            description: `Sale transaction ${createdTransaction.transactionCode}`,
            referenceId: createdTransaction.id.toString(),
          },
        });

        return createdTransaction;
      },
      {
        timeout: 15000, // Increase timeout to 15 seconds
      }
    );

    return NextResponse.json({ data: transaction }, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Error creating transaction" },
      { status: 500 }
    );
  }
}
