// app/api/upload/route.js
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { message: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buat direktori uploads jika belum ada
    const uploadDir = join(process.cwd(), "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Direktori mungkin sudah ada
    }

    // Buat ID unik untuk file
    const id = uuidv4();
    const fileName = file.name;
    const filePath = join(uploadDir, id + "_" + fileName);

    // Simpan file
    await writeFile(filePath, buffer);

    // Simpan metadata file ke JSON (sebagai contoh, bisa diganti dengan database)
    const dbPath = join(process.cwd(), "uploads", "db.json");
    let db = { files: [] };

    try {
      const dbContent = await import("fs").then((fs) =>
        fs.readFileSync(dbPath, "utf-8")
      );
      db = JSON.parse(dbContent);
    } catch (error) {
      // File db.json mungkin belum ada
    }

    // Tambahkan file baru
    db.files.push({
      id,
      name: fileName,
      path: filePath,
      size: file.size,
      createdAt: new Date().toISOString(),
    });

    // Simpan kembali ke JSON
    await writeFile(dbPath, JSON.stringify(db, null, 2));

    return NextResponse.json({
      message: "File berhasil diunggah",
      fileId: id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengunggah file" },
      { status: 500 }
    );
  }
}
