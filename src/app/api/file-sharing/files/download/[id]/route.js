// app/api/files/download/[id]/route.js - Updated for Auto Increment ID
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { db } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // PENTING: Parse ID menjadi integer
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    // Cari file di database dengan integer ID
    const file = await db.generatedDocument.findUnique({
      where: { id: parsedId }, // Gunakan integer ID
    });

    if (!file) {
      return NextResponse.json(
        { message: "File tidak ditemukan" },
        { status: 404 }
      );
    }

    // Baca file
    const fileBuffer = await readFile(file.filePath);

    // Tentukan content type berdasarkan ekstensi file
    const contentType = getContentType(file.fileName);

    // Buat response dengan headers yang tepat
    const response = new NextResponse(fileBuffer);

    // Set header untuk download
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(file.fileName)}"`
    );
    response.headers.set("Content-Type", contentType);

    return response;
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mendownload file" },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}

// Helper function untuk menentukan content type
function getContentType(fileName) {
  const extension = fileName.split(".").pop().toLowerCase();

  switch (extension) {
    case "pdf":
      return "application/pdf";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "doc":
      return "application/msword";
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "xls":
      return "application/vnd.ms-excel";
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "txt":
      return "text/plain";
    default:
      return "application/octet-stream";
  }
}
