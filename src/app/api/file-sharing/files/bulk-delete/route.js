// app/api/file-sharing/files/bulk-delete/route.js
import { NextResponse } from "next/server";
import { readFile, writeFile, unlink, readdir } from "fs/promises";
import { join } from "path";

export async function DELETE() {
  try {
    const dbPath = join(process.cwd(), "uploads", "db.json");
    const uploadsDir = join(process.cwd(), "uploads");
    
    let db = { files: [] };
    
    try {
      const dbContent = await readFile(dbPath, "utf-8");
      db = JSON.parse(dbContent);
    } catch (error) {
      return NextResponse.json({ message: "Database tidak ditemukan" }, { status: 404 });
    }

    if (db.files.length === 0) {
      return NextResponse.json({ message: "Tidak ada file untuk dihapus" }, { status: 400 });
    }

    // Hapus semua file fisik
    const deletePromises = db.files.map(async (file) => {
      try {
        // Cek berbagai kemungkinan nama field untuk filename
        const filename = file.filename || file.fileName || file.path || file.id;
        
        if (!filename) {
          console.error("File object missing filename:", file);
          return;
        }

        const filePath = join(uploadsDir, filename);
        await unlink(filePath);
      } catch (error) {
        console.error(`Gagal menghapus file ${file.filename || file.id}:`, error);
        // Lanjutkan meskipun ada file yang gagal dihapus
      }
    });

    await Promise.allSettled(deletePromises);

    // Kosongkan database
    db.files = [];
    await writeFile(dbPath, JSON.stringify(db, null, 2));

    return NextResponse.json({ 
      message: "Semua file berhasil dihapus",
      deletedCount: deletePromises.length 
    });

  } catch (error) {
    console.error("Error deleting all files:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menghapus file" },
      { status: 500 }
    );
  }
}