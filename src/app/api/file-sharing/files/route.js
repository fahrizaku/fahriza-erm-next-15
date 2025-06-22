// app/api/files/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    // Kondisi pencarian berdasarkan nama file atau nama pasien
    const whereCondition = search
      ? {
          OR: [
            { fileName: { contains: search, mode: "insensitive" } },
            {
              vaksinData: {
                nama: { contains: search, mode: "insensitive" },
              },
            },
            { formattedQueueNumber: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    // Ambil data files dengan informasi pasien terkait
    const [files, totalCount] = await Promise.all([
      db.generatedDocument.findMany({
        where: whereCondition,
        include: {
          vaksinData: {
            select: {
              id: true,
              nama: true,
              noTelp: true,
              nomorAntrian: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      db.generatedDocument.count({
        where: whereCondition,
      }),
    ]);

    // Format response dengan informasi file dan ukuran file
    const filesWithSize = files.map((file) => {
      let fileSize = 0;
      try {
        if (fs.existsSync(file.filePath)) {
          const stats = fs.statSync(file.filePath);
          fileSize = stats.size;
        }
      } catch (error) {
        console.error("Error getting file size:", error);
      }

      return {
        id: file.id,
        name: file.fileName,
        path: file.filePath,
        size: fileSize,
        formattedSize: formatFileSize(fileSize),
        queueNumber: file.queueNumber,
        formattedQueueNumber: file.formattedQueueNumber,
        queueDate: file.queueDate,
        createdAt: file.createdAt,
        fileExists: fs.existsSync(file.filePath),
        // Informasi pasien
        patient: {
          id: file.vaksinData.id,
          nama: file.vaksinData.nama,
          noTelp: file.vaksinData.noTelp,
          nomorAntrian: file.vaksinData.nomorAntrian,
        },
      };
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      files: filesWithSize,
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
    console.error("Error getting files:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan saat mengambil daftar file: " + error.message,
      },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}

// Helper function untuk format ukuran file
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
