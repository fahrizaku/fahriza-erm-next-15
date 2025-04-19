// app/api/transactions/[id]/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET transaction by ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);

    const transaction = await db.transaction.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: transaction });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json(
      { error: "Error fetching transaction" },
      { status: 500 }
    );
  }
}

// DELETE transaction (Cancel)
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    // Get transaction with items before cancelling
    const transaction = await db.transaction.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Update transaction in a database transaction
    await db.$transaction(async (tx) => {
      // 1. Update transaction status
      await tx.transaction.update({
        where: { id },
        data: { status: "CANCELLED" },
      });

      // 2. Restore product stock for each item
      for (const item of transaction.items) {
        // Increment product stock
        await tx.drugStoreProduct.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });

        // Record inventory movement (return to stock)
        await tx.inventoryMovement.create({
          data: {
            productId: item.productId,
            type: "IN",
            quantity: item.quantity,
            reason: "CANCELLED_SALE",
            referenceId: id.toString(),
            notes: "Transaction cancelled",
          },
        });
      }

      // 3. Create financial record for cancellation
      await tx.financialRecord.create({
        data: {
          type: "EXPENSE",
          category: "CANCELLED_SALE",
          amount: transaction.totalAmount,
          description: `Cancelled transaction ${transaction.transactionCode}`,
          referenceId: id.toString(),
        },
      });
    });

    return NextResponse.json({ message: "Transaction cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling transaction:", error);
    return NextResponse.json(
      { error: "Error cancelling transaction" },
      { status: 500 }
    );
  }
}
