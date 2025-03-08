// app/api/files/[id]/route.js
import { NextResponse } from "next/server";
import { readFile, writeFile, unlink } from "fs/promises";
import { join } from "path";

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const dbPath = join(process.cwd(), "uploads", "db.json");

    // Baca database
    const dbContent = await readFile(dbPath, "utf-8");
    let db = JSON.parse(dbContent);

    // Cari file
    const fileIndex = db.files.findIndex((file) => file.id === id);
    if (fileIndex === -1) {
      return NextResponse.json(
        { message: "File tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus file dari sistem
    const filePath = db.files[fileIndex].path;
    try {
      await unlink(filePath);
    } catch (error) {
      console.error("Error deleting file from filesystem:", error);
    }

    // Hapus dari database
    db.files.splice(fileIndex, 1);
    await writeFile(dbPath, JSON.stringify(db, null, 2));

    return NextResponse.json({ message: "File berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menghapus file" },
      { status: 500 }
    );
  }
}
