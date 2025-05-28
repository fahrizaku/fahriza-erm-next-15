// app/api/products/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET handler for fetching products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");
    const limitParam = searchParams.get("limit");
    const stockParam = searchParams.get("stock");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(limitParam || "20");
    const skip = (page - 1) * pageSize;

    // Build filter conditions
    let where = {};
    let orderBy = { name: "asc" }; // Default ordering

    if (categoryParam) {
      where.category = {
        contains: categoryParam,
        mode: "insensitive",
      };
    }

    if (searchParam) {
      where.OR = [
        {
          name: {
            contains: searchParam,
            mode: "insensitive",
          },
        },
        {
          ingredients: {
            contains: searchParam,
            mode: "insensitive",
          },
        },
        {
          manufacturer: {
            contains: searchParam,
            mode: "insensitive",
          },
        },
      ];
    }

    // Handle low stock filter (for dashboard)
    if (stockParam === "low") {
      where.stock = {
        lte: 5, // Products with stock less than or equal to 5 are considered low stock
      };
    }

    // Count total products with applied filters
    const totalCount = await db.drugStoreProduct.count({ where });

    let products;

    // If there's a search term, we need to prioritize by name match
    if (searchParam) {
      // First, get products that match by name (highest priority)
      const nameMatches = await db.drugStoreProduct.findMany({
        where: {
          ...where,
          OR: undefined, // Remove the OR condition
          name: {
            contains: searchParam,
            mode: "insensitive",
          },
        },
        skip,
        take: pageSize,
        orderBy: {
          name: "asc",
        },
        include: {
          supplier: {
            select: {
              name: true,
            },
          },
        },
      });

      // Calculate how many more products we need
      const remainingSlots = pageSize - nameMatches.length;

      if (remainingSlots > 0 && skip === 0) {
        // Only for first page, get additional matches from ingredients/manufacturer
        // but exclude products already found by name
        const nameMatchIds = nameMatches.map((p) => p.id);

        const otherMatches = await db.drugStoreProduct.findMany({
          where: {
            ...where,
            OR: [
              {
                ingredients: {
                  contains: searchParam,
                  mode: "insensitive",
                },
              },
              {
                manufacturer: {
                  contains: searchParam,
                  mode: "insensitive",
                },
              },
            ],
            id: {
              notIn: nameMatchIds, // Exclude products already matched by name
            },
          },
          take: remainingSlots,
          orderBy: {
            name: "asc",
          },
          include: {
            supplier: {
              select: {
                name: true,
              },
            },
          },
        });

        products = [...nameMatches, ...otherMatches];
      } else {
        products = nameMatches;
      }
    } else {
      // Normal query without search
      products = await db.drugStoreProduct.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: {
          supplier: {
            select: {
              name: true,
            },
          },
        },
      });
    }

    // Return data in format expected by dashboard
    return NextResponse.json({
      success: true,
      data: products,
      meta: {
        total: totalCount,
        lowStock: stockParam === "low" ? products.length : undefined,
      },
      pagination: {
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        currentPage: page,
        pageSize,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST handler for creating a new product
export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.price || data.stock === undefined || !data.unit) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new product
    const newProduct = await db.drugStoreProduct.create({
      data: {
        name: data.name,
        category: data.category || null,
        manufacturer: data.manufacturer || null,
        supplierId: data.supplierId || null,
        purchasePrice: data.purchasePrice || null,
        price: data.price,
        stock: data.stock,
        expiryDate: data.expiryDate || null,
        batchNumber: data.batchNumber || null,
        unit: data.unit,
        ingredients: data.ingredients || null,
      },
    });

    // Create inventory movement record for initial stock
    if (data.stock > 0) {
      await db.inventoryMovement.create({
        data: {
          productId: newProduct.id,
          type: "IN",
          quantity: data.stock,
          reason: "INITIAL",
          notes: "Initial stock entry",
          date: new Date(), // Add current date for the movement
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}

// PUT handler for updating a product
export async function PUT(request) {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Update the product
    const updatedProduct = await db.drugStoreProduct.update({
      where: { id: data.id },
      data: {
        name: data.name,
        category: data.category || null,
        manufacturer: data.manufacturer || null,
        supplierId: data.supplierId || null,
        purchasePrice: data.purchasePrice || null,
        price: data.price,
        stock: data.stock,
        expiryDate: data.expiryDate || null,
        batchNumber: data.batchNumber || null,
        unit: data.unit,
        ingredients: data.ingredients || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE handler for removing a product
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await db.drugStoreProduct.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Delete product
    await db.drugStoreProduct.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
