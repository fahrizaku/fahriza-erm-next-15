// app/api/files/download/[id]/route.js
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { db } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Cari file di database
    const file = await db.generatedDocument.findUnique({
      where: { id: id },
    });

    if (!file) {
      return NextResponse.json(
        { message: "File tidak ditemukan" },
        { status: 404 }
      );
    }

    // Baca file
    const fileBuffer = await readFile(file.filePath);

    // Buat response dengan headers yang tepat
    const response = new NextResponse(fileBuffer);

    // Set header untuk download
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="${file.fileName}"`
    );
    response.headers.set("Content-Type", "application/octet-stream");

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
