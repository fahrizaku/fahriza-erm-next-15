// app/api/files/route.js
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const dbPath = join(process.cwd(), "uploads", "db.json");
    let db = { files: [] };

    try {
      const dbContent = await readFile(dbPath, "utf-8");
      db = JSON.parse(dbContent);
    } catch (error) {
      // File db.json mungkin belum ada
    }

    // Kirim hanya metadata yang diperlukan
    const files = db.files.map((file) => ({
      id: file.id,
      name: file.name,
      size: file.size,
      createdAt: file.createdAt,
    }));

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error getting files:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil daftar file" },
      { status: 500 }
    );
  }
}
