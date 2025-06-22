// /api/data-vaksin/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Pastikan prisma sudah di-setup

// GET - Ambil semua data vaksin
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    // Kondisi pencarian
    const whereCondition = search
      ? {
          OR: [
            { nama: { contains: search, mode: "insensitive" } },
            { noTelp: { contains: search, mode: "insensitive" } },
            { alamat: { contains: search, mode: "insensitive" } },
            { namaTravel: { contains: search, mode: "insensitive" } },
            { nomorAntrian: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    // Ambil data dengan pagination dan pencarian
    const [data, totalCount] = await Promise.all([
      db.vaksinData.findMany({
        where: whereCondition,
        include: {
          documents: {
            select: {
              id: true,
              fileName: true,
              filePath: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      db.vaksinData.count({
        where: whereCondition,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data: " + error.message },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}

// POST - Tambah data vaksin baru
export async function POST(req) {
  try {
    const formData = await req.json();

    const newRecord = await db.vaksinData.create({
      data: {
        nama: formData.nama || "",
        noTelp: formData.no_telp || "",
        alamat: formData.alamat || "",
        kotaKelahiran: formData.kotaKelahiran || "",
        tanggalLahir: formData.tanggalLahir || "",
        umur: formData.umur || "",
        jenisKelamin: formData.jenisKelamin || "",
        namaTravel: formData.namaTravel || "",
        tanggalKeberangkatan: formData.tanggalKeberangkatan || "",
        asalTravel: formData.asalTravel || "",
        nomorAntrian: formData.nomorAntrian || "",
        tanggalAntrian: formData.tanggalAntrian || "",
      },
      include: {
        documents: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data berhasil disimpan",
      data: newRecord,
    });
  } catch (error) {
    console.error("Error creating data:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data: " + error.message },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}

// PUT - Update data vaksin
export async function PUT(req) {
  try {
    const { id, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    // Cek apakah data exists
    const existingData = await db.vaksinData.findUnique({
      where: { id },
    });

    if (!existingData) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    const updatedRecord = await db.vaksinData.update({
      where: { id },
      data: {
        nama: updateData.nama,
        noTelp: updateData.no_telp,
        alamat: updateData.alamat,
        kotaKelahiran: updateData.kotaKelahiran,
        tanggalLahir: updateData.tanggalLahir,
        umur: updateData.umur,
        jenisKelamin: updateData.jenisKelamin,
        namaTravel: updateData.namaTravel,
        tanggalKeberangkatan: updateData.tanggalKeberangkatan,
        asalTravel: updateData.asalTravel,
        nomorAntrian: updateData.nomorAntrian,
        tanggalAntrian: updateData.tanggalAntrian,
      },
      include: {
        documents: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data berhasil diupdate",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate data: " + error.message },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}

// DELETE - Hapus data vaksin
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    // Cek apakah data exists
    const existingData = await db.vaksinData.findUnique({
      where: { id },
      include: {
        documents: true,
      },
    });

    if (!existingData) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus file dokumen dari sistem file jika ada
    if (existingData.documents.length > 0) {
      const fs = require("fs");
      existingData.documents.forEach((doc) => {
        try {
          if (fs.existsSync(doc.filePath)) {
            fs.unlinkSync(doc.filePath);
          }
        } catch (error) {
          console.error("Error deleting file:", doc.filePath, error);
        }
      });
    }

    // Hapus data dari database (cascade delete akan menghapus documents terkait)
    await prisma.vaksinData.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Data berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data: " + error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
