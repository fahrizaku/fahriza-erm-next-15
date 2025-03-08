// app/api/files/download/[id]/route.js
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { createReadStream } from "fs";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const dbPath = join(process.cwd(), "uploads", "db.json");

    // Baca database
    const dbContent = await readFile(dbPath, "utf-8");
    let db = JSON.parse(dbContent);

    // Cari file
    const file = db.files.find((file) => file.id === id);
    if (!file) {
      return NextResponse.json(
        { message: "File tidak ditemukan" },
        { status: 404 }
      );
    }

    // Baca file
    const fileBuffer = await readFile(file.path);

    // Buat response dengan headers yang tepat
    const response = new NextResponse(fileBuffer);

    // Set header untuk download
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="${file.name}"`
    );
    response.headers.set("Content-Type", "application/octet-stream");

    return response;
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mendownload file" },
      { status: 500 }
    );
  }
}
